// components/Footer.tsx

import React, { useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import { COLORS } from "@/constants/theme";

interface FooterProps {
  title: string;
}

export function Footer({ title }: FooterProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{title.toUpperCase()}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#454545",
    borderBottomWidth: 1,
    borderBottomColor: "#454545",
    height: 200,
    width: "100%",
    marginTop: 64,
  },
  titleContainer: {
    transform: [{ rotate: "180deg" }],
  },
  title: {
    fontFamily: "GT-America-Compressed-Black-Trial.otf",
    fontSize: 90,
    fontWeight: "900",
    textAlign: "center",
    letterSpacing: -2,
    color: COLORS.background,
    marginTop: 90,
  },
});
