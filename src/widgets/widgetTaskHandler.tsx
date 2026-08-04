import React from 'react';
import { WidgetTaskHandlerProps } from 'react-native-android-widget';
import { UpcomingWidget } from './UpcomingWidget';
import { getSubscriptions, getSettings } from '../storage/storage';
import { getDaysUntil } from '../utils/dateUtils';
import { calculateTotals } from '../utils/subscriptionCalculator';
import { ICON_COLOR_MAP } from '../utils/icons';

export async function widgetTaskHandler(props: WidgetTaskHandlerProps) {
  if (props.widgetInfo.widgetName !== 'SubbytWidget') {
    return;
  }

  try {
    const subscriptions = await getSubscriptions();
    const settings = await getSettings();
    
    // Calculate stats
    const activeCount = subscriptions.length;
    const validSubs = subscriptions.filter(s => s.nextBillingDate);
    const dueSoonCount = validSubs.filter(s => getDaysUntil(s.nextBillingDate) <= 7 && getDaysUntil(s.nextBillingDate) >= 0).length;
    
    const { monthlyTotal, yearlyTotal } = calculateTotals(
      subscriptions, 
      settings.preferredCurrency, 
      settings.exchangeRates
    );
    
    const currencySymbols: Record<string, string> = { USD: "$", EUR: "€", GBP: "£", JPY: "¥", NGN: "₦" };
    const baseSymbol = currencySymbols[settings.preferredCurrency] || "$";
    
    // Format numbers
    const formatMoney = (amount: number) => {
      return Math.round(amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };
    
    const thisMonthTotalStr = `${baseSymbol}${formatMoney(monthlyTotal)}`;
    const thisYearTotalStr = `${baseSymbol}${formatMoney(yearlyTotal)}`;

    if (subscriptions.length === 0) {
      props.renderWidget(
        <UpcomingWidget
          subscriptionName=""
          subscriptionPrice=""
          daysUntil={0}
          nextDateStr=""
          activeCount={0}
          dueSoonCount={0}
          thisMonthTotal={`${baseSymbol}0`}
          thisYearTotal={`${baseSymbol}0`}
          brandColor="#4A7AFF"
        />
      );
      return;
    }

    const sorted = validSubs.sort((a, b) => getDaysUntil(a.nextBillingDate) - getDaysUntil(b.nextBillingDate));
    const nextSub = sorted[0];

    if (!nextSub) {
      props.renderWidget(
        <UpcomingWidget
          subscriptionName=""
          subscriptionPrice=""
          daysUntil={0}
          nextDateStr=""
          activeCount={activeCount}
          dueSoonCount={dueSoonCount}
          thisMonthTotal={thisMonthTotalStr}
          thisYearTotal={thisYearTotalStr}
          brandColor="#4A7AFF"
        />
      );
      return;
    }

    const daysUntil = getDaysUntil(nextSub.nextBillingDate);
    const symbol = currencySymbols[nextSub.currency || "USD"] || "$";
    const priceStr = `${symbol}${nextSub.price.toFixed(2)}`;
    
    // format date as "12 Jun 2025"
    const nextDateObj = new Date(nextSub.nextBillingDate);
    const nextDateStr = nextDateObj.toLocaleDateString("en-GB", { day: 'numeric', month: 'short', year: 'numeric' });
    
    const brandColor = ICON_COLOR_MAP[nextSub.name] || '#7E57C2';

    props.renderWidget(
      <UpcomingWidget
        subscriptionName={nextSub.name}
        subscriptionPrice={priceStr}
        daysUntil={daysUntil >= 0 ? daysUntil : 0}
        nextDateStr={nextDateStr}
        activeCount={activeCount}
        dueSoonCount={dueSoonCount}
        thisMonthTotal={thisMonthTotalStr}
        thisYearTotal={thisYearTotalStr}
        brandColor={brandColor}
      />
    );
  } catch (error) {
    console.error("Error in widgetTaskHandler:", error);
    props.renderWidget(
      <UpcomingWidget
        subscriptionName="Error loading"
        subscriptionPrice=""
        daysUntil={0}
        nextDateStr=""
        activeCount={0}
        dueSoonCount={0}
        thisMonthTotal="$0"
        thisYearTotal="$0"
        brandColor="#FF453A"
      />
    );
  }
}
