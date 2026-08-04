import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { X } from "lucide-react-native";
import { useTheme } from "../context/ThemeContext";

const PrivacyPolicyScreen = () => {
  const { colors } = useTheme();
  const navigation = useNavigation();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border, borderBottomWidth: 1 }]}>
        <Text style={[styles.title, { color: colors.text }]}>Privacy Policy</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
          <X size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.heading, { color: colors.text }]}>1. Introduction</Text>
        <Text style={[styles.paragraph, { color: colors.subtext }]}>
          Welcome to Subbyt. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you use our application.
        </Text>

        <Text style={[styles.heading, { color: colors.text }]}>2. Data Collection</Text>
        <Text style={[styles.paragraph, { color: colors.subtext }]}>
          Subbyt primarily stores data locally on your device. This includes your subscription details, preferences, and custom icons. We do not transmit this data to external servers unless explicitly backed up by you using standard OS backup mechanisms.
        </Text>

        <Text style={[styles.heading, { color: colors.text }]}>3. Use of Data</Text>
        <Text style={[styles.paragraph, { color: colors.subtext }]}>
          The data stored locally is used solely to provide you with the app's core functionality: tracking and managing your subscriptions, calculating budgets, and providing notifications for upcoming bills.
        </Text>

        <Text style={[styles.heading, { color: colors.text }]}>4. Third-Party Services</Text>
        <Text style={[styles.paragraph, { color: colors.subtext }]}>
          Our app may fetch real-time exchange rates to handle multiple currencies. No personal information is sent during these requests. We use standard push notification services provided by your device's operating system to deliver timely alerts.
        </Text>

        <Text style={[styles.heading, { color: colors.text }]}>5. Changes to the Policy</Text>
        <Text style={[styles.paragraph, { color: colors.subtext }]}>
          We may update this policy from time to time. Any changes will be reflected in this screen.
        </Text>
        
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.subtext }]}>Last updated: August 2026</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  },
  closeButton: {
    padding: 4,
  },
  content: {
    padding: 24,
    paddingBottom: 60,
  },
  heading: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
    marginTop: 24,
  },
  paragraph: {
    fontSize: 15,
    lineHeight: 22,
  },
  footer: {
    marginTop: 40,
    alignItems: "center",
  },
  footerText: {
    fontSize: 12,
  },
});

export default PrivacyPolicyScreen;
