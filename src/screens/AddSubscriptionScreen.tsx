import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Switch,
  Image,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
import { 
  ChevronDown, Calendar, X, Search, Check, 
  Image as ImageIcon, Camera
} from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";
import { getSettings, saveSubscriptions, getSubscriptions } from "../storage/storage";
import { Subscription, BillingCycle } from "../types/subscription";
import { useTheme } from "../context/ThemeContext";
import { scheduleSubscriptionReminders } from "../utils/notifications";
import { ICON_LIST } from "../utils/icons";
import { getCurrencySearchTerms, getCurrencyName } from "../utils/currencies";

const IconX = X as any;
const IconCalendar = Calendar as any;
const IconChevronDown = ChevronDown as any;
const IconSearch = Search as any;
const IconCheck = Check as any;
const IconImage = ImageIcon as any;
const IconCamera = Camera as any;

const AddSubscriptionScreen = () => {
  const { colors, isDark } = useTheme();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const editingSub = route.params?.subscription as Subscription | undefined;

  const [name, setName] = useState(editingSub?.name || "");
  const [price, setPrice] = useState(editingSub?.price.toString() || "");
  const [currency, setCurrency] = useState(editingSub?.currency || "USD");
  const [billingCycle, setBillingCycle] = useState<BillingCycle>(editingSub?.billingCycle || "monthly");
  const [billingInterval, setBillingInterval] = useState(editingSub?.billingInterval?.toString() || "1");
  const [autoRenew, setAutoRenew] = useState(editingSub?.autoRenew ?? true);
  const [date, setDate] = useState(editingSub ? new Date(editingSub.nextBillingDate) : new Date());
  const [selectedIcon, setSelectedIcon] = useState<string | undefined>(editingSub?.icon);
  const [customImage, setCustomImage] = useState<string | undefined>(editingSub?.customImage);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);
  const [showIconModal, setShowIconModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [iconSearchQuery, setIconSearchQuery] = useState("");
  const [availableCurrencies, setAvailableCurrencies] = useState<string[]>([]);
  const [nameError, setNameError] = useState("");
  const [priceError, setPriceError] = useState("");

  useEffect(() => {
    const loadSettings = async () => {
      const settings = await getSettings();
      const codes = Object.keys(settings.exchangeRates).sort();
      setAvailableCurrencies(codes);
      if (!editingSub) setCurrency(settings.preferredCurrency);
    };
    loadSettings();
  }, [editingSub]);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setCustomImage(result.assets[0].uri);
      setSelectedIcon(undefined);
      setShowIconModal(false);
    }
  };

  const handleSave = async () => {
    let hasError = false;
    if (!name) {
      setNameError("Please enter a name");
      hasError = true;
    }
    if (!price || isNaN(parseFloat(price))) {
      setPriceError("Please enter a valid price");
      hasError = true;
    }
    if (hasError) return;

    const subscriptions = await getSubscriptions();
    const newSub: Subscription = {
      id: editingSub?.id || Math.random().toString(36).substr(2, 9),
      name,
      price: parseFloat(price),
      currency,
      billingCycle,
      billingInterval: parseInt(billingInterval) || 1,
      nextBillingDate: date.toISOString(),
      autoRenew,
      icon: selectedIcon,
      customImage,
    };

    let updatedSubs;
    if (editingSub) {
      updatedSubs = subscriptions.map((s) => (s.id === editingSub.id ? newSub : s));
    } else {
      updatedSubs = [...subscriptions, newSub];
    }

    await saveSubscriptions(updatedSubs);
    await scheduleSubscriptionReminders(newSub);
    navigation.goBack();
  };

  const filteredCurrencies = availableCurrencies.filter((c) =>
    getCurrencySearchTerms(c).includes(searchQuery.toLowerCase())
  );

  const filteredIcons = ICON_LIST.filter(item => 
    item.name.toLowerCase().includes(iconSearchQuery.toLowerCase())
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
          <IconX size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>{editingSub ? "Edit" : "Add"} Subscription</Text>
        <TouchableOpacity onPress={handleSave} style={styles.headerBtn}>
          <Text style={[styles.saveText, { color: colors.primary }]}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.form}>
        <View style={styles.iconSelectionArea}>
          <TouchableOpacity 
            style={[styles.mainIconContainer, { backgroundColor: "transparent" }]}
            onPress={() => setShowIconModal(true)}
          >
            {customImage ? (
              <View style={styles.imagePreviewContainer}>
                <Image source={{ uri: customImage }} style={styles.previewImage} />
                <View style={styles.editBadge}>
                  <IconCamera size={12} color="#FFF" />
                </View>
              </View>
            ) : selectedIcon ? (
              <View style={styles.iconPreviewContainer}>
                {(() => {
                  const item = ICON_LIST.find(i => i.name === selectedIcon);
                  const IconComp = item?.icon as any;
                  const iconColor = item?.color || colors.primary;
                  return IconComp ? <IconComp size={96} color={iconColor} /> : <Text style={[styles.initialLarge, { color: colors.primary }]}>{name.charAt(0).toUpperCase() || "S"}</Text>;
                })()}
                <View style={[styles.editBadge, { backgroundColor: colors.primary }]}>
                  <IconCamera size={12} color="#FFF" />
                </View>
              </View>
            ) : (
              <View style={styles.iconPreviewContainer}>
                <Text style={[styles.initialLarge, { color: colors.primary }]}>{name.charAt(0).toUpperCase() || "S"}</Text>
                <View style={[styles.editBadge, { backgroundColor: colors.primary }]}>
                  <IconCamera size={12} color="#FFF" />
                </View>
              </View>
            )}
          </TouchableOpacity>
          <Text style={[styles.iconHint, { color: colors.subtext }]}>Tap to change icon or upload logo</Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.subtext }]}>Name</Text>
          <TextInput
            style={[
              styles.input, 
              { backgroundColor: colors.surface, color: colors.text },
              nameError ? { borderWidth: 1, borderColor: colors.error } : null
            ]}
            placeholder="Netflix, Spotify, etc."
            placeholderTextColor={colors.subtext}
            value={name}
            onChangeText={(text) => {
              setName(text);
              if (nameError) setNameError("");
            }}
          />
          {nameError ? <Text style={[styles.errorText, { color: colors.error }]}>{nameError}</Text> : null}
        </View>

        <View style={styles.row}>
          <View style={[styles.inputGroup, { flex: 2, marginRight: 12 }]}>
            <Text style={[styles.label, { color: colors.subtext }]}>Price</Text>
            <TextInput
              style={[
                styles.input, 
                { backgroundColor: colors.surface, color: colors.text },
                priceError ? { borderWidth: 1, borderColor: colors.error } : null
              ]}
              placeholder="0.00"
              placeholderTextColor={colors.subtext}
              value={price}
              onChangeText={(text) => {
                setPrice(text);
                if (priceError) setPriceError("");
              }}
              keyboardType="decimal-pad"
            />
            {priceError ? <Text style={[styles.errorText, { color: colors.error }]}>{priceError}</Text> : null}
          </View>
          <View style={[styles.inputGroup, { flex: 1 }]}>
            <Text style={[styles.label, { color: colors.subtext }]}>Currency</Text>
            <TouchableOpacity
              style={[styles.selector, { backgroundColor: colors.surface }]}
              onPress={() => setShowCurrencyModal(true)}
            >
              <Text style={[styles.selectorText, { color: colors.text }]}>{currency}</Text>
              <IconChevronDown size={16} color={colors.subtext} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.subtext }]}>Billing Cycle</Text>
          <View style={[styles.cycleContainer, { backgroundColor: colors.surface }]}>
            {(["daily", "weekly", "monthly", "yearly"] as BillingCycle[]).map((cycle) => (
              <TouchableOpacity
                key={cycle}
                style={[
                  styles.cycleButton, 
                  billingCycle === cycle && [styles.cycleActive, { backgroundColor: isDark ? colors.background : "#FFF" }]
                ]}
                onPress={() => setBillingCycle(cycle)}
              >
                <Text style={[
                  styles.cycleText, 
                  { color: colors.subtext },
                  billingCycle === cycle && { color: colors.text }
                ]}>
                  {cycle.charAt(0).toUpperCase() + cycle.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.row}>
          <View style={[styles.inputGroup, { flex: 1, marginRight: 12 }]}>
            <Text style={[styles.label, { color: colors.subtext }]}>Every X {billingCycle === "daily" ? "Days" : billingCycle === "weekly" ? "Weeks" : billingCycle === "monthly" ? "Months" : "Years"}</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.surface, color: colors.text }]}
              placeholder="1"
              placeholderTextColor={colors.subtext}
              value={billingInterval}
              onChangeText={setBillingInterval}
              keyboardType="number-pad"
            />
          </View>
          <View style={[styles.inputGroup, { flex: 1, justifyContent: "center" }]}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 24 }}>
              <Text style={[styles.label, { color: colors.subtext, marginBottom: 0 }]}>Auto-Renew</Text>
              <Switch
                value={autoRenew}
                onValueChange={setAutoRenew}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor="#FFF"
              />
            </View>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.subtext }]}>Next Billing Date</Text>
          <TouchableOpacity
            style={[styles.selector, { backgroundColor: colors.surface }]}
            onPress={() => setShowDatePicker(true)}
          >
            <IconCalendar size={18} color={colors.subtext} style={{ marginRight: 8 }} />
            <Text style={[styles.selectorText, { color: colors.text }]}>{date.toLocaleDateString()}</Text>
          </TouchableOpacity>
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onValueChange={(event: any, selectedDate?: Date) => {
              if (selectedDate) setDate(selectedDate);
              if (Platform.OS === "android") setShowDatePicker(false);
            }}
            onDismiss={() => setShowDatePicker(false)}
          />
        )}
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
              <Text style={[styles.modalTitle, { color: colors.text }]}>Select Currency</Text>
              <TouchableOpacity onPress={() => setShowCurrencyModal(false)}>
                <IconX size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            <View style={[styles.searchBar, { backgroundColor: colors.background, marginBottom: 16 }]}>
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
                    setCurrency(item);
                    setShowCurrencyModal(false);
                  }}
                >
                  <Text style={[styles.currencyCode, { color: colors.text }]}>
                    {item} - {getCurrencyName(item)}
                  </Text>
                  {currency === item && <IconCheck size={18} color={colors.primary} />}
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      <Modal visible={showIconModal} animationType="slide" transparent>
        <View style={styles.modalBg}>
          <TouchableOpacity 
            style={StyleSheet.absoluteFill} 
            activeOpacity={1} 
            onPress={() => {
              setShowIconModal(false);
              setIconSearchQuery("");
            }} 
          />
          <View style={[styles.modalContent, { backgroundColor: colors.surface, height: "60%" }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Choose Icon</Text>
              <TouchableOpacity onPress={() => {
                setShowIconModal(false);
                setIconSearchQuery("");
              }}>
                <IconX size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.searchAndUploadRow}>
              <View style={[styles.searchBar, { flex: 1, backgroundColor: colors.background, marginRight: 12 }]}>
                <IconSearch size={18} color={colors.subtext} style={{ marginRight: 8 }} />
                <TextInput
                  placeholder="Search icons..."
                  placeholderTextColor={colors.subtext}
                  style={[styles.searchInput, { color: colors.text }]}
                  value={iconSearchQuery}
                  onChangeText={setIconSearchQuery}
                />
              </View>
              <TouchableOpacity 
                style={[styles.iconOnlyPickerBtn, { borderColor: colors.border }]}
                onPress={pickImage}
              >
                <IconImage size={24} color={colors.primary} />
              </TouchableOpacity>
            </View>

            <FlatList
              data={filteredIcons}
              numColumns={4}
              keyExtractor={(item) => item.name}
              columnWrapperStyle={styles.iconGridRow}
              renderItem={({ item }) => {
                const IconComp = item.icon as any;
                return (
                  <TouchableOpacity
                    style={[
                      styles.iconGridItem,
                      selectedIcon === item.name && { backgroundColor: isDark ? colors.background : "#F0F4FF", borderColor: colors.primary }
                    ]}
                    onPress={() => {
                      setSelectedIcon(item.name);
                      setCustomImage(undefined);
                      setShowIconModal(false);
                      setIconSearchQuery("");
                    }}
                  >
                    <IconComp size={24} color={item.color || (selectedIcon === item.name ? colors.primary : colors.subtext)} />
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
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
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
  },
  saveText: {
    fontSize: 16,
    fontWeight: "600",
  },
  headerBtn: {
    padding: 4,
  },
  form: {
    padding: 20,
  },
  iconSelectionArea: {
    alignItems: "center",
    marginBottom: 32,
    marginTop: 8,
  },
  mainIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  imagePreviewContainer: {
    width: "100%",
    height: "100%",
    borderRadius: 50,
    overflow: "hidden",
  },
  previewImage: {
    width: "100%",
    height: "100%",
  },
  iconPreviewContainer: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
  },
  initialLarge: {
    fontSize: 64,
    fontWeight: "700",
    color: "#4A7aff",
  },
  editBadge: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 3,
    borderColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
  },
  iconHint: {
    fontSize: 12,
    fontWeight: "500",
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    fontWeight: "500",
  },
  input: {
    borderRadius: 12,
    height: 52,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  selector: {
    borderRadius: 12,
    height: 52,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  selectorText: {
    fontSize: 16,
  },
  cycleContainer: {
    flexDirection: "row",
    borderRadius: 12,
    padding: 4,
  },
  cycleButton: {
    flex: 1,
    height: 44,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  cycleActive: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cycleText: {
    fontSize: 14,
    fontWeight: "600",
  },
  modalBg: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
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
  searchAndUploadRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
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
  },
  currencyCode: {
    fontSize: 16,
    fontWeight: "500",
  },
  iconOnlyPickerBtn: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderStyle: "dashed",
  },
  iconGridRow: {
    justifyContent: "space-between",
    marginBottom: 16,
  },
  iconGridItem: {
    width: "22%",
    aspectRatio: 1,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
});

export default AddSubscriptionScreen;
