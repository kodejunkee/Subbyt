import React from "react";
import { Text, TextStyle, StyleProp } from "react-native";
import { formatCurrency } from "../utils/currencyConverter";

interface Props {
  amount: number;
  currency: string;
  style?: StyleProp<TextStyle>;
}

const CurrencyDisplay: React.FC<Props> = ({ amount, currency, style }) => {
  return (
    <Text style={style} numberOfLines={1}>
      {formatCurrency(amount, currency)}
    </Text>
  );
};

export default CurrencyDisplay;
