import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Program } from "@/models/Program";
import { sendAdminNotification } from "@/lib/email";

export async function GET(request: NextRequest) {
  try {
    // Verify the request is from a valid cron service (optional security)
    const authHeader = request.headers.get("authorization");
    if (
      process.env.CRON_SECRET &&
      authHeader !== `Bearer ${process.env.CRON_SECRET}`
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const now = new Date();
    let processedPrograms = 0;

    // Freeze programs that missed payment deadlines (only those with nextPaymentDate set)
    const overduePrograms = await Program.find({
      status: "approved",
      nextPaymentDate: { $exists: true, $lt: now },
      isCompleted: false,
      isFrozen: false,
      amountPaid: { $gt: 0 }, // Only freeze programs that have made at least one payment
    });

    for (const program of overduePrograms) {
      program.status = "frozen";
      program.isFrozen = true;
      program.frozenAt = now;
      program.frozenReason = "Missed payment deadline";
      program.lastMissedPaymentDate = program.nextPaymentDate;
      await program.save();
      processedPrograms++;

      // Notify admin
      try {
        await sendAdminNotification("program_frozen", {
          userName: program.userName,
          userEmail: program.userEmail,
          programName: program.programName,
          missedPaymentDate: program.nextPaymentDate
            ? program.nextPaymentDate.toLocaleDateString()
            : new Date().toLocaleDateString(),
        });
      } catch (emailError) {
        console.error("Failed to send freeze notification:", emailError);
      }
    }

    return NextResponse.json({
      message: "Cron job completed successfully",
      frozenPrograms: overduePrograms.length,
      totalProcessed: processedPrograms,
      timestamp: now.toISOString(),
    });
  } catch (error) {
    console.error("Cron job failed:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
