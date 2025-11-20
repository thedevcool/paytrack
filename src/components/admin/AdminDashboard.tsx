"use client";

import { useState, useEffect } from "react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";

interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  isAdmin?: boolean;
}

interface AdminStats {
  totalUsers: number;
  totalPrograms: number;
  totalRevenue: number;
  activePrograms: number;
  recentPayments: {
    _id: string;
    userName: string;
    programName: string;
    amount: number;
    date: string;
    reference: string;
  }[];
  programs: {
    _id: string;
    userName: string;
    userEmail: string;
    programName: string;
    totalAmount: number;
    amountPaid: number;
    paymentSchedule: string;
    nextPaymentDate: string;
    isCompleted: boolean;
  }[];
}

export default function AdminDashboard({ user }: { user: User }) {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"overview" | "programs" | "payments">(
    "overview"
  );

  useEffect(() => {
    fetchAdminStats();
  }, []);

  const fetchAdminStats = async () => {
    try {
      const response = await fetch("/api/admin/stats");
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Error fetching admin stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const sendReminder = async (programId: string) => {
    try {
      const response = await fetch("/api/admin/send-reminder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ programId }),
      });

      if (response.ok) {
        alert("Reminder sent successfully!");
      }
    } catch (error) {
      console.error("Error sending reminder:", error);
      alert("Failed to send reminder");
    }
  };

  if (loading) {
    return (
      <div className="gradient-bg min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="gradient-bg min-h-screen">
      {/* Header */}
      <header className="border-b border-dark-300 bg-dark-100/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-white">
                PayTrack Admin
                <span className="text-primary-400 text-sm font-light ml-2">
                  by Tini
                </span>
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <Link
                href="/dashboard"
                className="text-primary-400 hover:text-primary-300 font-medium"
              >
                User Dashboard
              </Link>
              <div className="flex items-center space-x-3">
                <span className="text-white text-sm">{user.name}</span>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-dark-600 hover:text-white transition-colors"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex space-x-6 mb-8">
          <button
            onClick={() => setView("overview")}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              view === "overview"
                ? "bg-primary-500 text-white"
                : "text-dark-600 hover:text-white"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setView("programs")}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              view === "programs"
                ? "bg-primary-500 text-white"
                : "text-dark-600 hover:text-white"
            }`}
          >
            Programs
          </button>
          <button
            onClick={() => setView("payments")}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              view === "payments"
                ? "bg-primary-500 text-white"
                : "text-dark-600 hover:text-white"
            }`}
          >
            Payments
          </button>
        </div>

        {/* Overview */}
        {view === "overview" && stats && (
          <div>
            <h1 className="text-3xl font-bold text-white mb-8">
              Admin Overview
            </h1>

            {/* Stats Grid */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <div className="glass rounded-xl p-6">
                <h3 className="text-sm font-medium text-dark-600 mb-2">
                  Total Users
                </h3>
                <p className="text-3xl font-bold text-white">
                  {stats.totalUsers}
                </p>
              </div>
              <div className="glass rounded-xl p-6">
                <h3 className="text-sm font-medium text-dark-600 mb-2">
                  Total Programs
                </h3>
                <p className="text-3xl font-bold text-primary-400">
                  {stats.totalPrograms}
                </p>
              </div>
              <div className="glass rounded-xl p-6">
                <h3 className="text-sm font-medium text-dark-600 mb-2">
                  Total Revenue
                </h3>
                <p className="text-3xl font-bold text-green-400">
                  {formatCurrency(stats.totalRevenue)}
                </p>
              </div>
              <div className="glass rounded-xl p-6">
                <h3 className="text-sm font-medium text-dark-600 mb-2">
                  Active Programs
                </h3>
                <p className="text-3xl font-bold text-orange-400">
                  {stats.activePrograms}
                </p>
              </div>
            </div>

            {/* Recent Payments */}
            <div className="glass rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">
                Recent Payments
              </h2>
              {stats.recentPayments.length === 0 ? (
                <p className="text-dark-600 text-center py-8">
                  No recent payments
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-dark-300">
                        <th className="text-left text-dark-600 font-medium py-2">
                          User
                        </th>
                        <th className="text-left text-dark-600 font-medium py-2">
                          Program
                        </th>
                        <th className="text-left text-dark-600 font-medium py-2">
                          Amount
                        </th>
                        <th className="text-left text-dark-600 font-medium py-2">
                          Date
                        </th>
                        <th className="text-left text-dark-600 font-medium py-2">
                          Reference
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.recentPayments.map((payment) => (
                        <tr
                          key={payment._id}
                          className="border-b border-dark-300/50"
                        >
                          <td className="text-white py-3">
                            {payment.userName}
                          </td>
                          <td className="text-dark-600 py-3">
                            {payment.programName}
                          </td>
                          <td className="text-green-400 py-3">
                            {formatCurrency(payment.amount)}
                          </td>
                          <td className="text-dark-600 py-3">
                            {new Date(payment.date).toLocaleDateString()}
                          </td>
                          <td className="text-dark-600 py-3 font-mono text-xs">
                            {payment.reference}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Programs View */}
        {view === "programs" && stats && (
          <div>
            <h1 className="text-3xl font-bold text-white mb-8">All Programs</h1>

            <div className="glass rounded-xl p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-dark-300">
                      <th className="text-left text-dark-600 font-medium py-2">
                        User
                      </th>
                      <th className="text-left text-dark-600 font-medium py-2">
                        Program
                      </th>
                      <th className="text-left text-dark-600 font-medium py-2">
                        Schedule
                      </th>
                      <th className="text-left text-dark-600 font-medium py-2">
                        Progress
                      </th>
                      <th className="text-left text-dark-600 font-medium py-2">
                        Next Payment
                      </th>
                      <th className="text-left text-dark-600 font-medium py-2">
                        Status
                      </th>
                      <th className="text-left text-dark-600 font-medium py-2">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.programs.map((program) => {
                      const progress =
                        (program.amountPaid / program.totalAmount) * 100;
                      const nextPayment = new Date(program.nextPaymentDate);
                      const isOverdue =
                        nextPayment < new Date() && !program.isCompleted;

                      return (
                        <tr
                          key={program._id}
                          className="border-b border-dark-300/50"
                        >
                          <td className="py-3">
                            <div>
                              <p className="text-white">{program.userName}</p>
                              <p className="text-dark-600 text-xs">
                                {program.userEmail}
                              </p>
                            </div>
                          </td>
                          <td className="text-white py-3">
                            {program.programName}
                          </td>
                          <td className="text-dark-600 py-3 capitalize">
                            {program.paymentSchedule}
                          </td>
                          <td className="py-3">
                            <div className="flex items-center space-x-2">
                              <div className="w-16 bg-dark-300 rounded-full h-2">
                                <div
                                  className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full"
                                  style={{
                                    width: `${Math.min(progress, 100)}%`,
                                  }}
                                ></div>
                              </div>
                              <span className="text-xs text-white">
                                {progress.toFixed(1)}%
                              </span>
                            </div>
                          </td>
                          <td
                            className={`py-3 ${
                              isOverdue ? "text-red-400" : "text-dark-600"
                            }`}
                          >
                            {program.isCompleted
                              ? "Completed"
                              : nextPayment.toLocaleDateString()}
                          </td>
                          <td className="py-3">
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${
                                program.isCompleted
                                  ? "bg-green-500/20 text-green-400"
                                  : isOverdue
                                  ? "bg-red-500/20 text-red-400"
                                  : "bg-primary-500/20 text-primary-400"
                              }`}
                            >
                              {program.isCompleted
                                ? "Completed"
                                : isOverdue
                                ? "Overdue"
                                : "Active"}
                            </span>
                          </td>
                          <td className="py-3">
                            {!program.isCompleted && (
                              <button
                                onClick={() => sendReminder(program._id)}
                                className="text-primary-400 hover:text-primary-300 text-sm"
                              >
                                Send Reminder
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Payments View */}
        {view === "payments" && stats && (
          <div>
            <h1 className="text-3xl font-bold text-white mb-8">All Payments</h1>

            <div className="glass rounded-xl p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-dark-300">
                      <th className="text-left text-dark-600 font-medium py-2">
                        User
                      </th>
                      <th className="text-left text-dark-600 font-medium py-2">
                        Program
                      </th>
                      <th className="text-left text-dark-600 font-medium py-2">
                        Amount
                      </th>
                      <th className="text-left text-dark-600 font-medium py-2">
                        Date
                      </th>
                      <th className="text-left text-dark-600 font-medium py-2">
                        Reference
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentPayments.map((payment) => (
                      <tr
                        key={payment._id}
                        className="border-b border-dark-300/50"
                      >
                        <td className="text-white py-3">{payment.userName}</td>
                        <td className="text-dark-600 py-3">
                          {payment.programName}
                        </td>
                        <td className="text-green-400 py-3">
                          {formatCurrency(payment.amount)}
                        </td>
                        <td className="text-dark-600 py-3">
                          {new Date(payment.date).toLocaleDateString()}
                        </td>
                        <td className="text-dark-600 py-3 font-mono text-xs">
                          {payment.reference}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
