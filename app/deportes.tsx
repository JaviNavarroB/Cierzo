"use client";

import { useState, useEffect } from "react";
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import SeccionHorarios from "@/components/SeccionHorarios";
import { FooterMenu } from "@/components/FooterMenu";
import { HeaderMenu } from "@/components/HeaderMenu";
import { PlayersSlider } from "@/components/PlayersSlider";
import { COLORS } from "@/constants/theme";
import { useSport } from "@/hooks/useSport";
import { usePlayers } from "@/hooks/usePlayers";

// Definimos el tipo de props que recibe el componente
interface DeportePageProps {
  route?: {
    params?: {
      id?: string | number;
    };
  };
}

export default function DeportePage({ route }: DeportePageProps) {
  // Obtener el ID del deporte de las props de navegación o de la URL
  const [sportId, setSportId] = useState<number>(0);

  useEffect(() => {
    // Intentar obtener el ID de diferentes fuentes
    const getId = () => {
      // 1. Intentar obtener de route.params (React Navigation)
      if (route?.params?.id) {
        return Number(route.params.id);
      }

      // 2. Intentar obtener de la URL (para entornos web)
      if (typeof window !== "undefined") {
        const pathSegments = window.location.pathname.split("/");
        const idFromPath = pathSegments[pathSegments.length - 1];
        if (idFromPath && !isNaN(Number(idFromPath))) {
          return Number(idFromPath);
        }
      }

      // Valor por defecto si no se encuentra
      return 1;
    };

    setSportId(getId());
  }, [route]);

  // Estado para la pestaña activa en SeccionHorarios
  const [activeTab, setActiveTab] = useState<"horario" | "cuotas" | "pabellon">(
    "horario"
  );

  // Obtener datos del deporte
  const { sport, loading: loadingSport, error: sportError } = useSport(sportId);

  // Obtener jugadores
  const {
    players,
    loading: loadingPlayers,
    error: playersError,
  } = usePlayers(sportId);

  // Preparar datos para SeccionHorarios
  const horario = sport?.horario || [];
  const cuotas = {
    mensual: sport?.cuota_mensual || 0,
    anual: sport?.cuota_anual_federacion || 0,
  };
  const pabellon = {
    nombre: sport?.pabellon_nombre || "",
    direccion: sport?.pabellon_direccion || "",
    descripcion: sport?.pabellon_descripcion || "",
    imagenUri:
      "https://www.walashop.com/storyblok/f/191463/768x450/9811023932/basquet-mobile.jpg", // Imagen por defecto
  };

  // Mostrar pantalla de carga mientras se obtienen los datos
  if (loadingSport) {
    return (
      <SafeAreaView style={styles.wholeScreen} edges={["top", "left", "right"]}>
        <HeaderMenu />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Cargando información...</Text>
        </View>
        <FooterMenu style={styles.footerMenu} />
      </SafeAreaView>
    );
  }

  // Mostrar mensaje de error si hay algún problema
  /*if (sportError || !sport) {
    return (
      <SafeAreaView style={styles.wholeScreen} edges={["top", "left", "right"]}>
        <HeaderMenu />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            No se pudo cargar la información del deporte
          </Text>
        </View>
        <FooterMenu style={styles.footerMenu} />
      </SafeAreaView>
    );
  }
*/
  return (
    <SafeAreaView style={styles.wholeScreen} edges={["top", "left", "right"]}>
      {/* Header */}
      <HeaderMenu />
      <ScrollView contentContainerStyle={styles.scrollContent} bounces={false}>
        {/* Header */}
        <Header title="basket" />

        {/* Main content */}
        <SeccionHorarios
          horario={horario}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          cuotas={cuotas}
          pabellon={pabellon}
        />

        {/* Players section - solo se muestra si hay jugadores */}
        {!loadingPlayers && players.length > 0 && (
          <PlayersSlider players={players} />
        )}

        {/* Footer */}
        <Footer title="basket" />
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
    marginTop: 0,
  },
  footerMenu: {
    position: "absolute",
    left: 0,
    right: 0,
    marginTop: -40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 18,
    color: COLORS.primary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: COLORS.primary,
    textAlign: "center",
  },
});
