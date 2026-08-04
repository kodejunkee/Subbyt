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
  { name: "Netflix", icon: BrandIcon("netflix"), color: "#E50914" },
  { name: "Spotify", icon: BrandIcon("spotify"), color: "#1DB954" },
  { name: "Amazon", icon: FABrandIcon("amazon"), color: "#FF9900" },
  { name: "Apple", icon: BrandIcon("apple"), color: "#A2AAAD" },
  { name: "YouTube", icon: BrandIcon("youtube"), color: "#FF0000" },
  { name: "Twitch", icon: BrandIcon("twitch"), color: "#9146FF" },
  { name: "Hulu", icon: BrandIcon("hulu"), color: "#1CE783" },
  { name: "Patreon", icon: BrandIcon("patreon"), color: "#FF424D" },
  { name: "Google", icon: BrandIcon("google"), color: "#4285F4" },
  { name: "PlayStation", icon: FABrandIcon("playstation"), color: "#003791" },
  { name: "Xbox", icon: FABrandIcon("xbox"), color: "#107C10" },
  { name: "Discord", icon: FABrandIcon("discord"), color: "#5865F2" },
  { name: "Slack", icon: BrandIcon("slack"), color: "#4A154B" },
  { name: "GitHub", icon: BrandIcon("github"), color: "#6e5494" },
  { name: "Microsoft", icon: BrandIcon("microsoft"), color: "#00A4EF" },
  { name: "Reddit", icon: BrandIcon("reddit"), color: "#FF4500" },
  { name: "Twitter", icon: BrandIcon("twitter"), color: "#1DA1F2" },
  { name: "Instagram", icon: BrandIcon("instagram"), color: "#E1306C" },
  { name: "LinkedIn", icon: BrandIcon("linkedin"), color: "#0077B5" },
  { name: "WhatsApp", icon: BrandIcon("whatsapp"), color: "#25D366" },
  { name: "Telegram", icon: FABrandIcon("telegram"), color: "#0088cc" },
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

export const ICON_COLOR_MAP = ICON_LIST.reduce((acc, curr) => {
  if (curr.color) acc[curr.name] = curr.color;
  return acc;
}, {} as Record<string, string>);
