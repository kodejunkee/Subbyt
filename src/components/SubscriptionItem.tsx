import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Trash2, Calendar } from "lucide-react-native";
import { Subscription } from "../types/subscription";
import CurrencyDisplay from "./CurrencyDisplay";
import { formatDate, getDaysUntil } from "../utils/dateUtils";
import { useTheme } from "../context/ThemeContext";
import { ICON_MAP, ICON_COLOR_MAP } from "../utils/icons";

interface Props {
  subscription: Subscription;
  onDelete: (id: string) => void;
  onPress?: (subscription: Subscription) => void;
}

const SubscriptionItem: React.FC<Props> = ({ subscription, onDelete, onPress }) => {
  const { colors, isDark } = useTheme();
  const daysUntil = getDaysUntil(subscription.nextBillingDate);
  const IconCalendar = Calendar as any;
  const IconTrash = Trash2 as any;

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: colors.card, borderBottomColor: colors.border }]}
      onPress={() => onPress?.(subscription)}
      activeOpacity={0.7}
    >
      <View style={styles.leftContent}>
        <View style={[styles.initialContainer, { backgroundColor: "transparent" }]}>
          {subscription.customImage ? (
            <Image source={{ uri: subscription.customImage }} style={styles.iconImage} />
          ) : subscription.icon ? (
            (() => {
              const IconComp = ICON_MAP[subscription.icon];
              const iconColor = ICON_COLOR_MAP[subscription.icon] || colors.primary;
              return IconComp ? <IconComp size={44} color={iconColor} /> : (
                <Text style={[styles.initial, { color: colors.primary }]}>
                  {subscription.name.charAt(0).toUpperCase()}
                </Text>
              );
            })()
          ) : (
            <Text style={[styles.initial, { color: colors.primary }]}>
              {subscription.name.charAt(0).toUpperCase()}
            </Text>
          )}
        </View>
        <View>
          <Text style={[styles.name, { color: colors.text }]}>{subscription.name}</Text>
          <View style={styles.dateContainer}>
            <IconCalendar size={12} color={colors.subtext} />
            <Text style={[styles.date, { color: colors.subtext }]}>
              {formatDate(subscription.nextBillingDate)} ({daysUntil}d)
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.rightContent}>
        <CurrencyDisplay
          amount={subscription.price}
          currency={subscription.currency}
          style={[styles.price, { color: colors.text }]}
        />
        <Text style={[styles.cycle, { color: colors.subtext }]}>
          {(() => {
            const interval = subscription.billingInterval || 1;
            if (interval === 1) {
              switch (subscription.billingCycle) {
                case "daily": return "/day";
                case "weekly": return "/wk";
                case "monthly": return "/mo";
                case "yearly": return "/yr";
              }
            } else {
              switch (subscription.billingCycle) {
                case "daily": return `every ${interval} days`;
                case "weekly": return `every ${interval} wks`;
                case "monthly": return `every ${interval} mos`;
                case "yearly": return `every ${interval} yrs`;
              }
            }
            return "";
          })()}
        </Text>
        <TouchableOpacity
          onPress={() => onDelete(subscription.id)}
          style={styles.deleteButton}
        >
          <IconTrash size={18} color={colors.subtext} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  leftContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  initialContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#F0F4FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    overflow: "hidden",
  },
  iconImage: {
    width: "100%",
    height: "100%",
  },
  initial: {
    fontSize: 28,
    fontWeight: "700",
    color: "#4A7aff",
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  date: {
    fontSize: 12,
    color: "#999",
    marginLeft: 4,
  },
  rightContent: {
    alignItems: "flex-end",
  },
  price: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  cycle: {
    fontSize: 12,
    color: "#999",
  },
  deleteButton: {
    padding: 4,
    marginTop: 4,
  },
});

export default SubscriptionItem;
