import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Check, Target, TrendingUp } from "lucide-react-native";
import { getBudget, saveBudget, getSettings } from "../storage/storage";
import { Budget, BillingCycle, AppSettings } from "../types/subscription";
import CurrencyDisplay from "../components/CurrencyDisplay";
import { useTheme } from "../context/ThemeContext";

const IconCheck = Check as any;
const IconTarget = Target as any;
const IconTrendingUp = TrendingUp as any;

const BudgetScreen = () => {
  const { colors, isDark } = useTheme();
  const navigation = useNavigation<any>();
  const [budget, setBudget] = useState<Budget>({ type: "monthly", amount: 0 });
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [amount, setAmount] = useState("");

  useEffect(() => {
    const loadData = async () => {
      const [storedBudget, storedSettings] = await Promise.all([getBudget(), getSettings()]);
      setBudget(storedBudget);
      setSettings(storedSettings);
      setAmount(storedBudget.amount > 0 ? storedBudget.amount.toString() : "");
    };
    loadData();
  }, []);

  const handleSave = async () => {
    const finalAmount = parseFloat(amount) || 0;
    const newBudget = { ...budget, amount: finalAmount };
    await saveBudget(newBudget);
    navigation.goBack();
  };

  if (!settings) return null;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Set Budget</Text>
        <TouchableOpacity style={[styles.saveButton, { backgroundColor: colors.primary }]} onPress={handleSave}>
          <IconCheck size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.form}>
        <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
          <IconTarget size={32} color={colors.primary} style={{ marginBottom: 12 }} />
          <Text style={[styles.infoTitle, { color: colors.text }]}>Track Your Spending</Text>
          <Text style={[styles.infoDescription, { color: colors.subtext }]}>
            Set a monthly or yearly target to keep your subscription costs under control.
          </Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.subtext }]}>Budget Type</Text>
          <View style={[styles.cycleContainer, { backgroundColor: colors.surface }]}>
            <TouchableOpacity
              style={[
                styles.cycleButton, 
                budget.type === "monthly" && [styles.cycleActive, { backgroundColor: isDark ? colors.background : "#FFF" }]
              ]}
              onPress={() => setBudget({ ...budget, type: "monthly" })}
            >
              <Text style={[
                styles.cycleText, 
                { color: colors.subtext },
                budget.type === "monthly" && { color: colors.text }
              ]}>
                Monthly
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.cycleButton, 
                budget.type === "yearly" && [styles.cycleActive, { backgroundColor: isDark ? colors.background : "#FFF" }]
              ]}
              onPress={() => setBudget({ ...budget, type: "yearly" })}
            >
              <Text style={[
                styles.cycleText, 
                { color: colors.subtext },
                budget.type === "yearly" && { color: colors.text }
              ]}>
                Yearly
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.subtext }]}>Budget Amount</Text>
          <View style={[styles.amountContainer, { backgroundColor: colors.card }]}>
            <Text style={[styles.currencyPrefix, { color: colors.primary }]}>{settings.preferredCurrency}</Text>
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder="0.00"
              placeholderTextColor={colors.subtext}
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
            />
          </View>
        </View>

        <View style={[styles.previewCard, { backgroundColor: isDark ? colors.card : "#1A1A1A", borderColor: colors.border, borderWidth: isDark ? 1 : 0 }]}>
          <Text style={styles.previewLabel}>Current Budget</Text>
          <View style={styles.previewRow}>
            <CurrencyDisplay
              amount={parseFloat(amount) || 0}
              currency={settings.preferredCurrency}
              style={styles.previewAmount}
            />
            <Text style={styles.previewCycle}>
              {budget.type === "monthly" ? "per month" : "per year"}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FB",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  saveButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#4A7AFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#4A7AFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  form: {
    padding: 20,
  },
  infoCard: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 8,
  },
  infoDescription: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
    fontWeight: "600",
  },
  cycleContainer: {
    flexDirection: "row",
    backgroundColor: "#EBECEF",
    borderRadius: 14,
    padding: 4,
  },
  cycleButton: {
    flex: 1,
    height: 48,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  cycleActive: {
    backgroundColor: "#FFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cycleText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#666",
  },
  cycleTextActive: {
    color: "#1A1A1A",
  },
  amountContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 14,
    height: 60,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  currencyPrefix: {
    fontSize: 16,
    fontWeight: "700",
    color: "#4A7AFF",
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 20,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  previewCard: {
    marginTop: 12,
    padding: 20,
    borderRadius: 16,
    backgroundColor: "#1A1A1A",
  },
  previewLabel: {
    fontSize: 12,
    color: "#999",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 4,
  },
  previewRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  previewAmount: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FFF",
    marginRight: 8,
  },
  previewCycle: {
    fontSize: 14,
    color: "#999",
  },
});

export default BudgetScreen;
