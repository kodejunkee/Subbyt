export type BillingCycle = "daily" | "weekly" | "monthly" | "yearly";

export interface Subscription {
  id: string;
  name: string;
  price: number;
  currency: string; // ISO 4217 code
  billingCycle: BillingCycle;
  billingInterval: number; // e.g., "every 3 [cycleType]"
  nextBillingDate: string; // ISO format string
  autoRenew: boolean;
  icon?: string;
  customImage?: string;
  category?: string;
}

export interface Budget {
  type: "monthly" | "yearly";
  amount: number;
  currency?: string;
}

export interface AppSettings {
  preferredCurrency: string;
  exchangeRates: Record<string, number>;
  notificationsEnabled: boolean;
  notificationTime: string; // "HH:mm" format
  ratesLastFetched: number; // Timestamp
  theme: "light" | "dark" | "system";
}

export interface BudgetStatus {
  total: number;
  budget: number;
  remaining: number;
  percentage: number;
  status: "safe" | "warning" | "critical";
}
