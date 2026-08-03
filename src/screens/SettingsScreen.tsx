import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView, Modal, TextInput, FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ChevronRight, Globe, Bell, Info, Shield, Search, X, Check, Moon, Sun, Monitor } from "lucide-react-native";
import { getSettings, saveSettings } from "../storage/storage";
import { AppSettings } from "../types/subscription";
import { useTheme } from "../context/ThemeContext";

const IconGlobe = Globe as any;
const IconBell = Bell as any;
const IconInfo = Info as any;
const IconShield = Shield as any;
const IconSearch = Search as any;
const IconX = X as any;
const IconCheck = Check as any;
const IconChevronRight = ChevronRight as any;
const IconMoon = Moon as any;
const IconSun = Sun as any;
const IconMonitor = Monitor as any;

const SettingsScreen = () => {
  const { colors, theme, setTheme, isDark } = useTheme();
  const navigation = useNavigation();
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const loadSettings = async () => {
      const storedSettings = await getSettings();
      setSettings(storedSettings);
    };
    loadSettings();
  }, []);

  const toggleNotifications = async (value: boolean) => {
    if (!settings) return;
    const updated = { ...settings, notificationsEnabled: value };
    setSettings(updated);
    await saveSettings(updated);
  };

  const selectCurrency = async (code: string) => {
    if (!settings) return;
    const updated = { ...settings, preferredCurrency: code };
    setSettings(updated);
    await saveSettings(updated);
    setShowCurrencyModal(false);
  };

  if (!settings) return null;

  const currencies = Object.keys(settings.exchangeRates).sort();
  const filteredCurrencies = currencies.filter((c) =>
    c.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const themeOptions = [
    { id: "light", label: "Light", icon: IconSun },
    { id: "dark", label: "Dark", icon: IconMoon },
    { id: "system", label: "System", icon: IconMonitor },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border, borderBottomWidth: 1 }]}>
        <Text style={[styles.title, { color: colors.text }]}>Settings</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.sectionLabel, { color: colors.subtext }]}>Appearance</Text>
        <View style={[styles.themeContainer, { backgroundColor: colors.card }]}>
          {themeOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.themeOption,
                theme === option.id && [styles.themeOptionActive, { backgroundColor: colors.surface }]
              ]}
              onPress={() => setTheme(option.id as any)}
            >
              <option.icon 
                size={20} 
                color={theme === option.id ? colors.primary : colors.subtext} 
                style={{ marginBottom: 4 }}
              />
              <Text style={[
                styles.themeLabel, 
                { color: theme === option.id ? colors.text : colors.subtext }
              ]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.sectionLabel, { color: colors.subtext, marginTop: 24 }]}>Preferences</Text>
        <TouchableOpacity style={[styles.item, { backgroundColor: colors.card }]} onPress={() => setShowCurrencyModal(true)}>
          <View style={styles.itemLeft}>
            <View style={[styles.iconBox, { backgroundColor: isDark ? colors.surface : "#F0F4FF" }]}>
              <IconGlobe size={20} color={isDark ? colors.text : "#4A7AFF"} />
            </View>
            <Text style={[styles.itemText, { color: colors.text }]}>Default Currency</Text>
          </View>
          <View style={styles.itemRight}>
            <Text style={[styles.valueText, { color: colors.subtext }]}>{settings.preferredCurrency}</Text>
            <IconChevronRight size={18} color={colors.subtext} />
          </View>
        </TouchableOpacity>

        <View style={[styles.item, { backgroundColor: colors.card }]}>
          <View style={styles.itemLeft}>
            <View style={[styles.iconBox, { backgroundColor: isDark ? colors.surface : "#FFF4EF" }]}>
              <IconBell size={20} color={isDark ? colors.text : "#FF9F43"} />
            </View>
            <Text style={[styles.itemText, { color: colors.text }]}>Notifications</Text>
          </View>
          <Switch
            value={settings.notificationsEnabled}
            onValueChange={toggleNotifications}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor="#FFF"
          />
        </View>


        <Text style={[styles.sectionLabel, { color: colors.subtext, marginTop: 32 }]}>App Info</Text>
        <TouchableOpacity style={[styles.item, { backgroundColor: colors.card }]}>
          <View style={styles.itemLeft}>
            <View style={[styles.iconBox, { backgroundColor: colors.surface }]}>
              <IconInfo size={20} color={colors.subtext} />
            </View>
            <Text style={[styles.itemText, { color: colors.text }]}>Support</Text>
          </View>
          <IconChevronRight size={18} color={colors.subtext} />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.item, { backgroundColor: colors.card }]}>
          <View style={styles.itemLeft}>
            <View style={[styles.iconBox, { backgroundColor: colors.surface }]}>
              <IconShield size={20} color={colors.subtext} />
            </View>
            <Text style={[styles.itemText, { color: colors.text }]}>Privacy Policy</Text>
          </View>
          <IconChevronRight size={18} color={colors.subtext} />
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={[styles.version, { color: colors.subtext }]}>Subbyt Version 1.0.0</Text>
        </View>
      </ScrollView>

      <Modal visible={showCurrencyModal} animationType="slide" transparent>
        <View style={styles.modalBg}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Base Currency</Text>
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
                <TouchableOpacity style={[styles.currencyItem, { borderBottomColor: colors.border }]} onPress={() => selectCurrency(item)}>
                  <Text style={[styles.currencyCode, { color: colors.text }]}>{item}</Text>
                  {settings.preferredCurrency === item && <IconCheck size={18} color={colors.primary} />}
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
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: "#FFF",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  content: {
    padding: 20,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#999",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
    marginLeft: 4,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  itemText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1A1A1A",
  },
  itemRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  valueText: {
    fontSize: 14,
    color: "#666",
    marginRight: 8,
  },
  footer: {
    marginTop: 40,
    alignItems: "center",
  },
  version: {
    fontSize: 12,
    color: "#BBB",
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
  themeContainer: {
    flexDirection: "row",
    borderRadius: 16,
    padding: 8,
    marginBottom: 4,
  },
  themeOption: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 12,
  },
  themeOptionActive: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  themeLabel: {
    fontSize: 12,
    fontWeight: "600",
  },
});

export default SettingsScreen;
