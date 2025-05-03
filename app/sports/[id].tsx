// app/sports/[id].tsx

import React, { useRef, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  Animated,
  StatusBar,
  StyleSheet,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { ActivityIndicator as RNActivityIndicator } from "react-native";
import { Header } from "@/components/Header";
import { HeaderMenu } from "@/components/HeaderMenu";
import { Footer } from "@/components/Footer";
import { FooterMenu } from "@/components/FooterMenu";
import SeccionHorarios, {
  HorarioItem,
  PabellonInfo,
  CuotasInfo,
} from "@/components/SeccionHorarios";
import { PlayersSlider } from "@/components/PlayersSlider";
import { useSport, SportData } from "@/hooks/useSport";
import { usePlayers, Player } from "@/hooks/usePlayers";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { COLORS } from "@/constants/theme";

export default function SportScreen() {
  // 1) get the id param
  const params = useLocalSearchParams();
  const sportId = params.id ? parseInt(params.id as string, 10) : 0;

  // 2) fetch data
  const { sport, loading, error } = useSport(sportId);
  const { players, loading: playersLoading } = usePlayers(sportId);

  // 3) local UI state
  const [activeTab, setActiveTab] = useState<"horario" | "cuotas" | "pabellon">(
    "horario"
  );
  const scrollY = useRef(new Animated.Value(0)).current;

  if (loading) {
    return (
      <SafeAreaView style={styles.centered}>
        <RNActivityIndicator size="large" color={COLORS.primary} />
      </SafeAreaView>
    );
  }
  if (error || !sport) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text style={{ color: "red" }}>
          {error ? error.message : "Deporte no encontrado."}
        </Text>
      </SafeAreaView>
    );
  }

  // destructure for convenience
  const {
    descripcion: bienvenida,
    horario,
    cuota_mensual,
    cuota_anual_federacion,
    pabellon_nombre,
    pabellon_direccion,
    pabellon_descripcion,
    cta_titulo,
    cta_texto,
  } = sport as SportData;

  // animated header opacity
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  const handleJoin = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // TODO: navigation to registration
  };

  return (
    <SafeAreaView style={styles.whole}>
      <StatusBar barStyle="light-content" />
      <Animated.View
        style={[styles.animatedHeader, { opacity: headerOpacity }]}
      >
        <HeaderMenu />
      </Animated.View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        bounces={false}
      >
        <Header />

        {/* Bienvenida */}
        <Text style={styles.bienvenida}>{bienvenida}</Text>

        {/* Horarios / Cuotas / Pabellón */}
        <SeccionHorarios
          horario={horario as HorarioItem[]}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          cuotas={
            {
              mensual: cuota_mensual,
              anual: cuota_anual_federacion,
            } as CuotasInfo
          }
          pabellon={
            {
              nombre: pabellon_nombre,
              direccion: pabellon_direccion,
              descripcion: pabellon_descripcion,
            } as PabellonInfo
          }
        />

        {/* Jugadores */}
        {playersLoading ? (
          <RNActivityIndicator size="small" color={COLORS.primary} />
        ) : (
          <PlayersSlider players={players as Player[]} />
        )}

        {/* CTA */}
        <LinearGradient
          colors={[COLORS.primary, COLORS.background]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.ctaContainer}
        >
          <Text style={styles.ctaTitle}>{cta_titulo}</Text>
          <Text style={styles.ctaText}>{cta_texto}</Text>
          <TouchableOpacity style={styles.ctaButton} onPress={handleJoin}>
            <Text style={styles.ctaButtonLabel}>Únete</Text>
          </TouchableOpacity>
        </LinearGradient>

        <Footer />
      </ScrollView>

      <FooterMenu style={styles.footerMenu} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  whole: { flex: 1, backgroundColor: COLORS.background },
  animatedHeader: {
    position: "absolute",
    width: "100%",
    zIndex: 10,
  },
  scrollContent: { paddingBottom: 80 },
  bienvenida: {
    fontSize: 18,
    color: COLORS.primary,
    textAlign: "center",
    margin: 16,
  },
  ctaContainer: {
    margin: 16,
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  ctaTitle: {
    color: COLORS.text.light,
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 8,
  },
  ctaText: {
    color: COLORS.text.light,
    fontSize: 16,
    textAlign: "center",
    marginBottom: 16,
  },
  ctaButton: {
    backgroundColor: COLORS.text.light,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 30,
  },
  ctaButtonLabel: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: "600",
  },
  footerMenu: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
  },
});
