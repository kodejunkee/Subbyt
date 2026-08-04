import React from "react";
import { MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
import { 
  ShoppingCart, CreditCard, Gamepad2, 
  Zap, Droplets, Flame, Smartphone, Wifi, 
  Tv, Coffee, Dumbbell, GraduationCap, Heart, 
  Scissors, Car, Home, Plane, Shield, 
  Briefcase, Mail, Music, Film
} from "lucide-react-native";

export const BrandIcon = (name: any) => (props: any) => <MaterialCommunityIcons name={name} {...props} />;
export const FABrandIcon = (name: any) => (props: any) => <FontAwesome5 name={name} {...props} />;

export const ICON_LIST = [
  { name: "Netflix", icon: BrandIcon("netflix") },
  { name: "Spotify", icon: BrandIcon("spotify") },
  { name: "Amazon", icon: FABrandIcon("amazon") },
  { name: "Apple", icon: BrandIcon("apple") },
  { name: "YouTube", icon: BrandIcon("youtube") },
  { name: "Twitch", icon: BrandIcon("twitch") },
  { name: "Hulu", icon: BrandIcon("hulu") },
  { name: "Patreon", icon: BrandIcon("patreon") },
  { name: "Google", icon: BrandIcon("google") },
  { name: "PlayStation", icon: FABrandIcon("playstation") },
  { name: "Xbox", icon: FABrandIcon("xbox") },
  { name: "Discord", icon: FABrandIcon("discord") },
  { name: "Slack", icon: BrandIcon("slack") },
  { name: "GitHub", icon: BrandIcon("github") },
  { name: "Microsoft", icon: BrandIcon("microsoft") },
  { name: "Reddit", icon: BrandIcon("reddit") },
  { name: "Twitter", icon: BrandIcon("twitter") },
  { name: "Instagram", icon: BrandIcon("instagram") },
  { name: "LinkedIn", icon: BrandIcon("linkedin") },
  { name: "WhatsApp", icon: BrandIcon("whatsapp") },
  { name: "Telegram", icon: FABrandIcon("telegram") },
  { name: "Music", icon: Music },
  { name: "Film", icon: Film },
  { name: "Shopping", icon: ShoppingCart },
  { name: "Card", icon: CreditCard },
  { name: "Gaming", icon: Gamepad2 },
  { name: "Energy", icon: Zap },
  { name: "Water", icon: Droplets },
  { name: "Gas", icon: Flame },
  { name: "Mobile", icon: Smartphone },
  { name: "Wifi", icon: Wifi },
  { name: "TV", icon: Tv },
  { name: "Coffee", icon: Coffee },
  { name: "Dumbbell", icon: Dumbbell },
  { name: "Education", icon: GraduationCap },
  { name: "Health", icon: Heart },
  { name: "Beauty", icon: Scissors },
  { name: "Car", icon: Car },
  { name: "Home", icon: Home },
  { name: "Travel", icon: Plane },
  { name: "Security", icon: Shield },
  { name: "Work", icon: Briefcase },
  { name: "Mail", icon: Mail },
];

export const ICON_MAP = ICON_LIST.reduce((acc, curr) => {
  acc[curr.name] = curr.icon;
  return acc;
}, {} as Record<string, any>);
