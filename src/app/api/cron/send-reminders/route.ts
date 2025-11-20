import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Program } from "@/models/Program";
import { sendPaymentReminder } from "@/lib/email";
import { calculatePaymentAmount } from "@/lib/utils";

export async function GET() {
  try {
    await connectDB();

    // Find programs that have overdue payments
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const overduePrograms = await Program.find({
      isCompleted: false,
      nextPaymentDate: { $lte: today },
      paymentSchedule: { $ne: "once" },
    });

    let remindersSent = 0;

    for (const program of overduePrograms) {
      try {
        const paymentAmount = calculatePaymentAmount(
          program.costPerMonth,
          program.paymentSchedule,
          program.duration
        );
        const remainingAmount = program.totalAmount - program.amountPaid;
        const actualPaymentAmount = Math.min(paymentAmount, remainingAmount);

        await sendPaymentReminder(
          program.userEmail,
          program.programName,
          actualPaymentAmount,
          program.nextPaymentDate
        );

        remindersSent++;
      } catch (error) {
        console.error(
          `Failed to send reminder for program ${program._id}:`,
          error
        );
      }
    }

    return NextResponse.json({
      message: `Sent ${remindersSent} payment reminders`,
      remindersSent,
      overduePrograms: overduePrograms.length,
    });
  } catch (error) {
    console.error("Cron job error:", error);
    return NextResponse.json({ error: "Cron job failed" }, { status: 500 });
  }
}
