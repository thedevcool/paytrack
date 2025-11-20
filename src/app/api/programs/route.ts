import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { Program } from "@/models/Program";
import { sendAdminNotification } from "@/lib/email";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const programs = await Program.find({ userId: session.user.id }).sort({
      createdAt: -1,
    });

    return NextResponse.json({ programs });
  } catch (error) {
    console.error("Error fetching programs:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { programName, costPerMonth, duration, paymentSchedule } = body;

    // Validate input
    if (!programName || !costPerMonth || !duration || !paymentSchedule) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await connectDB();

    const totalAmount = costPerMonth * duration;

    // Debug: Log the program data being created
    console.log("Creating program with data:", {
      userId: session.user.id,
      userEmail: session.user.email,
      userName: session.user.name,
      programName,
      costPerMonth,
      duration,
      paymentSchedule,
      totalAmount,
      amountPaid: 0,
    });

    const program = new Program({
      userId: session.user.id,
      userEmail: session.user.email,
      userName: session.user.name,
      programName,
      costPerMonth,
      duration,
      paymentSchedule,
      totalAmount,
      amountPaid: 0,
      // nextPaymentDate will be set after first payment
      paymentHistory: [],
      isCompleted: false,
      status: "pending", // Programs start as pending approval
    });

    await program.save();

    // Send admin notification about new program
    try {
      await sendAdminNotification("new_program", {
        userName: session.user.name || "Unknown User",
        userEmail: session.user.email || "",
        programName,
      });
    } catch (emailError) {
      console.error("Failed to send admin notification:", emailError);
      // Don't fail the program creation if email fails
    }

    return NextResponse.json({ program });
  } catch (error) {
    console.error("Error creating program:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
