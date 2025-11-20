import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { Program } from "@/models/Program";
import { calculatePaymentAmount } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { programId } = body;

    if (!programId) {
      return NextResponse.json(
        { error: "Program ID is required" },
        { status: 400 }
      );
    }

    await connectDB();

    const program = await Program.findOne({
      _id: programId,
      userId: session.user.id,
    });

    if (!program) {
      return NextResponse.json({ error: "Program not found" }, { status: 404 });
    }

    // Block payments for pending programs
    if (program.status === "pending") {
      return NextResponse.json(
        { error: "Program must be approved before payments can be made" },
        { status: 403 }
      );
    }

    // Block payments for revoked programs
    if (program.status === "revoked") {
      return NextResponse.json(
        { error: "This program has been revoked. Please contact support." },
        { status: 403 }
      );
    }

    // Block payments for frozen programs
    if (program.status === "frozen") {
      return NextResponse.json(
        {
          error:
            "This program is frozen due to missed payment. Payment will unfreeze and reset your schedule.",
        },
        { status: 403 }
      );
    }

    if (program.isCompleted) {
      return NextResponse.json(
        { error: "Program already completed" },
        { status: 400 }
      );
    }

    // Calculate payment amount based on schedule
    const paymentAmount = calculatePaymentAmount(
      program.costPerMonth,
      program.paymentSchedule,
      program.duration
    );
    const remainingAmount = program.totalAmount - program.amountPaid;
    const actualPaymentAmount = Math.min(paymentAmount, remainingAmount);

    // Initialize Paystack payment
    const paystackData = {
      email: session.user.email,
      amount: Math.round(actualPaymentAmount * 100), // Convert to kobo
      currency: "NGN",
      reference: `${programId}_${Date.now()}`,
      callback_url: `${process.env.NEXTAUTH_URL}/api/payments/verify`,
      metadata: {
        programId,
        userId: session.user.id,
        paymentSchedule: program.paymentSchedule,
        custom_fields: [
          {
            display_name: "Program Name",
            variable_name: "program_name",
            value: program.programName,
          },
        ],
      },
    };

    const paystackResponse = await fetch(
      "https://api.paystack.co/transaction/initialize",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paystackData),
      }
    );

    if (!paystackResponse.ok) {
      throw new Error("Paystack initialization failed");
    }

    const paymentData = await paystackResponse.json();

    return NextResponse.json({
      authorization_url: paymentData.data.authorization_url,
      access_code: paymentData.data.access_code,
      reference: paymentData.data.reference,
    });
  } catch (error) {
    console.error("Payment initialization error:", error);
    return NextResponse.json(
      { error: "Payment initialization failed" },
      { status: 500 }
    );
  }
}
