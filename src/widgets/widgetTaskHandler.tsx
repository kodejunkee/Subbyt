import React from 'react';
import { WidgetTaskHandlerProps } from 'react-native-android-widget';
import { UpcomingWidget } from './UpcomingWidget';
import { getSubscriptions } from '../storage/storage';
import { getDaysUntil } from '../utils/dateUtils';

export async function widgetTaskHandler(props: WidgetTaskHandlerProps) {
  if (props.widgetInfo.widgetName !== 'SubbytWidget') {
    return;
  }

  try {
    const subscriptions = await getSubscriptions();
    
    if (subscriptions.length === 0) {
      props.renderWidget(
        <UpcomingWidget
          subscriptionName=""
          subscriptionPrice=""
          daysUntil={0}
        />
      );
      return;
    }

    // Filter out invalid dates, just in case
    const validSubs = subscriptions.filter(s => s.nextBillingDate);
    
    // Sort subscriptions to find the one closest to its nextBillingDate
    const sorted = validSubs.sort((a, b) => {
      return getDaysUntil(a.nextBillingDate) - getDaysUntil(b.nextBillingDate);
    });

    const nextSub = sorted[0];
    if (!nextSub) {
        props.renderWidget(
          <UpcomingWidget
            subscriptionName=""
            subscriptionPrice=""
            daysUntil={0}
          />
        );
        return;
    }

    const daysUntil = getDaysUntil(nextSub.nextBillingDate);
    
    // Quick currency symbol resolver
    const currencySymbols: Record<string, string> = {
      USD: "$", EUR: "€", GBP: "£", JPY: "¥", NGN: "₦"
    };
    const symbol = currencySymbols[nextSub.currency || "USD"] || "$";
    const priceStr = `${symbol}${nextSub.price.toFixed(2)}`;

    props.renderWidget(
      <UpcomingWidget
        subscriptionName={nextSub.name}
        subscriptionPrice={priceStr}
        daysUntil={daysUntil >= 0 ? daysUntil : 0}
      />
    );
  } catch (error) {
    console.error("Error in widgetTaskHandler:", error);
    // Render error state
    props.renderWidget(
      <UpcomingWidget
        subscriptionName="Error loading"
        subscriptionPrice=""
        daysUntil={0}
      />
    );
  }
}
