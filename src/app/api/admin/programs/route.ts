import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { Program } from "@/models/Program";
import {
  sendProgramApprovalNotification,
  sendAdminNotification,
} from "@/lib/email";
import { calculatePaymentAmount } from "@/lib/utils";

// Check if user is admin
const isAdmin = (userEmail: string) => {
  const adminEmails = process.env.ADMIN_EMAILS?.split(",") || [
    process.env.GMAIL_USER,
  ];
  return adminEmails.includes(userEmail);
};

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email || !isAdmin(session.user.email)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { programId, action } = body;

    if (
      !programId ||
      !action ||
      !["approve", "revoke", "delete"].includes(action)
    ) {
      return NextResponse.json(
        { error: "Invalid programId or action" },
        { status: 400 }
      );
    }

    await connectDB();

    const program = await Program.findById(programId);
    if (!program) {
      return NextResponse.json({ error: "Program not found" }, { status: 404 });
    }

    if (action === "approve") {
      program.status = "approved";
      program.approvedAt = new Date();
      program.approvedBy = session.user.email;
      await program.save();

      // Calculate first payment amount
      const paymentAmount = calculatePaymentAmount(
        program.costPerMonth,
        program.paymentSchedule,
        program.duration
      );

      // Send approval notification to user
      try {
        await sendProgramApprovalNotification(
          program.userEmail,
          program.userName,
          program.programName,
          paymentAmount
        );
      } catch (emailError) {
        console.error("Failed to send approval notification:", emailError);
      }

      return NextResponse.json({
        message: "Program approved successfully",
        program,
      });
    } else if (action === "revoke") {
      program.status = "revoked";
      await program.save();

      return NextResponse.json({
        message: "Program revoked successfully",
        program,
      });
    } else if (action === "delete") {
      // Store program details for notification before deletion
      const programDetails = {
        userName: program.userName,
        userEmail: program.userEmail,
        programName: program.programName,
        amountPaid: program.amountPaid,
        totalAmount: program.totalAmount,
      };

      // Delete the program
      await Program.findByIdAndDelete(programId);

      // Send admin notification about deletion
      try {
        await sendAdminNotification("program_deleted", {
          userName: programDetails.userName,
          userEmail: programDetails.userEmail,
          programName: programDetails.programName,
          reason: `Program permanently deleted by ${session.user.email}`,
        });
      } catch (emailError) {
        console.error("Failed to send deletion notification:", emailError);
      }

      return NextResponse.json({
        message: "Program deleted successfully",
        deletedProgram: programDetails,
      });
    }
  } catch (error) {
    console.error("Error managing program:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Get all programs for admin
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email || !isAdmin(session.user.email)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    let query = {};
    if (status && ["pending", "approved", "revoked"].includes(status)) {
      query = { status };
    }

    const programs = await Program.find(query).sort({ createdAt: -1 });

    return NextResponse.json({ programs });
  } catch (error) {
    console.error("Error fetching admin programs:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
