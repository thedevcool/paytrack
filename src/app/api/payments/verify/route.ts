import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Program } from "@/models/Program";
import { Payment } from "@/models/Payment";
import { calculateNextPaymentDate } from "@/lib/utils";
import { sendPaymentConfirmation, sendAdminNotification } from "@/lib/email";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const reference = searchParams.get("reference");

    if (!reference) {
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/dashboard?error=missing_reference`
      );
    }

    // Verify payment with Paystack
    const paystackResponse = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    if (!paystackResponse.ok) {
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/dashboard?error=verification_failed`
      );
    }

    const verificationData = await paystackResponse.json();

    if (verificationData.data.status !== "success") {
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/dashboard?error=payment_failed`
      );
    }

    await connectDB();

    const { metadata, amount, paid_at } = verificationData.data;
    const programId = metadata.programId;
    const userId = metadata.userId;
    const actualAmount = amount / 100; // Convert from kobo to naira

    // Find the program
    const program = await Program.findById(programId);
    if (!program) {
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/dashboard?error=program_not_found`
      );
    }

    // Create payment record
    const payment = new Payment({
      programId,
      userId,
      amount: actualAmount,
      reference,
      status: "success",
      paymentDate: new Date(paid_at),
      paymentMethod: "paystack",
    });

    await payment.save();

    // Update program
    const newAmountPaid = program.amountPaid + actualAmount;
    const isCompleted = newAmountPaid >= program.totalAmount;

    // Calculate next payment date - only set after first payment and if not completed
    let nextPaymentDate;
    if (!isCompleted && program.paymentSchedule !== "once") {
      nextPaymentDate = calculateNextPaymentDate(
        new Date(paid_at),
        program.paymentSchedule
      );
    }

    // Prepare update data
    const updateData: {
      $inc: { amountPaid: number };
      $push: { paymentHistory: { amount: number; date: Date; reference: string; status: string } };
      isCompleted: boolean;
      nextPaymentDate?: Date;
      status?: string;
      isFrozen?: boolean;
      $unset?: Record<string, string>;
    } = {
      $inc: { amountPaid: actualAmount },
      $push: {
        paymentHistory: {
          amount: actualAmount,
          date: new Date(paid_at),
          reference,
          status: "success",
        },
      },
      isCompleted,
    };

    // Only set nextPaymentDate if not completed and for non-once schedules
    if (!isCompleted && program.paymentSchedule !== "once") {
      updateData.nextPaymentDate = nextPaymentDate;
    }

    // If program was frozen, unfreeze it and reset schedule
    if (program.status === "frozen") {
      updateData.status = "approved";
      updateData.isFrozen = false;
      updateData.$unset = {
        frozenAt: "",
        frozenReason: "",
        lastMissedPaymentDate: "",
      };
      // Reset next payment date from current payment date
      if (!isCompleted && program.paymentSchedule !== "once") {
        updateData.nextPaymentDate = calculateNextPaymentDate(
          new Date(paid_at),
          program.paymentSchedule
        );
      }
    }

    // Update program with new payment
    await Program.findByIdAndUpdate(programId, updateData);

    // Send confirmation email
    try {
      await sendPaymentConfirmation(
        program.userEmail,
        program.userName,
        program.programName,
        actualAmount,
        reference
      );
    } catch (emailError) {
      console.error("Failed to send confirmation email:", emailError);
    }

    // Send admin notification about payment
    try {
      await sendAdminNotification("payment_made", {
        userName: program.userName,
        userEmail: program.userEmail,
        programName: program.programName,
        amount: actualAmount,
        paymentReference: reference,
      });
    } catch (emailError) {
      console.error("Failed to send admin notification:", emailError);
    }

    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/dashboard?success=payment_successful`
    );
  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/dashboard?error=verification_error`
    );
  }
}
