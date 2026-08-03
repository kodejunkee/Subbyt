import React, { useEffect } from "react";
import { LogBox } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";
import { Home, List, PieChart, Settings as SettingsIcon } from "lucide-react-native";

const IconHome = Home as any;
const IconList = List as any;
const IconPieChart = PieChart as any;
const IconSettings = SettingsIcon as any;

import HomeScreen from "./src/screens/HomeScreen";
import SubscriptionsScreen from "./src/screens/SubscriptionsScreen";
import AddSubscriptionScreen from "./src/screens/AddSubscriptionScreen";
import BudgetScreen from "./src/screens/BudgetScreen";
import SettingsScreen from "./src/screens/SettingsScreen";

import { registerForPushNotificationsAsync } from "./src/utils/notifications";
import { initializeExchangeRates } from "./src/utils/exchangeRateService";
import { getSettings, saveSettings } from "./src/storage/storage";
import { ThemeProvider, useTheme } from "./src/context/ThemeContext";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const TabNavigator = () => {
  const { colors } = useTheme();
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.subtext,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          height: 60,
          paddingBottom: 8,
        },
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }: { color: string; size: number }) => <IconHome color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Subscriptions"
        component={SubscriptionsScreen}
        options={{
          tabBarIcon: ({ color, size }: { color: string; size: number }) => <IconList color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Budget"
        component={BudgetScreen}
        options={{
          tabBarIcon: ({ color, size }: { color: string; size: number }) => <IconPieChart color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ color, size }: { color: string; size: number }) => <IconSettings color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
};

const NavigationRoot = () => {
  const { colors, isDark } = useTheme();
  return (
    <NavigationContainer>
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
