import React, { useState } from "react";
import { StyleSheet, View, Text } from "react-native";

import { useFonts } from "expo-font";
import { COLORS } from "@/constants/theme";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>BASKET</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.primary,
    height: 110, // Adjusted height for mobile
    width: "100%",
    marginTop: 55,
  },
  title: {
    fontFamily: "GT-America-Compressed-Black-Trial.otf",
    fontSize: 90, // Reduced font size for mobile
    fontWeight: "900",
    textAlign: "center",
    letterSpacing: -2, // Adjusted letter spacing
    color: COLORS.text.light,
  },
});
