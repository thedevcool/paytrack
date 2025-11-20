import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { Program } from "@/models/Program";
import { sendPaymentReminder } from "@/lib/email";
import { calculatePaymentAmount } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.isAdmin) {
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

    const program = await Program.findById(programId);

    if (!program) {
      return NextResponse.json({ error: "Program not found" }, { status: 404 });
    }

    if (program.isCompleted) {
      return NextResponse.json(
        { error: "Program already completed" },
        { status: 400 }
      );
    }

    // Calculate next payment amount
    const paymentAmount = calculatePaymentAmount(
      program.costPerMonth,
      program.paymentSchedule,
      program.duration
    );
    const remainingAmount = program.totalAmount - program.amountPaid;
    const actualPaymentAmount = Math.min(paymentAmount, remainingAmount);

    // Send reminder email
    await sendPaymentReminder(
      program.userEmail,
      program.programName,
      actualPaymentAmount,
      program.nextPaymentDate
    );

    return NextResponse.json({ message: "Reminder sent successfully" });
  } catch (error) {
    console.error("Error sending reminder:", error);
    return NextResponse.json(
      { error: "Failed to send reminder" },
      { status: 500 }
    );
  }
}
