import React, { useEffect } from "react";
import { LogBox } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";
import * as Linking from "expo-linking";

import HomeScreen from "./src/screens/HomeScreen";
import SubscriptionsScreen from "./src/screens/SubscriptionsScreen";
import AddSubscriptionScreen from "./src/screens/AddSubscriptionScreen";
import BudgetScreen from "./src/screens/BudgetScreen";
import SettingsScreen from "./src/screens/SettingsScreen";
import PrivacyPolicyScreen from "./src/screens/PrivacyPolicyScreen";

import { registerForPushNotificationsAsync } from "./src/utils/notifications";
import { initializeExchangeRates } from "./src/utils/exchangeRateService";
import { getSettings, saveSettings } from "./src/storage/storage";
import { ThemeProvider, useTheme } from "./src/context/ThemeContext";
import { CustomTabBar } from "./src/components/CustomTabBar";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const TabNavigator = () => {
  const { colors } = useTheme();
  return (
    <Tab.Navigator
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Subscriptions" component={SubscriptionsScreen} />
      <Tab.Screen name="Budget" component={BudgetScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

const NavigationRoot = () => {
  const { colors, isDark } = useTheme();

  const linking: any = {
    prefixes: [Linking.createURL('/')],
    config: {
      screens: {
        Main: {
          screens: {
            Home: 'home',
            Subscriptions: 'search',
          }
        },
        AddSubscription: 'add',
      },
    },
  };

  return (
    <NavigationContainer linking={linking}>
      <StatusBar style={isDark ? "light" : "dark"} />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={TabNavigator} />
        <Stack.Screen
          name="AddSubscription"
          component={AddSubscriptionScreen}
          options={{
            presentation: "modal",
          }}
        />
        <Stack.Screen
          name="PrivacyPolicy"
          component={PrivacyPolicyScreen}
          options={{
            presentation: "modal",
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default function App() {
  useEffect(() => {
    // Suppress persistent deprecation warnings from dependencies
    LogBox.ignoreLogs([
      "InteractionManager has been deprecated",
      "DateTimePicker: `onChange` is deprecated",
    ]);

    const initApp = async () => {
      try {
        // Initialize notifications
        await registerForPushNotificationsAsync();

        // Initialize exchange rates on startup
        await initializeExchangeRates();

        // Ensure default settings exist
        const settings = await getSettings();
        if (!settings.preferredCurrency) {
          await saveSettings({
            ...settings,
            preferredCurrency: "USD",
            exchangeRates: { USD: 1 },
            notificationsEnabled: true,
            notificationTime: "09:00",
            ratesLastFetched: 0,
            theme: "system",
          });
        }
      } catch (error) {
        console.error("Error during app initialization:", error);
      }
    };

    initApp();
  }, []);

  return (
    <ThemeProvider>
      <NavigationRoot />
    </ThemeProvider>
  );
}
