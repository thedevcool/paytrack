export const calculatePaymentAmount = (
  costPerMonth: number,
  paymentSchedule: "daily" | "weekly" | "monthly" | "once",
  duration: number
): number => {
  const totalAmount = costPerMonth * duration;

  switch (paymentSchedule) {
    case "daily":
      return Math.round((costPerMonth / 30) * 100) / 100; // Assuming 30 days per month
    case "weekly":
      return Math.round((costPerMonth / 4) * 100) / 100; // Assuming 4 weeks per month
    case "monthly":
      return costPerMonth;
    case "once":
      return totalAmount;
    default:
      return costPerMonth;
  }
};

export const calculateNextPaymentDate = (
  startDate: Date,
  paymentSchedule: "daily" | "weekly" | "monthly" | "once"
): Date => {
  const nextDate = new Date(startDate);

  switch (paymentSchedule) {
    case "daily":
      nextDate.setDate(nextDate.getDate() + 1);
      break;
    case "weekly":
      nextDate.setDate(nextDate.getDate() + 7);
      break;
    case "monthly":
      nextDate.setMonth(nextDate.getMonth() + 1);
      break;
    case "once":
      // For one-time payment, next payment is never
      return new Date("2099-12-31");
    default:
      nextDate.setMonth(nextDate.getMonth() + 1);
  }

  return nextDate;
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  }).format(amount);
};

export const calculateProgress = (
  amountPaid: number,
  totalAmount: number
): number => {
  return Math.min((amountPaid / totalAmount) * 100, 100);
};
