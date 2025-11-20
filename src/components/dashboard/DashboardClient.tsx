"use client";

import { useState, useEffect } from "react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  BoltIcon,
  PlusIcon,
  XMarkIcon,
  UserIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  ChartBarIcon,
  CreditCardIcon,
  ClockIcon,
  BookOpenIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import ProgramForm from "./ProgramForm";
import ProgramCard from "./ProgramCard";
import { formatCurrency } from "@/lib/utils";

interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  isAdmin?: boolean;
}

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

const statsCards = [
  {
    title: "Active Programs",
    key: "activePrograms",
    icon: BookOpenIcon,
    color: "from-primary-500 to-primary-600",
    getValue: (programs: Program[]) =>
      programs.filter((p) => !p.isCompleted).length,
  },
  {
    title: "Total Investment",
    key: "totalInvestment",
    icon: ChartBarIcon,
    color: "from-emerald-500 to-teal-600",
    getValue: (programs: Program[]) =>
      programs.reduce((sum, p) => sum + p.totalAmount, 0),
    format: true,
  },
  {
    title: "Amount Paid",
    key: "amountPaid",
    icon: CreditCardIcon,
    color: "from-green-500 to-emerald-600",
    getValue: (programs: Program[]) =>
      programs.reduce((sum, p) => sum + p.amountPaid, 0),
    format: true,
  },
  {
    title: "Remaining Balance",
    key: "remaining",
    icon: ClockIcon,
    color: "from-orange-500 to-red-600",
    getValue: (programs: Program[]) => {
      const total = programs.reduce((sum, p) => sum + p.totalAmount, 0);
      const paid = programs.reduce((sum, p) => sum + p.amountPaid, 0);
      return total - paid;
    },
    format: true,
  },
];

