import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LucideIcon } from "lucide-react-native";
import CurrencyDisplay from "./CurrencyDisplay";
import { useTheme } from "../context/ThemeContext";

interface Props {
  title: string;
  amount: number;
  currency: string;
  icon: LucideIcon;
  iconColor: string;
  subtitle?: string;
}

const SummaryCard: React.FC<Props> = ({ title, amount, currency, icon: Icon, iconColor, subtitle }) => {
  const { colors } = useTheme();
  const IconComponent = Icon as any;
  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <View style={[styles.iconContainer, { backgroundColor: iconColor + "20" }]}>
        <IconComponent size={24} color={iconColor} />
      </View>
      <View style={styles.textContainer}>
        <Text style={[styles.title, { color: colors.subtext }]}>{title}</Text>
        <CurrencyDisplay amount={amount} currency={currency} style={[styles.amount, { color: colors.text }]} />
        {subtitle && <Text style={[styles.subtitle, { color: colors.subtext }]}>{subtitle}</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
    fontWeight: "500",
  },
  amount: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  subtitle: {
    fontSize: 12,
    color: "#999",
    marginTop: 2,
  },
});

export default SummaryCard;
