"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircleIcon,
  XMarkIcon,
  ClockIcon,
  UserIcon,
  CreditCardIcon,
  ChartBarIcon,
  CalendarIcon,
  EyeIcon,
  EyeSlashIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

interface Program {
  _id: string;
  programName: string;
  userName: string;
  userEmail: string;
  costPerMonth: number;
  duration: number;
  paymentSchedule: "daily" | "weekly" | "monthly" | "once";
  totalAmount: number;
  amountPaid: number;
  nextPaymentDate: string;
  isCompleted: boolean;
  status: "pending" | "approved" | "revoked";
  createdAt: string;
  approvedAt?: string;
  approvedBy?: string;
  paymentHistory: Array<{
    amount: number;
    date: string;
    reference: string;
    status: "success" | "failed" | "pending";
  }>;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [filteredPrograms, setFilteredPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<
    "all" | "pending" | "approved" | "revoked"
  >("all");
  const [processingAction, setProcessingAction] = useState<{
    id: string;
    action: string;
  } | null>(null);
  const [showDetails, setShowDetails] = useState<string | null>(null);

  // Check if user is admin
  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      window.location.href = "/";
      return;
    }

    // Basic admin check - in a real app, this should be server-side
    const adminEmails = process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(",") || [];
    const isAdmin = adminEmails.includes(session.user?.email || "");

    if (!isAdmin) {
      window.location.href = "/dashboard";
      return;
    }