export default function DashboardClient({ user }: { user: User }) {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      const response = await fetch("/api/programs");
      if (response.ok) {
        const data = await response.json();
        setPrograms(data.programs);
      }
    } catch (error) {
      console.error("Error fetching programs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleProgramCreated = (newProgram: {
    _id: string;
    programName: string;
    costPerMonth: number;
    duration: number;
    paymentSchedule: "daily" | "weekly" | "monthly" | "once";
    totalAmount: number;
    amountPaid: number;
    nextPaymentDate: string;
    isCompleted: boolean;
    status?: "pending" | "approved" | "revoked";
    paymentHistory: Array<{
      amount: number;
      date: string;
      reference: string;
      status: "success" | "failed" | "pending";
    }>;
  }) => {
    setPrograms((prev) => [
      { ...newProgram, status: newProgram.status || "pending" },
      ...prev,
    ]);
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-noise opacity-30"></div>

      {/* Animated Background Elements */}
      <motion.div
        animate={{
          rotate: [0, 360],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary-500/10 to-purple-500/10 rounded-full blur-3xl"
      />

      <motion.div
        animate={{
          rotate: [360, 0],
          scale: [1.2, 1, 1.2],
        }}
        transition={{
          duration: 35,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-full blur-3xl"
      />

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-50 bg-white/5 backdrop-blur-lg border-b border-white/10"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-2"
            >
              <BoltIcon className="h-8 w-8 text-primary-500" />
              <Link
                href="/"
                className="text-xl sm:text-2xl font-bold text-white font-display"
              >
                PayTrack
                <span className="text-primary-400 text-sm font-light ml-2">
                  by Tini
                </span>
              </Link>
            </motion.div>

            <div className="flex items-center space-x-4">
              {user.isAdmin && (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href="/admin"
                    className="hidden sm:flex items-center space-x-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 text-purple-300 hover:text-purple-200 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-purple-500/30"
                  >
                    <Cog6ToothIcon className="h-4 w-4" />
                    <span className="text-sm font-medium">Admin</span>
                  </Link>
                </motion.div>
              )}

              <div className="relative">
                <motion.button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm hover:bg-white/20 px-3 py-2 rounded-xl border border-white/20 hover:border-white/30 transition-all duration-200"
                >
                  {user.image ? (
                    <Image
                      src={user.image}
                      alt={user.name || "User"}
                      width={32}
                      height={32}
                      className="w-8 h-8 rounded-full border-2 border-primary-500/50"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-primary-500/20 border-2 border-primary-500/50 flex items-center justify-center">
                      <UserIcon className="h-5 w-5 text-primary-400" />
                    </div>
                  )}
                  <span className="text-white text-sm font-medium hidden sm:block">
                    {user.name || "User"}
                  </span>
                </motion.button>

                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="fixed top-16 sm:top-20 right-4 sm:right-8 w-48 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl shadow-2xl py-2"
                      style={{ zIndex: 9999 }}
                    >
                      <div className="px-4 py-2 border-b border-white/10">
                        <p className="text-white text-sm font-medium">
                          {user.name}
                        </p>
                        <p className="text-slate-400 text-xs">{user.email}</p>
                      </div>
                      {user.isAdmin && (
                        <Link
                          href="/admin"
                          className="sm:hidden flex items-center space-x-2 px-4 py-2 text-purple-300 hover:text-purple-200 hover:bg-purple-500/20 transition-colors"
                        >
                          <Cog6ToothIcon className="h-4 w-4" />
                          <span className="text-sm">Admin Panel</span>
                        </Link>
                      )}
                      <button
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="w-full flex items-center space-x-2 px-4 py-2 text-red-300 hover:text-red-200 hover:bg-red-500/20 transition-colors"
                      >
                        <ArrowRightOnRectangleIcon className="h-4 w-4" />
                        <span className="text-sm">Sign Out</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8"
        >
          {statsCards.map((stat, index) => (
            <motion.div
              key={stat.key}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300 group"
            >
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h3 className="text-xs sm:text-sm font-medium text-slate-400">
                  {stat.title}
                </h3>
                <div
                  className={`p-2 rounded-lg bg-gradient-to-r ${stat.color} group-hover:scale-110 transition-transform duration-300`}
                >
                  <stat.icon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                </div>
              </div>
              <p className="text-xl sm:text-3xl font-bold text-white">
                {stat.format
                  ? formatCurrency(stat.getValue(programs))
                  : stat.getValue(programs)}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
        >
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white font-display mb-2">
              My Learning Programs
            </h1>
            <p className="text-slate-400 text-sm sm:text-base">
              Track your educational journey and payment progress
            </p>
          </div>

          <motion.button
            onClick={() => setShowForm(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center space-x-2 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white px-4 sm:px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-glow"
          >
            <PlusIcon className="h-5 w-5" />
            <span className="text-sm sm:text-base">Add New Program</span>
          </motion.button>
        </motion.div>

        {/* Program Form Modal */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
              onClick={(e) => {
                if (e.target === e.currentTarget) setShowForm(false);
              }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ duration: 0.3 }}
                className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
                    Add New Learning Program
                  </h2>
                  <motion.button
                    onClick={() => setShowForm(false)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="text-slate-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10"
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </motion.button>
                </div>
                <ProgramForm
                  onSuccess={handleProgramCreated}
                  onCancel={() => setShowForm(false)}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Programs Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          {loading ? (
            <div className="text-center py-16">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="inline-block w-8 h-8 border-3 border-primary-500 border-t-transparent rounded-full"
              />
              <p className="text-slate-400 mt-4 text-sm sm:text-base">
                Loading your programs...
              </p>
            </div>
          ) : programs.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center py-16"
            >
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl sm:rounded-3xl p-8 sm:p-12 max-w-md mx-auto">
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="mb-6"
                >
                  <div className="bg-gradient-to-r from-primary-500 to-emerald-600 p-4 rounded-2xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <BookOpenIcon className="w-8 h-8 text-white" />
                  </div>
                </motion.div>

                <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 font-display">
                  No Programs Yet
                </h3>
                <p className="text-slate-400 mb-6 text-sm sm:text-base leading-relaxed">
                  Start tracking your learning journey by adding your first
                  educational program.
                </p>

                <motion.button
                  onClick={() => setShowForm(true)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-2 bg-gradient-to-r from-primary-500 to-emerald-600 hover:from-primary-600 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-glow mx-auto"
                >
                  <SparklesIcon className="h-5 w-5" />
                  <span>Add Your First Program</span>
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: 0.1,
                  },
                },
              }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
            >
              {programs.map((program) => (
                <motion.div
                  key={program._id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  transition={{ duration: 0.5 }}
                >
                  <ProgramCard program={program} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
