import React from "react";
import { StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import SeccionHorarios from "@/components/SeccionHorarios";
import { FooterMenu } from "@/components/FooterMenu";
import { HeaderMenu } from "@/components/HeaderMenu";
import { PlayersSlider } from "@/components/PlayersSlider";
import Mapa from "@/components/Mapa";
import { COLORS } from "@/constants/theme";

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.wholeScreen} edges={["top", "left", "right"]}>
      {/* Header */}
      <HeaderMenu />
      <ScrollView contentContainerStyle={styles.scrollContent} bounces={false}>
        {/* Header */}

        <Header />

        {/* Main content */}
        <SeccionHorarios />

        <PlayersSlider />

        {/* Footer */}
        <Footer />
      </ScrollView>

      {/* Fixed Footer Menu */}
      <FooterMenu style={styles.footerMenu} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wholeScreen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    marginTop: 45,
  },
  footerMenu: {
    position: "absolute",
    left: 0,
    right: 0,
    marginTop: -40,
  },
});
