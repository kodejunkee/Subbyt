import { saveSettings, getSettings } from "../storage/storage";

const API_URL = "https://open.er-api.com/v6/latest/USD";
const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;

export const fetchExchangeRates = async () => {
  try {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 15000); // 15 second timeout

    const response = await fetch(API_URL, { signal: controller.signal });
    clearTimeout(id);
    const data = await response.json();

    if (data.result === "success") {
      const settings = await getSettings();
      const updatedSettings = {
        ...settings,
        exchangeRates: data.rates,
        ratesLastFetched: Date.now(),
      };
      await saveSettings(updatedSettings);
      return data.rates;
    }
    return null;
  } catch (error: any) {
    if (error.name === "AbortError") {
      console.warn("Exchange rate fetch timed out. Using fallback rates if available.");
    } else {
      console.error("Failed to fetch exchange rates", error);
    }
    return null;
  }
};

export const initializeExchangeRates = async () => {
  const settings = await getSettings();
  const now = Date.now();

  // Load stored rates first
  if (Object.keys(settings.exchangeRates).length > 1) {
    // If we have rates and they are fresh (less than 24h), we're good
    if (now - settings.ratesLastFetched < TWENTY_FOUR_HOURS) {
      return settings.exchangeRates;
    }
  }

  // Attempt to fetch fresh rates if no rates exist or they are old
  const freshRates = await fetchExchangeRates();
  return freshRates || settings.exchangeRates;
};
