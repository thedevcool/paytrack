"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CurrencyDollarIcon,
  CalendarIcon,
  ClockIcon,
  CreditCardIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import { calculatePaymentAmount } from "@/lib/utils";

interface ProgramResponse {
  _id: string;
  programName: string;
  costPerMonth: number;
  duration: number;
  paymentSchedule: "daily" | "weekly" | "monthly" | "once";
  totalAmount: number;
  amountPaid: number;
  nextPaymentDate: string;
  isCompleted: boolean;
  paymentHistory: {
    amount: number;
    date: string;
    reference: string;
    status: "success" | "failed" | "pending";
  }[];
}

interface ProgramFormProps {
  onSuccess: (program: ProgramResponse) => void;
  onCancel: () => void;
}

export default function ProgramForm({ onSuccess, onCancel }: ProgramFormProps) {
  const [formData, setFormData] = useState({
    programName: "",
    costPerMonth: "",
    duration: "",
    paymentSchedule: "monthly" as "daily" | "weekly" | "monthly" | "once",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(1); // 1: Form, 2: Confirmation, 3: Payment Processing
  const [createdProgram, setCreatedProgram] = useState<ProgramResponse | null>(
    null
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const costPerMonth = parseFloat(formData.costPerMonth);
      const duration = parseInt(formData.duration);

      const response = await fetch("/api/programs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          costPerMonth,
          duration,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setCreatedProgram(data.program);
        setStep(2); // Move to confirmation step
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to create program");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSkipPayment = () => {
    if (createdProgram) {
      onSuccess(createdProgram);
    }
  };

  const totalAmount =
    formData.costPerMonth && formData.duration
      ? parseFloat(formData.costPerMonth) * parseInt(formData.duration)
      : 0;

  const paymentAmount =
    formData.costPerMonth && formData.paymentSchedule
      ? calculatePaymentAmount(
          parseFloat(formData.costPerMonth) || 0,
          formData.paymentSchedule,
          parseInt(formData.duration) || 1
        )
      : 0;

  const scheduleOptions = [
    {
      value: "once",
      label: "Pay Once (Full Amount)",
      icon: CreditCardIcon,
      desc: "Complete payment upfront",
    },
    {
      value: "monthly",
      label: "Monthly Payments",
      icon: CalendarIcon,
      desc: "Pay monthly installments",
    },
    {
      value: "weekly",
      label: "Weekly Payments",
      icon: ClockIcon,
      desc: "Pay weekly installments",
    },
    {
      value: "daily",
      label: "Daily Payments",
      icon: ClockIcon,
      desc: "Pay daily installments",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Step Indicator */}
      <div className="flex items-center justify-center space-x-4 mb-8">
        {[1, 2, 3].map((stepNum) => (
          <div key={stepNum} className="flex items-center">
            <motion.div
              animate={{
                backgroundColor:
                  step >= stepNum ? "#0ea5e9" : "rgba(255, 255, 255, 0.1)",
                borderColor:
                  step >= stepNum ? "#0ea5e9" : "rgba(255, 255, 255, 0.2)",
              }}
              className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-semibold text-white"
            >
              {step > stepNum ? (
                <CheckCircleIcon className="h-5 w-5" />
              ) : (
                stepNum
              )}
            </motion.div>
            {stepNum < 3 && (
              <div
                className={`w-12 h-0.5 mx-2 ${
                  step > stepNum ? "bg-primary-500" : "bg-white/20"
                } transition-colors duration-300`}
              />
            )}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* Step 1: Program Details Form */}
        {step === 1 && (
          <motion.form
            key="form"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl flex items-center space-x-2"
              >
                <ExclamationCircleIcon className="h-5 w-5 flex-shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            <div>
              <label
                htmlFor="programName"
                className="block text-sm font-medium text-slate-300 mb-2"
              >
                Program Name
              </label>
              <input
                type="text"
                id="programName"
                required
                value={formData.programName}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    programName: e.target.value,
                  }))
                }
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                placeholder="e.g. Web Development Bootcamp"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="costPerMonth"
                  className="block text-sm font-medium text-slate-300 mb-2"
                >
                  Cost per Month (₦)
                </label>
                <div className="relative">
                  <CurrencyDollarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="number"
                    id="costPerMonth"
                    required
                    min="1"
                    step="0.01"
                    value={formData.costPerMonth}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        costPerMonth: e.target.value,
                      }))
                    }
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                    placeholder="50000"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="duration"
                  className="block text-sm font-medium text-slate-300 mb-2"
                >
                  Duration (months)
                </label>
                <div className="relative">
                  <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="number"
                    id="duration"
                    required
                    min="1"
                    value={formData.duration}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        duration: e.target.value,
                      }))
                    }
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                    placeholder="6"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-3">
                Payment Schedule
              </label>
              <div className="grid md:grid-cols-2 gap-3">
                {scheduleOptions.map((option) => (
                  <motion.div
                    key={option.value}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-4 border rounded-xl cursor-pointer transition-all duration-200 ${
                      formData.paymentSchedule === option.value
                        ? "border-primary-500 bg-primary-500/10"
                        : "border-white/10 bg-white/5 hover:bg-white/10"
                    }`}
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        paymentSchedule: option.value as
                          | "daily"
                          | "weekly"
                          | "monthly"
                          | "once",
                      }))
                    }
                  >
                    <div className="flex items-center space-x-3">
                      <option.icon
                        className={`h-5 w-5 ${
                          formData.paymentSchedule === option.value
                            ? "text-primary-400"
                            : "text-slate-400"
                        }`}
                      />
                      <div>
                        <p
                          className={`font-medium ${
                            formData.paymentSchedule === option.value
                              ? "text-white"
                              : "text-slate-300"
                          }`}
                        >
                          {option.label}
                        </p>
                        <p className="text-xs text-slate-400">{option.desc}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Payment Summary */}
            {totalAmount > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-primary-500/10 to-emerald-500/10 border border-primary-500/20 rounded-xl p-6"
              >
                <h3 className="text-lg font-bold text-white mb-4 font-display flex items-center">
                  <SparklesIcon className="h-5 w-5 mr-2 text-primary-400" />
                  Payment Summary
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Total Program Cost:</span>
                    <span className="text-white font-semibold text-lg">
                      ₦{totalAmount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">
                      {formData.paymentSchedule === "once"
                        ? "One-time Payment:"
                        : `Per ${
                            formData.paymentSchedule.charAt(0).toUpperCase() +
                            formData.paymentSchedule.slice(1)
                          } Payment:`}
                    </span>
                    <span className="text-primary-400 font-semibold text-lg">
                      ₦{paymentAmount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}

            <div className="flex space-x-4 pt-4">
              <motion.button
                type="button"
                onClick={onCancel}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 px-6 py-3 border border-white/20 text-slate-300 font-medium rounded-xl hover:bg-white/5 transition-all duration-200"
              >
                Cancel
              </motion.button>
              <motion.button
                type="submit"
                disabled={
                  loading ||
                  !formData.programName ||
                  !formData.costPerMonth ||
                  !formData.duration
                }
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                className="flex-1 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-glow flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                ) : (
                  <span>Create Program</span>
                )}
              </motion.button>
            </div>
          </motion.form>
        )}

        {/* Step 2: Payment Confirmation */}
        {step === 2 && createdProgram && (
          <motion.div
            key="confirmation"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="text-center space-y-6"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-500/30 rounded-xl p-6"
            >
              <CheckCircleIcon className="h-12 w-12 text-emerald-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2 font-display">
                Program Created Successfully!
              </h3>
              <p className="text-slate-300">
                {createdProgram.programName} has been added to your learning
                journey.
              </p>
            </motion.div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-left">
              <h4 className="font-semibold text-white mb-4">
                Program Status: Pending Approval
              </h4>
              <div className="space-y-2 text-sm text-slate-300 mb-6">
                <div className="flex justify-between">
                  <span>Program:</span>
                  <span className="font-medium text-white">
                    {createdProgram.programName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Payment Amount:</span>
                  <span className="font-medium text-primary-400">
                    ₦
                    {calculatePaymentAmount(
                      createdProgram.costPerMonth,
                      createdProgram.paymentSchedule,
                      createdProgram.duration
                    ).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Payment Schedule:</span>
                  <span className="font-medium text-white capitalize">
                    {createdProgram.paymentSchedule}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className="font-medium text-yellow-400">
                    Pending Admin Approval
                  </span>
                </div>
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-4">
                <div className="flex items-start space-x-3">
                  <ClockIcon className="h-5 w-5 text-yellow-400 mt-0.5" />
                  <div>
                    <p className="text-yellow-400 font-medium text-sm">
                      Awaiting Approval
                    </p>
                    <p className="text-yellow-300/80 text-xs mt-1">
                      Your program needs to be approved by an admin before you
                      can make payments. You&apos;ll be notified once it&apos;s
                      approved.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <motion.button
                onClick={handleSkipPayment}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-3 bg-gradient-to-r from-primary-500 to-emerald-600 hover:from-primary-600 hover:to-emerald-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-glow"
              >
                Continue to Dashboard
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Payment Processing */}
        {step === 3 && (
          <motion.div
            key="processing"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="text-center py-12"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-6"
            />
            <h3 className="text-xl font-bold text-white mb-2">
              Processing Payment...
            </h3>
            <p className="text-slate-300">
              Please complete your payment in the new window that opened.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
