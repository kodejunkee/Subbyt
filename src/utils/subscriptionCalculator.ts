import { Subscription, Budget, BudgetStatus } from "../types/subscription";
import { convertCurrency } from "./currencyConverter";

export const calculateTotals = (
  subscriptions: Subscription[],
  targetCurrency: string,
  rates: Record<string, number>
) => {
  let monthlyTotal = 0;
  let yearlyTotal = 0;

  subscriptions.forEach((sub) => {
    const amountInTarget = convertCurrency(sub.price, sub.currency, targetCurrency, rates);
    const interval = sub.billingInterval || 1;

    let subMonthly = 0;
    let subYearly = 0;

    switch (sub.billingCycle) {
      case "daily":
        subMonthly = (amountInTarget / interval) * 30;
        subYearly = (amountInTarget / interval) * 365;
        break;
      case "weekly":
        subMonthly = (amountInTarget / interval) * (52 / 12);
        subYearly = (amountInTarget / interval) * 52;
        break;
      case "monthly":
        subMonthly = amountInTarget / interval;
        subYearly = (amountInTarget / interval) * 12;
        break;
      case "yearly":
        subMonthly = amountInTarget / (interval * 12);
        subYearly = amountInTarget / interval;
        break;
    }

    monthlyTotal += subMonthly;
    yearlyTotal += subYearly;
  });

  return { monthlyTotal, yearlyTotal };
};

export const calculateNextBillingDate = (date: Date, cycle: string, interval: number): Date => {
  const nextDate = new Date(date);
  const safeInterval = interval || 1;

  switch (cycle) {
    case "daily":
      nextDate.setDate(nextDate.getDate() + safeInterval);
      break;
    case "weekly":
      nextDate.setDate(nextDate.getDate() + (safeInterval * 7));
      break;
    case "monthly":
      nextDate.setMonth(nextDate.getMonth() + safeInterval);
      break;
    case "yearly":
      nextDate.setFullYear(nextDate.getFullYear() + safeInterval);
      break;
  }
  return nextDate;
};

import { getSubscriptions, saveSubscriptions } from "../storage/storage";
import { scheduleSubscriptionReminders } from "./notifications";

export const performAutoRenewals = async () => {
  const subscriptions = await getSubscriptions();
  const now = new Date();
  let updated = false;

  const updatedSubs = await Promise.all(subscriptions.map(async (sub) => {
    if (!sub.autoRenew) return sub;

    let nextDate = new Date(sub.nextBillingDate);
    if (nextDate >= now) return sub;

    // Advance the date until it's in the future
    while (nextDate < now) {
      nextDate = calculateNextBillingDate(nextDate, sub.billingCycle, sub.billingInterval);
    }

    updated = true;
    const updatedSub = { ...sub, nextBillingDate: nextDate.toISOString() };
    
    // Reschedule notifications for the new date
    await scheduleSubscriptionReminders(updatedSub);
    
    return updatedSub;
  }));

  if (updated) {
    await saveSubscriptions(updatedSubs);
  }
  return updated;
};

export const getBudgetStatus = (
  totalInBaseCurrency: number,
  budget: Budget,
  baseCurrency: string,
  rates: Record<string, number>
): BudgetStatus => {
  const budgetCurrency = budget.currency || baseCurrency;
  
  const total = convertCurrency(totalInBaseCurrency, baseCurrency, budgetCurrency, rates);

  const percentage = budget.amount > 0 ? (total / budget.amount) * 100 : 0;
  const remaining = Math.max(0, budget.amount - total);

  let status: "safe" | "warning" | "critical" = "safe";
  if (percentage > 90) {
    status = "critical";
  } else if (percentage > 70) {
    status = "warning";
  }

  return {
    total,
    budget: budget.amount,
    remaining,
    percentage,
    status,
  };
};
