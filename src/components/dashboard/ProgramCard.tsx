"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarIcon,
  CreditCardIcon,
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";
import { calculateProgress, formatCurrency } from "@/lib/utils";

interface Program {
  _id: string;
  programName: string;
  costPerMonth: number;
  duration: number;
  paymentSchedule: "daily" | "weekly" | "monthly" | "once";
  totalAmount: number;
  amountPaid: number;
  nextPaymentDate?: string; // Optional - only set after first payment
  isCompleted: boolean;
  status: "pending" | "approved" | "revoked" | "frozen";
  paymentHistory: {
    amount: number;
    date: string;
    reference: string;
    status: "success" | "failed" | "pending";
  }[];
}

interface ProgramCardProps {
  program: Program;
}

export default function ProgramCard({ program }: ProgramCardProps) {
  const [showPayment, setShowPayment] = useState(false);
  const [loading, setLoading] = useState(false);

  const progress = calculateProgress(program.amountPaid, program.totalAmount);
  const nextPaymentDate = program.nextPaymentDate
    ? new Date(program.nextPaymentDate)
    : null;

  // Payment is due if:
  // 1. There's a nextPaymentDate and it's past due, OR
  // 2. Program is approved and no payments made yet (first payment)
  const isPaymentDue = nextPaymentDate
    ? nextPaymentDate <= new Date() && !program.isCompleted
    : program.status === "approved" && program.amountPaid === 0;

  const handlePayment = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/payments/initialize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          programId: program._id,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Redirect to Paystack payment page
        window.open(data.authorization_url, "_blank");
      } else {
        console.error("Payment initialization failed");
      }
    } catch (error) {
      console.error("Payment error:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = () => {
    // Handle approval status first
    if (program.status === "pending") {
      return {
        color: "text-yellow-400",
        bgColor: "bg-yellow-500/10",
        borderColor: "border-yellow-500/20",
        icon: ClockIcon,
        text: "Pending Approval",
      };
    }
    if (program.status === "revoked") {
      return {
        color: "text-red-400",
        bgColor: "bg-red-500/10",
        borderColor: "border-red-500/20",
        icon: ExclamationTriangleIcon,
        text: "Revoked",
      };
    }
    if (program.status === "frozen") {
      return {
        color: "text-blue-400",
        bgColor: "bg-blue-500/10",
        borderColor: "border-blue-500/20",
        icon: ExclamationTriangleIcon,
        text: "Frozen - Payment Required",
      };
    }

    // Only check other statuses if program is approved
    if (program.status === "approved") {
      if (program.isCompleted) {
        return {
          color: "text-emerald-400",
          bgColor: "bg-emerald-500/10",
          borderColor: "border-emerald-500/20",
          icon: CheckCircleIcon,
          text: "Completed",
        };
      }
      if (isPaymentDue) {
        return {
          color: "text-red-400",
          bgColor: "bg-red-500/10",
          borderColor: "border-red-500/20",
          icon: ExclamationTriangleIcon,
          text: "Payment Due",
        };
      }
      return {
        color: "text-primary-400",
        bgColor: "bg-primary-500/10",
        borderColor: "border-primary-500/20",
        icon: CheckCircleIcon,
        text: "Active",
      };
    }

    // Fallback
    return {
      color: "text-gray-400",
      bgColor: "bg-gray-500/10",
      borderColor: "border-gray-500/20",
      icon: ClockIcon,
      text: "Unknown",
    };
  };

  const getScheduleText = () => {
    const scheduleMap = {
      daily: "Daily payments",
      weekly: "Weekly payments",
      monthly: "Monthly payments",
      once: "One-time payment",
    };
    return scheduleMap[program.paymentSchedule] || "Monthly payments";
  };

  const statusConfig = getStatusConfig();

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="group relative"
    >
      {/* Payment Due Animation */}
      {isPaymentDue && (
        <motion.div
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="absolute inset-0 bg-red-500/20 rounded-xl sm:rounded-2xl blur-xl"
        />
      )}

      <div
        className={`relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300 ${
          isPaymentDue ? "border-red-500/30 shadow-red-500/20 shadow-lg" : ""
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-4 sm:mb-6">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg sm:text-xl font-bold text-white mb-2 font-display truncate group-hover:text-primary-400 transition-colors duration-300">
              {program.programName}
            </h3>
            <div className="flex items-center space-x-2 text-sm text-slate-400">
              <CalendarIcon className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">{getScheduleText()}</span>
            </div>
          </div>

          <motion.div
            whileHover={{ scale: 1.1 }}
            className={`flex items-center space-x-1 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${statusConfig.bgColor} ${statusConfig.borderColor} border`}
          >
            <statusConfig.icon className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className={`${statusConfig.color} hidden sm:inline`}>
              {statusConfig.text}
            </span>
          </motion.div>
        </div>

        {/* Progress Section */}
        <div className="mb-4 sm:mb-6">
          <div className="flex items-center justify-between text-sm mb-3">
            <div className="flex items-center space-x-2 text-slate-400">
              <ChartBarIcon className="h-4 w-4" />
              <span>Progress</span>
            </div>
            <motion.span
              key={progress}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-white font-semibold"
            >
              {progress.toFixed(1)}%
            </motion.span>
          </div>

          <div className="relative w-full bg-slate-700/50 rounded-full h-2 sm:h-3 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(progress, 100)}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-primary-500 via-primary-400 to-emerald-500 rounded-full relative"
            >
              <motion.div
                animate={{ x: ["-100%", "100%"] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              />
            </motion.div>
          </div>
        </div>

        {/* Financial Details */}
        <div className="space-y-3 mb-6">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-white/5 rounded-lg p-3">
              <div className="flex items-center space-x-2 text-slate-400 mb-1">
                <CreditCardIcon className="h-4 w-4" />
                <span className="text-xs">Total</span>
              </div>
              <p className="text-white font-semibold">
                {formatCurrency(program.totalAmount)}
              </p>
            </div>

            <div className="bg-emerald-500/10 rounded-lg p-3">
              <div className="flex items-center space-x-2 text-emerald-400 mb-1">
                <CheckCircleIcon className="h-4 w-4" />
                <span className="text-xs">Paid</span>
              </div>
              <p className="text-emerald-300 font-semibold">
                {formatCurrency(program.amountPaid)}
              </p>
            </div>
          </div>

          <div className="bg-orange-500/10 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-orange-400">
                <ClockIcon className="h-4 w-4" />
                <span className="text-xs sm:text-sm">Remaining</span>
              </div>
              <span className="text-orange-300 font-semibold text-sm sm:text-base">
                {formatCurrency(program.totalAmount - program.amountPaid)}
              </span>
            </div>
          </div>

          {!program.isCompleted && (
            <div
              className={`rounded-lg p-3 ${
                isPaymentDue ? "bg-red-500/10" : "bg-blue-500/10"
              }`}
            >
              <div className="flex items-center justify-between">
                <div
                  className={`flex items-center space-x-2 ${
                    isPaymentDue ? "text-red-400" : "text-blue-400"
                  }`}
                >
                  <CalendarIcon className="h-4 w-4" />
                  <span className="text-xs sm:text-sm">Next Payment</span>
                </div>
                <span
                  className={`font-semibold text-sm sm:text-base ${
                    isPaymentDue ? "text-red-300" : "text-blue-300"
                  }`}
                >
                  {program.amountPaid === 0
                    ? "Make first payment"
                    : nextPaymentDate
                    ? nextPaymentDate.toLocaleDateString()
                    : "After first payment"}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
          {!program.isCompleted &&
            isPaymentDue &&
            program.status === "approved" && (
              <motion.button
                onClick={handlePayment}
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 flex items-center justify-center space-x-2 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold px-4 py-3 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-glow"
              >
                {loading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                  />
                ) : (
                  <CreditCardIcon className="h-4 w-4" />
                )}
                <span className="text-sm sm:text-base">
                  {loading ? "Processing..." : "Make Payment"}
                </span>
              </motion.button>
            )}

          {program.status === "pending" && (
            <div className="flex-1 flex items-center justify-center space-x-2 bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 font-semibold px-4 py-3 rounded-lg">
              <ClockIcon className="h-4 w-4" />
              <span className="text-sm sm:text-base">Awaiting Approval</span>
            </div>
          )}

          {program.status === "revoked" && (
            <div className="flex-1 flex items-center justify-center space-x-2 bg-red-500/20 border border-red-500/30 text-red-400 font-semibold px-4 py-3 rounded-lg">
              <ExclamationTriangleIcon className="h-4 w-4" />
              <span className="text-sm sm:text-base">Program Revoked</span>
            </div>
          )}

          {program.status === "frozen" && (
            <div className="flex-1 flex items-center justify-center space-x-2 bg-blue-500/20 border border-blue-500/30 text-blue-400 font-semibold px-4 py-3 rounded-lg">
              <ExclamationTriangleIcon className="h-4 w-4" />
              <span className="text-sm sm:text-base">
                Frozen - Make Payment to Unfreeze
              </span>
            </div>
          )}

          <motion.button
            onClick={() => setShowPayment(!showPayment)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 flex items-center justify-center space-x-2 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 text-white font-semibold px-4 py-3 rounded-lg transition-all duration-200"
          >
            {showPayment ? (
              <EyeSlashIcon className="h-4 w-4" />
            ) : (
              <EyeIcon className="h-4 w-4" />
            )}
            <span className="text-sm sm:text-base">
              {showPayment ? "Hide History" : "View History"}
            </span>
          </motion.button>
        </div>

        {/* Payment History */}
        <AnimatePresence>
          {showPayment && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-6 pt-6 border-t border-white/10 overflow-hidden"
            >
              <h4 className="text-base sm:text-lg font-bold text-white mb-4 font-display">
                Payment History
              </h4>

              {program.paymentHistory.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-8"
                >
                  <CreditCardIcon className="h-12 w-12 text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-400 text-sm">No payments made yet</p>
                </motion.div>
              ) : (
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {program.paymentHistory
                    .slice()
                    .reverse()
                    .map((payment, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex justify-between items-center p-3 sm:p-4 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-all duration-200"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-semibold text-sm sm:text-base">
                            {formatCurrency(payment.amount)}
                          </p>
                          <p className="text-xs sm:text-sm text-slate-400 truncate">
                            {new Date(payment.date).toLocaleDateString()} •{" "}
                            {payment.reference}
                          </p>
                        </div>

                        <motion.span
                          whileHover={{ scale: 1.05 }}
                          className={`text-xs px-2 py-1 rounded-full font-medium flex-shrink-0 ml-3 ${
                            payment.status === "success"
                              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                              : payment.status === "pending"
                              ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                              : "bg-red-500/20 text-red-400 border border-red-500/30"
                          }`}
                        >
                          {payment.status}
                        </motion.span>
                      </motion.div>
                    ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