    fetchPrograms();
  }, [session, status]);

  const fetchPrograms = async () => {
    try {
      const response = await fetch("/api/admin/programs");
      if (response.ok) {
        const data = await response.json();
        setPrograms(data.programs);
        setFilteredPrograms(data.programs);
      }
    } catch (error) {
      console.error("Error fetching programs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (
    programId: string,
    action: "approve" | "revoke" | "delete"
  ) => {
    // Show confirmation dialog for delete action
    if (action === "delete") {
      const programToDelete = programs.find((p) => p._id === programId);
      const confirmed = window.confirm(
        `Are you sure you want to permanently delete the program "${programToDelete?.programName}" for ${programToDelete?.userName}?\n\nThis action cannot be undone.`
      );
      if (!confirmed) return;
    }

    setProcessingAction({ id: programId, action });

    try {
      const response = await fetch("/api/admin/programs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ programId, action }),
      });

      if (response.ok) {
        await fetchPrograms(); // Refresh the list
      } else {
        console.error(`Failed to ${action} program`);
      }
    } catch (error) {
      console.error(`Error ${action}ing program:`, error);
    } finally {
      setProcessingAction(null);
    }
  };

  // Filter programs based on status
  useEffect(() => {
    if (statusFilter === "all") {
      setFilteredPrograms(programs);
    } else {
      setFilteredPrograms(programs.filter((p) => p.status === statusFilter));
    }
  }, [programs, statusFilter]);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "pending":
        return {
          color: "text-yellow-400",
          bgColor: "bg-yellow-500/10",
          borderColor: "border-yellow-500/20",
          icon: ClockIcon,
          text: "Pending Approval",
        };
      case "approved":
        return {
          color: "text-emerald-400",
          bgColor: "bg-emerald-500/10",
          borderColor: "border-emerald-500/20",
          icon: CheckCircleIcon,
          text: "Approved",
        };
      case "revoked":
        return {
          color: "text-red-400",
          bgColor: "bg-red-500/10",
          borderColor: "border-red-500/20",
          icon: XMarkIcon,
          text: "Revoked",
        };
      default:
        return {
          color: "text-gray-400",
          bgColor: "bg-gray-500/10",
          borderColor: "border-gray-500/20",
          icon: ClockIcon,
          text: "Unknown",
        };
    }
  };

  const pendingCount = programs.filter((p) => p.status === "pending").length;
  const approvedCount = programs.filter((p) => p.status === "approved").length;
  const revokedCount = programs.filter((p) => p.status === "revoked").length;

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2 font-display">
            Admin Dashboard
          </h1>
          <p className="text-slate-400">Manage and approve PayTrack programs</p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <ChartBarIcon className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Total Programs</p>
                <p className="text-2xl font-bold text-white">
                  {programs.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-500/20 rounded-lg">
                <ClockIcon className="h-6 w-6 text-yellow-400" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Pending Approval</p>
                <p className="text-2xl font-bold text-white">{pendingCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-emerald-500/20 rounded-lg">
                <CheckCircleIcon className="h-6 w-6 text-emerald-400" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Approved</p>
                <p className="text-2xl font-bold text-white">{approvedCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-500/20 rounded-lg">
                <XMarkIcon className="h-6 w-6 text-red-400" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Revoked</p>
                <p className="text-2xl font-bold text-white">{revokedCount}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-2 mb-6"
        >
          {[
            { key: "all", label: "All Programs", count: programs.length },
            { key: "pending", label: "Pending", count: pendingCount },
            { key: "approved", label: "Approved", count: approvedCount },
            { key: "revoked", label: "Revoked", count: revokedCount },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key as typeof statusFilter)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                statusFilter === tab.key
                  ? "bg-primary-500 text-white"
                  : "bg-white/10 text-slate-300 hover:bg-white/20"
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </motion.div>

        {/* Programs List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          {filteredPrograms.length === 0 ? (
            <div className="text-center py-12">
              <ChartBarIcon className="h-16 w-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-400 mb-2">
                No programs found
              </h3>
              <p className="text-slate-500">
                {statusFilter === "all"
                  ? "No programs have been created yet."
                  : `No ${statusFilter} programs found.`}
              </p>
            </div>
          ) : (
            filteredPrograms.map((program) => {
              const statusConfig = getStatusConfig(program.status);
              const progress = (program.amountPaid / program.totalAmount) * 100;

              return (
                <motion.div
                  key={program._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300"
                >
                  {/* Program Header */}
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-white">
                          {program.programName}
                        </h3>
                        <div
                          className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full border ${statusConfig.bgColor} ${statusConfig.borderColor}`}
                        >
                          <statusConfig.icon
                            className={`h-4 w-4 ${statusConfig.color}`}
                          />
                          <span
                            className={`text-sm font-medium ${statusConfig.color}`}
                          >
                            {statusConfig.text}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4 text-sm text-slate-400">
                        <div className="flex items-center space-x-1">
                          <UserIcon className="h-4 w-4" />
                          <span>{program.userName}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <CreditCardIcon className="h-4 w-4" />
                          <span>₦{program.totalAmount.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <CalendarIcon className="h-4 w-4" />
                          <span>
                            {new Date(program.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() =>
                          setShowDetails(
                            showDetails === program._id ? null : program._id
                          )
                        }
                        className="p-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg transition-all duration-200"
                      >
                        {showDetails === program._id ? (
                          <EyeSlashIcon className="h-5 w-5 text-slate-400" />
                        ) : (
                          <EyeIcon className="h-5 w-5 text-slate-400" />
                        )}
                      </button>

                      {program.status === "pending" && (
                        <>
                          <button
                            onClick={() => handleAction(program._id, "approve")}
                            disabled={processingAction?.id === program._id}
                            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-all duration-200 disabled:opacity-50 font-medium"
                          >
                            {processingAction?.id === program._id &&
                            processingAction.action === "approve"
                              ? "Approving..."
                              : "Approve"}
                          </button>
                          <button
                            onClick={() => handleAction(program._id, "revoke")}
                            disabled={processingAction?.id === program._id}
                            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all duration-200 disabled:opacity-50 font-medium"
                          >
                            {processingAction?.id === program._id &&
                            processingAction.action === "revoke"
                              ? "Revoking..."
                              : "Revoke"}
                          </button>
                        </>
                      )}

                      {program.status === "approved" && (
                        <button
                          onClick={() => handleAction(program._id, "revoke")}
                          disabled={processingAction?.id === program._id}
                          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all duration-200 disabled:opacity-50 font-medium"
                        >
                          {processingAction?.id === program._id &&
                          processingAction.action === "revoke"
                            ? "Revoking..."
                            : "Revoke Program"}
                        </button>
                      )}

                      {/* Delete button - available for all programs */}
                      {program.status !== "pending" && (
                        <button
                          onClick={() => handleAction(program._id, "delete")}
                          disabled={processingAction?.id === program._id}
                          className="px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-all duration-200 disabled:opacity-50 font-medium flex items-center space-x-2"
                        >
                          <TrashIcon className="h-4 w-4" />
                          <span>
                            {processingAction?.id === program._id &&
                            processingAction.action === "delete"
                              ? "Deleting..."
                              : "Delete"}
                          </span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-slate-400 mb-2">
                      <span>Progress</span>
                      <span>{progress.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="bg-gradient-to-r from-primary-500 to-emerald-500 h-2 rounded-full"
                      />
                    </div>
                  </div>

                  {/* Expandable Details */}
                  <AnimatePresence>
                    {showDetails === program._id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border-t border-white/10 pt-4 mt-4"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="text-white font-semibold mb-3">
                              Program Details
                            </h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-slate-400">
                                  User Email:
                                </span>
                                <span className="text-white">
                                  {program.userEmail}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-400">
                                  Cost per Month:
                                </span>
                                <span className="text-white">
                                  ₦{program.costPerMonth.toLocaleString()}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-400">
                                  Duration:
                                </span>
                                <span className="text-white">
                                  {program.duration} months
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-400">
                                  Payment Schedule:
                                </span>
                                <span className="text-white capitalize">
                                  {program.paymentSchedule}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-400">
                                  Amount Paid:
                                </span>
                                <span className="text-white">
                                  ₦{program.amountPaid.toLocaleString()}
                                </span>
                              </div>
                              {program.approvedAt && (
                                <div className="flex justify-between">
                                  <span className="text-slate-400">
                                    Approved:
                                  </span>
                                  <span className="text-white">
                                    {new Date(
                                      program.approvedAt
                                    ).toLocaleDateString()}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>

                          <div>
                            <h4 className="text-white font-semibold mb-3">
                              Payment History ({program.paymentHistory.length})
                            </h4>
                            {program.paymentHistory.length === 0 ? (
                              <p className="text-slate-400 text-sm">
                                No payments made yet
                              </p>
                            ) : (
                              <div className="space-y-2 max-h-40 overflow-y-auto">
                                {program.paymentHistory
                                  .slice(0, 5)
                                  .map((payment, index) => (
                                    <div
                                      key={index}
                                      className="flex justify-between text-sm py-2 border-b border-white/5 last:border-0"
                                    >
                                      <div>
                                        <div className="text-white">
                                          ₦{payment.amount.toLocaleString()}
                                        </div>
                                        <div className="text-slate-400">
                                          {payment.reference}
                                        </div>
                                      </div>
                                      <div className="text-right">
                                        <div className="text-slate-300">
                                          {new Date(
                                            payment.date
                                          ).toLocaleDateString()}
                                        </div>
                                        <div
                                          className={`text-xs ${
                                            payment.status === "success"
                                              ? "text-emerald-400"
                                              : payment.status === "failed"
                                              ? "text-red-400"
                                              : "text-yellow-400"
                                          }`}
                                        >
                                          {payment.status}
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })
          )}
        </motion.div>
      </div>
    </div>
  );
}
