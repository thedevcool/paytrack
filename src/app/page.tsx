"use client";

import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  CreditCardIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  ArrowRightIcon,
  SparklesIcon,
  BoltIcon,
} from "@heroicons/react/24/outline";

const features = [
  {
    icon: CreditCardIcon,
    title: "Flexible Payment Plans",
    description:
      "Choose from daily, weekly, monthly, or one-time payment schedules that fit your budget and learning pace.",
    color: "from-emerald-500 to-teal-600",
  },
  {
    icon: ChartBarIcon,
    title: "Progress Tracking",
    description:
      "Visual progress bars and completion status help you stay motivated and see how far you have come.",
    color: "from-blue-500 to-indigo-600",
  },
  {
    icon: ShieldCheckIcon,
    title: "Secure & Reliable",
    description:
      "Bank-level security with Paystack integration ensures your payment information is always protected.",
    color: "from-purple-500 to-pink-600",
  },
  {
    icon: SparklesIcon,
    title: "Smart Reminders",
    description:
      "Get email notifications before payment deadlines so you never miss a payment for your tutorials.",
    color: "from-orange-500 to-red-600",
  },
];

export default function Home() {
  const { data: session, status } = useSession();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-noise opacity-40"></div>

      {/* Animated Background Elements */}
      <motion.div
        animate={{
          rotate: [0, 360],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary-500/20 to-purple-500/20 rounded-full blur-3xl"
      />

      <motion.div
        animate={{
          rotate: [360, 0],
          scale: [1.1, 1, 1.1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-full blur-3xl"
      />

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 px-4 sm:px-6 lg:px-8 pt-6 pb-4"
      >
        <nav className="flex items-center justify-between max-w-7xl mx-auto">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-2"
          >
            <BoltIcon className="h-8 w-8 text-primary-500" />
            <span className="text-xl sm:text-2xl font-bold text-white font-display">
              PayTrack by Tini
            </span>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="flex items-center space-x-4"
          >
            {status === "loading" ? (
              <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
            ) : session ? (
              <Link
                href="/dashboard"
                className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-glow"
              >
                Dashboard
              </Link>
            ) : (
              <motion.button
                onClick={() => signIn("google")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-glow flex items-center space-x-2"
              >
                <span>Get Started</span>
                <ArrowRightIcon className="h-4 w-4" />
              </motion.button>
            )}
          </motion.div>
        </nav>
      </motion.header>

      {/* Hero Section */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-8 pt-12 sm:pt-20 pb-16 sm:pb-24">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-6 sm:mb-8"
          >
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 1 }}
              className="inline-flex items-center px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-sm font-medium mb-6"
            >
              <SparklesIcon className="h-4 w-4 mr-2" />
              Transform your learning journey
            </motion.div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-white font-display leading-tight">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="block"
              >
                Track Your
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="block bg-gradient-to-r from-primary-400 via-primary-500 to-emerald-400 bg-clip-text text-transparent"
              >
                Tini Tutorial Payments
              </motion.span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="text-lg sm:text-xl lg:text-2xl text-slate-300 max-w-4xl mx-auto mb-8 sm:mb-12 leading-relaxed"
          >
            Stay organized with your tutorial payments. Set up your schedule,
            track your progress, and never miss a payment deadline again.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6"
          >
            {!session && (
              <>
                <motion.button
                  onClick={() => signIn("google")}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full sm:w-auto bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-2xl hover:shadow-glow-lg flex items-center justify-center space-x-2 group"
                >
                  <span>Start Tracking Payments</span>
                  <ArrowRightIcon className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                </motion.button>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="w-full sm:w-auto bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 border border-white/20 hover:border-white/30 flex items-center justify-center space-x-2 cursor-pointer"
                  onClick={() => {
                    const element = document.getElementById("features-section");
                    element?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  <ChartBarIcon className="h-5 w-5" />
                  <span>Explore Features</span>
                </motion.div>
              </>
            )}
            {session && (
              <Link href="/dashboard">
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full sm:w-auto bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-2xl hover:shadow-glow-lg flex items-center justify-center space-x-2 group"
                >
                  <span>Go to Dashboard</span>
                  <ArrowRightIcon className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                </motion.div>
              </Link>
            )}
          </motion.div>
        </div>
      </section>

      {/* Personal Focus Section */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-white/20 rounded-2xl p-8 text-center"
          >
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-6">
              Your Learning Journey with Tini Tutorials
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="space-y-2">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto">
                  <CreditCardIcon className="h-6 w-6 text-white" />
                </div>
                <h4 className="text-white font-semibold">Track Payments</h4>
                <p className="text-gray-300 text-sm">
                  Monitor your tutorial payment schedule
                </p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto">
                  <ChartBarIcon className="h-6 w-6 text-white" />
                </div>
                <h4 className="text-white font-semibold">Monitor Progress</h4>
                <p className="text-gray-300 text-sm">
                  See how much you&apos;ve completed
                </p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <BoltIcon className="h-6 w-6 text-white" />
                </div>
                <h4 className="text-white font-semibold">Stay Organized</h4>
                <p className="text-gray-300 text-sm">
                  Never miss a payment deadline
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features-section"
        className="relative z-10 px-4 sm:px-6 lg:px-8 py-16 sm:py-24"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-3xl sm:text-5xl font-bold text-white mb-4 sm:mb-6 font-display">
              Everything You Need for
              <span className="block bg-gradient-to-r from-primary-400 to-emerald-400 bg-clip-text text-transparent">
                Your Tini Tutorials
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto">
              Simple, secure payment tracking designed specifically for your
              learning journey
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 sm:p-8 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
              >
                <div
                  className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${feature.color} mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4 group-hover:text-primary-400 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <div className="bg-gradient-to-r from-primary-500/10 to-emerald-500/10 backdrop-blur-sm border border-primary-500/20 rounded-3xl p-8 sm:p-12">
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="mb-6"
            >
              <BoltIcon className="h-16 w-16 sm:h-20 sm:w-20 text-primary-500 mx-auto" />
            </motion.div>

            <h2 className="text-3xl sm:text-5xl font-bold text-white mb-4 sm:mb-6 font-display">
              Ready to Transform Your
              <span className="block bg-gradient-to-r from-primary-400 to-emerald-400 bg-clip-text text-transparent">
                Learning Experience?
              </span>
            </h2>

            <p className="text-lg sm:text-xl text-slate-300 mb-8 sm:mb-10 max-w-2xl mx-auto">
              Join thousands of students who trust PayTrack by Tini for their
              educational payment management
            </p>

            {!session && (
              <motion.button
                onClick={() => signIn("google")}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-primary-500 to-emerald-600 hover:from-primary-600 hover:to-emerald-700 text-white px-8 sm:px-12 py-4 sm:py-5 rounded-xl font-bold text-lg sm:text-xl transition-all duration-300 shadow-2xl hover:shadow-glow-lg flex items-center justify-center space-x-3 mx-auto group"
              >
                <span>Get Started Free</span>
                <ArrowRightIcon className="h-5 w-5 sm:h-6 sm:w-6 group-hover:translate-x-1 transition-transform duration-200" />
              </motion.button>
            )}
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-4 sm:px-6 lg:px-8 py-8 sm:py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex items-center justify-center space-x-2 mb-4"
          >
            <BoltIcon className="h-6 w-6 text-primary-500" />
            <span className="text-lg font-bold text-white">
              PayTrack by Tini
            </span>
          </motion.div>
          <p className="text-slate-400 text-sm sm:text-base">
            © 2024 PayTrack by Tini. Empowering learners worldwide.
          </p>
        </div>
      </footer>
    </div>
  );
}
