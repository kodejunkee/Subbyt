import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity, ActivityIndicator } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Wallet, Landmark, ArrowRight, Plus } from "lucide-react-native";
import { getSubscriptions, getBudget, getSettings } from "../storage/storage";
import { initializeExchangeRates } from "../utils/exchangeRateService";
import { calculateTotals, getBudgetStatus, performAutoRenewals } from "../utils/subscriptionCalculator";
import { Subscription, Budget, AppSettings, BudgetStatus } from "../types/subscription";
import SummaryCard from "../components/SummaryCard";
import BudgetProgressBar from "../components/BudgetProgressBar";
import SubscriptionItem from "../components/SubscriptionItem";
import { saveSubscriptions } from "../storage/storage";
import { useTheme } from "../context/ThemeContext";

const IconPlus = Plus as any;
const IconArrowRight = ArrowRight as any;
const IconWallet = Wallet as any;
const IconLandmark = Landmark as any;

const HomeScreen = () => {
  const { colors, isDark } = useTheme();
  const navigation = useNavigation<any>();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [budget, setBudget] = useState<Budget>({ type: "monthly", amount: 0 });
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [totals, setTotals] = useState({ monthlyTotal: 0, yearlyTotal: 0 });
  const [budgetStatus, setBudgetStatus] = useState<BudgetStatus | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    try {
      // First, check and perform any due renewals
      await performAutoRenewals();

      const [storedSubs, storedBudget, storedSettings] = await Promise.all([
        getSubscriptions(),
        getBudget(),
        getSettings(),
      ]);

      const rates = await initializeExchangeRates();

      const currentSettings = { ...storedSettings, exchangeRates: rates || storedSettings.exchangeRates };

      const calcTotals = calculateTotals(storedSubs, currentSettings.preferredCurrency, currentSettings.exchangeRates);

      const status = getBudgetStatus(
        storedBudget.type === "monthly" ? calcTotals.monthlyTotal : calcTotals.yearlyTotal,
        storedBudget,
        currentSettings.preferredCurrency,
        currentSettings.exchangeRates
      );

      setSubscriptions(storedSubs);
      setBudget(storedBudget);
      setSettings(currentSettings);
      setTotals(calcTotals);
      setBudgetStatus(status);
    } catch (error) {
      console.error("Critical error in loadData:", error);
      // Fail-safe defaults
      setSettings({
        preferredCurrency: "USD",
        exchangeRates: { USD: 1 },
        notificationsEnabled: true,
        notificationTime: "09:00",
        ratesLastFetched: 0,
        theme: "system"
      });
      setBudgetStatus({
        total: 0,
        budget: 0,
        remaining: 0,
        percentage: 0,
        status: "safe"
      });
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleDelete = async (id: string) => {
    const updatedSubs = subscriptions.filter((s) => s.id !== id);
    setSubscriptions(updatedSubs);
    await saveSubscriptions(updatedSubs);
    loadData();
  };

  if (!settings || !budgetStatus) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const upcomingSubscriptions = [...subscriptions]
    .sort((a, b) => new Date(a.nextBillingDate).getTime() - new Date(b.nextBillingDate).getTime())
    .slice(0, 3);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
      >
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: colors.text }]}>Hi there!</Text>
            <Text style={[styles.date, { color: colors.subtext }]}>{new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</Text>
          </View>
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: colors.surface, borderStyle: "solid", borderWidth: 1, borderColor: colors.border }]}
            onPress={() => navigation.navigate("AddSubscription")}
          >
            <IconPlus color={colors.primary} size={24} />
          </TouchableOpacity>
        </View>

        <SummaryCard
          title="Monthly Spend"
          amount={totals.monthlyTotal}
          currency={settings.preferredCurrency}
          icon={Wallet}
          iconColor={colors.primary}
        />

        <SummaryCard
          title="Yearly Spend"
          amount={totals.yearlyTotal}
          currency={settings.preferredCurrency}
          icon={Landmark}
          iconColor={colors.accent}
        />

        <BudgetProgressBar status={budgetStatus} />

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Upcoming Payments</Text>
          <TouchableOpacity
            style={styles.seeAllContainer}
            onPress={() => navigation.navigate("Subscriptions")}
          >
            <Text style={[styles.seeAll, { color: colors.subtext }]}>See All</Text>
            <IconArrowRight size={14} color={colors.subtext} />
          </TouchableOpacity>
        </View>

        {upcomingSubscriptions.length > 0 ? (
          upcomingSubscriptions.map((sub) => (
            <SubscriptionItem key={sub.id} subscription={sub} onDelete={handleDelete} />
          ))
        ) : (
          <View style={[styles.emptyContainer, { backgroundColor: colors.surface }]}>
            <Text style={[styles.emptyText, { color: colors.subtext }]}>No subscriptions yet</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FB",
  },
  scrollContent: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 110,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  date: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#1A1A1A",
    justifyContent: "center",
    alignItems: "center",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  seeAllContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  seeAll: {
    fontSize: 14,
    color: "#666",
    marginRight: 4,
  },
  emptyContainer: {
    padding: 24,
    backgroundColor: "#FFF",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    color: "#999",
    fontSize: 14,
  },
});

export default HomeScreen;
