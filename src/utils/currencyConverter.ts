export const convertCurrency = (
  amount: number,
  fromCurrency: string,
  toCurrency: string,
  rates: Record<string, number>
): number => {
  if (fromCurrency === toCurrency) return amount;

  // Convert from source currency → USD (base)
  // rates[fromCurrency] is the value of 1 USD in fromCurrency
  // So USD_amount = amount / rates[fromCurrency]
  const rateFrom = rates[fromCurrency];
  const rateTo = rates[toCurrency];

  if (!rateFrom || !rateTo) {
    console.warn(`Missing exchange rate for ${fromCurrency} or ${toCurrency}`);
    return amount;
  }

  const amountInUSD = amount / rateFrom;

  // Convert from USD → target currency
  // target_amount = USD_amount * rates[toCurrency]
  return amountInUSD * rateTo;
};

export const formatCurrency = (amount: number, currencyCode: string) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
  }).format(amount);
};
