import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";
import { Subscription } from "../types/subscription";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: false, // Deprecated, using specific flags below
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const registerForPushNotificationsAsync = async () => {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      return false;
    }
    return true;
  } else {
    return false;
  }
};

import { getSettings, getSubscriptions } from "../storage/storage";

export const scheduleSubscriptionReminders = async (subscription: Subscription) => {
  const settings = await getSettings();
  if (!settings.notificationsEnabled) {
    // If disabled, ensure any existing ones for this sub are cancelled
    await cancelSubscriptionReminders(subscription.id);
    return;
  }

  const timeParts = (settings.notificationTime || "09:00").split(":");
  const hours = parseInt(timeParts[0], 10) || 9;
  const minutes = parseInt(timeParts[1], 10) || 0;

  const billingDate = new Date(subscription.nextBillingDate);
  const now = new Date();

  const scheduleOptions = [
    { idSuffix: "3d", daysBefore: 3, title: "Upcoming Payment", body: `${subscription.name} renews in 3 days` },
    { idSuffix: "1d", daysBefore: 1, title: "Payment Tomorrow", body: `${subscription.name} renews tomorrow` },
    { idSuffix: "0d", daysBefore: 0, title: "Payment Due Today", body: `${subscription.name} renews today` },
  ];

  for (const option of scheduleOptions) {
    const triggerDate = new Date(billingDate);
    triggerDate.setDate(triggerDate.getDate() - option.daysBefore);
    triggerDate.setHours(hours, minutes, 0, 0); // Use configured time

    const identifier = `${subscription.id}_${option.idSuffix}`;

    if (triggerDate > now) {
      await Notifications.scheduleNotificationAsync({
        identifier, 
        content: {
          title: option.title,
          body: option.body,
          data: { subscriptionId: subscription.id },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: triggerDate,
        },
      } as Notifications.NotificationRequestInput);
    } else {
      await Notifications.cancelScheduledNotificationAsync(identifier);
    }
  }
};

export const cancelSubscriptionReminders = async (subscriptionId: string) => {
  const idSuffixes = ["3d", "1d", "0d"];
  for (const suffix of idSuffixes) {
    await Notifications.cancelScheduledNotificationAsync(`${subscriptionId}_${suffix}`);
  }
};

export const rescheduleAllNotifications = async () => {
  const subscriptions = await getSubscriptions();
  for (const sub of subscriptions) {
    await scheduleSubscriptionReminders(sub);
  }
};
