import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Modal, FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Check, Target, TrendingUp, Search, X, ChevronDown } from "lucide-react-native";
import { getBudget, saveBudget, getSettings } from "../storage/storage";
import { Budget, BillingCycle, AppSettings } from "../types/subscription";
import CurrencyDisplay from "../components/CurrencyDisplay";
import { useTheme } from "../context/ThemeContext";
import { getCurrencySearchTerms, getCurrencyName } from "../utils/currencies";

const IconCheck = Check as any;
const IconTarget = Target as any;
const IconTrendingUp = TrendingUp as any;
const IconSearch = Search as any;
const IconX = X as any;
const IconChevronDown = ChevronDown as any;

const BudgetScreen = () => {
  const { colors, isDark } = useTheme();
  const navigation = useNavigation<any>();
  const [savedBudget, setSavedBudget] = useState<Budget>({ type: "monthly", amount: 0, currency: "USD" });
  const [budget, setBudget] = useState<Budget>({ type: "monthly", amount: 0, currency: "USD" });
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [amount, setAmount] = useState("");
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const loadData = async () => {
      const [storedBudget, storedSettings] = await Promise.all([getBudget(), getSettings()]);
      const budgetCurrency = storedBudget.currency || storedSettings.preferredCurrency;
      const loadedBudget = { ...storedBudget, currency: budgetCurrency };
      setSavedBudget(loadedBudget);
      setBudget(loadedBudget);
      setSettings(storedSettings);
      setAmount(storedBudget.amount > 0 ? storedBudget.amount.toString() : "");
    };
    loadData();
  }, []);

  const handleSave = async () => {
    const finalAmount = parseFloat(amount) || 0;
    const newBudget = { ...budget, amount: finalAmount };
    await saveBudget(newBudget);
    setSavedBudget(newBudget);
  };

  if (!settings) return null;

  const currencies = Object.keys(settings.exchangeRates).sort();
  const filteredCurrencies = currencies.filter((c) =>
    getCurrencySearchTerms(c).includes(searchQuery.toLowerCase())
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Set Budget</Text>
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

        <View style={styles.row}>
          <View style={[styles.inputGroup, { width: 110, marginRight: 12, marginBottom: 0 }]}>
            <Text style={[styles.label, { color: colors.subtext }]}>Currency</Text>
            <TouchableOpacity
              style={[styles.selector, { backgroundColor: colors.card }]}
              onPress={() => setShowCurrencyModal(true)}
            >
              <Text style={[styles.selectorText, { color: colors.text }]}>{budget.currency}</Text>
              <IconChevronDown size={16} color={colors.subtext} />
            </TouchableOpacity>
          </View>

          <View style={[styles.inputGroup, { flex: 1, marginBottom: 0 }]}>
            <Text style={[styles.label, { color: colors.subtext }]}>Amount</Text>
            <View style={[styles.amountContainer, { backgroundColor: colors.card }]}>
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
        </View>

        <TouchableOpacity 
          style={[styles.fullWidthSaveButton, { backgroundColor: colors.primary }]} 
          onPress={handleSave}
        >
          <Text style={styles.fullWidthSaveButtonText}>Apply Budget</Text>
        </TouchableOpacity>

        <View style={[styles.previewCard, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1 }]}>
          <Text style={[styles.previewLabel, { color: colors.subtext }]}>Current Budget</Text>
          <View style={styles.previewRow}>
            <CurrencyDisplay
              amount={savedBudget.amount}
              currency={savedBudget.currency || "USD"}
              style={[styles.previewAmount, { color: colors.text }]}
            />
            <Text style={[styles.previewCycle, { color: colors.subtext }]}>
              {savedBudget.type === "monthly" ? "per month" : "per year"}
            </Text>
          </View>
        </View>
      </ScrollView>

      <Modal visible={showCurrencyModal} animationType="slide" transparent>
        <View style={styles.modalBg}>
          <TouchableOpacity 
            style={StyleSheet.absoluteFill} 
            activeOpacity={1} 
            onPress={() => setShowCurrencyModal(false)} 
          />
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Budget Currency</Text>
              <TouchableOpacity onPress={() => setShowCurrencyModal(false)}>
                <IconX size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            <View style={[styles.searchBar, { backgroundColor: colors.background }]}>
              <IconSearch size={18} color={colors.subtext} style={{ marginRight: 8 }} />
              <TextInput
                placeholder="Search..."
                placeholderTextColor={colors.subtext}
                style={[styles.searchInput, { color: colors.text }]}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
            <FlatList
              data={filteredCurrencies}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={[styles.currencyItem, { borderBottomColor: colors.border }]} 
                  onPress={() => {
                    setBudget({ ...budget, currency: item });
                    setShowCurrencyModal(false);
                  }}
                >
                  <Text style={[styles.currencyCode, { color: colors.text }]}>
                    {item} - {getCurrencyName(item)}
                  </Text>
                  {budget.currency === item && <IconCheck size={18} color={colors.primary} />}
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
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
  row: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  fullWidthSaveButton: {
    height: 56,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
    shadowColor: "#4A7AFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  fullWidthSaveButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "700",
  },
  form: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 110,
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
  },
  previewLabel: {
    fontSize: 12,
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
    marginRight: 8,
  },
  previewCycle: {
    fontSize: 14,
  },
  selector: {
    height: 60,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  selectorText: {
    fontSize: 16,
    fontWeight: "600",
  },
  modalBg: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: "80%",
    padding: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FB",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    height: "100%",
  },
  currencyItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  currencyCode: {
    fontSize: 16,
    fontWeight: "500",
  },
});

export default BudgetScreen;
