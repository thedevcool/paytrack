import mongoose from "mongoose";

export interface IPayment extends mongoose.Document {
  programId: string;
  userId: string;
  amount: number;
  reference: string;
  status: "success" | "failed" | "pending";
  paymentDate: Date;
  paymentMethod: string;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new mongoose.Schema(
  {
    programId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Program",
      required: true,
      index: true,
    },
    userId: {
      type: String,
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    reference: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: ["success", "failed", "pending"],
      required: true,
    },
    paymentDate: {
      type: Date,
      required: true,
    },
    paymentMethod: {
      type: String,
      default: "paystack",
    },
  },
  {
    timestamps: true,
  }
);

export const Payment =
  mongoose.models.Payment || mongoose.model<IPayment>("Payment", PaymentSchema);
