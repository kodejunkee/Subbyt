export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const getNextBillingDate = (dateString: string, billingCycle: "monthly" | "yearly") => {
  const date = new Date(dateString);
  const now = new Date();

  // If the date is in the future, return it
  if (date > now) {
    return date.toISOString();
  }

  // Otherwise, calculate the next occurrence
  const nextDate = new Date(date);
  while (nextDate < now) {
    if (billingCycle === "monthly") {
      nextDate.setMonth(nextDate.getMonth() + 1);
    } else {
      nextDate.setFullYear(nextDate.getFullYear() + 1);
    }
  }

  return nextDate.toISOString();
};

export const getDaysUntil = (dateString: string) => {
  const target = new Date(dateString);
  const now = new Date();
  const diffTime = target.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};
