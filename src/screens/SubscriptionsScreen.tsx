import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Search, Plus, Filter } from "lucide-react-native";
import { getSubscriptions, saveSubscriptions } from "../storage/storage";
import { Subscription } from "../types/subscription";
import SubscriptionItem from "../components/SubscriptionItem";
import { useTheme } from "../context/ThemeContext";

const IconPlus = Plus as any;
const IconSearch = Search as any;
const IconFilter = Filter as any;

import { cancelSubscriptionReminders } from "../utils/notifications";

const SubscriptionsScreen = () => {
  const { colors } = useTheme();
  const navigation = useNavigation<any>();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const loadSubscriptions = useCallback(async () => {
    const storedSubs = await getSubscriptions();
    setSubscriptions(storedSubs.sort((a, b) => a.name.localeCompare(b.name)));
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadSubscriptions();
    }, [loadSubscriptions])
  );

  const handleDelete = async (id: string) => {
    const updatedSubs = subscriptions.filter((s) => s.id !== id);
    setSubscriptions(updatedSubs);
    await saveSubscriptions(updatedSubs);
    await cancelSubscriptionReminders(id);
  };

  const filteredSubscriptions = subscriptions.filter((sub) =>
    sub.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>All Subscriptions</Text>
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: colors.primary }]}
          onPress={() => navigation.navigate("AddSubscription")}
        >
          <IconPlus color="#FFF" size={20} />
        </TouchableOpacity>
      </View>

      <View style={[styles.searchContainer, { backgroundColor: colors.surface }]}>
        <IconSearch size={20} color={colors.subtext} style={styles.searchIcon} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Search subscriptions..."
          placeholderTextColor={colors.subtext}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <FlatList
        data={filteredSubscriptions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SubscriptionItem
            subscription={item}
            onDelete={handleDelete}
            onPress={(sub) => navigation.navigate("AddSubscription", { subscription: sub })}
          />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: colors.subtext }]}>
              {searchQuery ? "No subscriptions found" : "No subscriptions added yet"}
            </Text>
          </View>
        }
      />
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
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#1A1A1A",
    justifyContent: "center",
    alignItems: "center",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    marginHorizontal: 20,
    paddingHorizontal: 12,
    borderRadius: 12,
    height: 48,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#1A1A1A",
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  emptyContainer: {
    padding: 40,
    alignItems: "center",
  },
  emptyText: {
    color: "#999",
    fontSize: 16,
  },
});

export default SubscriptionsScreen;
