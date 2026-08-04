import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <View style={[styles.tabBar, { backgroundColor: colors.card, paddingBottom: insets.bottom || 10 }]}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          let iconName: keyof typeof Ionicons.glyphMap = 'home';
          if (route.name === 'Home') iconName = isFocused ? 'home' : 'home-outline';
          else if (route.name === 'Subscriptions') iconName = isFocused ? 'receipt' : 'receipt-outline';
          else if (route.name === 'Budget') iconName = isFocused ? 'pie-chart' : 'pie-chart-outline';
          else if (route.name === 'Settings') iconName = isFocused ? 'settings' : 'settings-outline';

          return (
            <TouchableOpacity
              key={index}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={(options as any).tabBarTestID as any}
              onPress={onPress}
              onLongPress={onLongPress}
              style={styles.tabItem}
              activeOpacity={0.7}
            >
              <View style={styles.iconContainer}>
                {isFocused && (
                  <View
                    style={[styles.activeBackground, { backgroundColor: colors.primary }]}
                  />
                )}
                <Ionicons 
                  name={iconName} 
                  size={24} 
                  color={isFocused ? '#ffffff' : colors.subtext} 
                  style={{ zIndex: 1 }}
                />
              </View>
              <Text
                style={[
                  styles.label,
                  { color: isFocused ? colors.primary : colors.subtext },
                  isFocused && { fontWeight: '600' }
                ]}
              >
                {label as string}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  tabBar: {
    flexDirection: 'row',
    height: 70,
    borderRadius: 26,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  iconContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    width: 44,
    height: 44,
    marginBottom: 4,
  },
  activeBackground: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  label: {
    fontSize: 10,
  },
});
