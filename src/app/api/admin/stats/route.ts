import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { Program } from "@/models/Program";
import { Payment } from "@/models/Payment";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // Get all statistics
    const [
      totalPrograms,
      activePrograms,
      allPrograms,
      recentPayments,
      totalRevenue,
    ] = await Promise.all([
      Program.countDocuments(),
      Program.countDocuments({ isCompleted: false }),
      Program.find().sort({ createdAt: -1 }),
      Payment.find().sort({ createdAt: -1 }).limit(20),
      Payment.aggregate([
        { $match: { status: "success" } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
    ]);

    // Count unique users
    const uniqueUserIds = [...new Set(allPrograms.map((p) => p.userId))];
    const totalUsers = uniqueUserIds.length;

    // Format recent payments with program and user info
    const formattedPayments = await Promise.all(
      recentPayments.map(async (payment) => {
        const program = await Program.findById(payment.programId);
        return {
          _id: payment._id,
          userName: program?.userName || "Unknown",
          programName: program?.programName || "Unknown",
          amount: payment.amount,
          date: payment.paymentDate,
          reference: payment.reference,
        };
      })
    );

    const stats = {
      totalUsers,
      totalPrograms,
      totalRevenue: totalRevenue[0]?.total || 0,
      activePrograms,
      recentPayments: formattedPayments,
      programs: allPrograms,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
