// components/Header.tsx

import React, { useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import { COLORS } from "@/constants/theme";

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title.toUpperCase()}</Text>
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
    height: 110,
    width: "100%",
    marginTop: 0,
  },
  title: {
    fontFamily: "GT-America-Compressed-Black-Trial.otf",
    fontSize: 90,
    fontWeight: "900",
    textAlign: "center",
    letterSpacing: -2,
    color: COLORS.text.light,
  },
});
