import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { BudgetStatus } from "../types/subscription";
import { useTheme } from "../context/ThemeContext";

interface Props {
  status: BudgetStatus;
}

const BudgetProgressBar: React.FC<Props> = ({ status }) => {
  const { colors } = useTheme();
  
  const getStatusColor = (statusName: string) => {
    switch (statusName) {
      case "critical":
        return colors.error;
      case "warning":
        return "#FFB84D"; // Keep warning as amber
      default:
        return colors.success;
    }
  };

  const color = getStatusColor(status.status);
  const barWidth = Math.min(100, status.percentage);

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <View style={styles.header}>
        <Text style={[styles.label, { color: colors.subtext }]}>Budget Usage</Text>
        <Text style={[styles.percentage, { color }]}>{Math.round(status.percentage)}%</Text>
      </View>
      <View style={[styles.barContainer, { backgroundColor: colors.border }]}>
        <View style={[styles.bar, { width: `${barWidth}%`, backgroundColor: color }]} />
      </View>
      <View style={styles.footer}>
        <Text style={[styles.statusText, { color: colors.subtext }]}>
          {status.status === "critical"
            ? "Critical: Over Budget!"
            : status.status === "warning"
            ? "Warning: Approaching Limit"
            : "Safe: Within Budget"}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  percentage: {
    fontSize: 16,
    fontWeight: "700",
  },
  barContainer: {
    height: 10,
    backgroundColor: "#F0F0F0",
    borderRadius: 5,
    overflow: "hidden",
    marginBottom: 12,
  },
  bar: {
    height: "100%",
    borderRadius: 5,
  },
  footer: {
    alignItems: "flex-end",
  },
  statusText: {
    fontSize: 12,
    color: "#999",
    fontStyle: "italic",
  },
});

export default BudgetProgressBar;
