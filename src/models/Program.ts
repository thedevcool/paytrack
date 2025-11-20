import mongoose from "mongoose";

export interface IProgram extends mongoose.Document {
  userId: string;
  userEmail: string;
  userName: string;
  programName: string;
  costPerMonth: number;
  duration: number; // in months
  paymentSchedule: "daily" | "weekly" | "monthly" | "once";
  totalAmount: number;
  amountPaid: number;
  nextPaymentDate?: Date; // Only set after first payment
  paymentHistory: {
    amount: number;
    date: Date;
    reference: string;
    status: "success" | "failed" | "pending";
  }[];
  isCompleted: boolean;
  status: "pending" | "approved" | "revoked" | "frozen";
  approvedAt?: Date;
  approvedBy?: string;
  isFrozen: boolean;
  frozenAt?: Date;
  frozenReason?: string;
  lastMissedPaymentDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ProgramSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    userEmail: {
      type: String,
      required: true,
      index: true,
    },
    userName: {
      type: String,
      required: true,
    },
    programName: {
      type: String,
      required: true,
    },
    costPerMonth: {
      type: Number,
      required: true,
    },
    duration: {
      type: Number,
      required: true, // in months
    },
    paymentSchedule: {
      type: String,
      enum: ["daily", "weekly", "monthly", "once"],
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    amountPaid: {
      type: Number,
      default: 0,
    },
    nextPaymentDate: {
      type: Date,
      required: false, // Only set after first payment
    },
    paymentHistory: [
      {
        amount: Number,
        date: Date,
        reference: String,
        status: {
          type: String,
          enum: ["success", "failed", "pending"],
        },
      },
    ],
    isCompleted: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "revoked", "frozen"],
      default: "pending",
    },
    approvedAt: {
      type: Date,
    },
    approvedBy: {
      type: String,
    },
    isFrozen: {
      type: Boolean,
      default: false,
    },
    frozenAt: {
      type: Date,
    },
    frozenReason: {
      type: String,
    },
    lastMissedPaymentDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Force delete cached model to ensure schema changes take effect
if (mongoose.models.Program) {
  delete mongoose.models.Program;
}

// Create the model with the updated schema
export const Program = mongoose.model<IProgram>("Program", ProgramSchema);

export default Program;
