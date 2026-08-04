import AsyncStorage from "@react-native-async-storage/async-storage";
import { Subscription, Budget, AppSettings } from "../types/subscription";

const STORAGE_KEYS = {
  SUBSCRIPTIONS: "subbyt_subscriptions",
  BUDGET: "subbyt_budget",
  SETTINGS: "subbyt_settings",
};

export const saveSubscriptions = async (subscriptions: Subscription[]) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.SUBSCRIPTIONS, JSON.stringify(subscriptions));
  } catch (error) {
    console.error("Error saving subscriptions", error);
  }
};

export const getSubscriptions = async (): Promise<Subscription[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.SUBSCRIPTIONS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error getting subscriptions", error);
    return [];
  }
};

export const saveBudget = async (budget: Budget) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.BUDGET, JSON.stringify(budget));
  } catch (error) {
    console.error("Error saving budget", error);
  }
};

export const getBudget = async (): Promise<Budget> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.BUDGET);
    return data ? JSON.parse(data) : { type: "monthly", amount: 0 };
  } catch (error) {
    console.error("Error getting budget", error);
    return { type: "monthly", amount: 0 };
  }
};

export const saveSettings = async (settings: AppSettings) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (error) {
    console.error("Error saving settings", error);
  }
};

export const getSettings = async (): Promise<AppSettings> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
    return data
      ? JSON.parse(data)
      : {
          preferredCurrency: "USD",
          exchangeRates: { USD: 1 },
          notificationsEnabled: true,
          notificationTime: "09:00",
          ratesLastFetched: 0,
          theme: "system",
        };
  } catch (error) {
    console.error("Error getting settings", error);
    return {
      preferredCurrency: "USD",
      exchangeRates: { USD: 1 },
      notificationsEnabled: true,
      notificationTime: "09:00",
      ratesLastFetched: 0,
      theme: "system",
    };
  }
};
