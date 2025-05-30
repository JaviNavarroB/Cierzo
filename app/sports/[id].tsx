import { useState, useMemo } from "react";
import { useLocalSearchParams } from "expo-router";
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  ActivityIndicator,
  Alert,
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
import { useInscripcionEquipo } from "@/hooks/useInscripcionEquipo";

// Definimos el tipo de props que recibe el componente
interface DeportePageProps {
  route?: {
    params?: {
      id?: string | number;
    };
  };
}

export default function DeportePage({ route }: DeportePageProps) {
  /* ------------------------------------------------------------------ */
  /* 1 · OBTENER EL ID (React Navigation • expo-router • URL Web)        */
  /* ------------------------------------------------------------------ */
  const { id: searchId } = useLocalSearchParams();

  const {
    inscribir,
    loading: insLoading,
    error: insError,
  } = useInscripcionEquipo();
  const [pwModal, setPwModal] = useState(false);
  const [password, setPassword] = useState("");
  const handleInscripcion = async () => {
    try {
      await inscribir(sportId, password); // sportId == teamId
      Alert.alert("¡Inscrito!", "Ahora eres jugador del equipo");
      setPwModal(false);
      setPassword("");
    } catch {}
  };
  const sportId = useMemo(() => {
    // 1. Route params (React Navigation)
    if (route?.params?.id) return Number(route.params.id);

    // 2. URL param (expo-router)
    if (searchId) return Number(searchId);

    // 3. URL del navegador (Web)
    if (typeof window !== "undefined") {
      const pathSegments = window.location.pathname.split("/").filter(Boolean);
      const idFromPath = pathSegments[pathSegments.length - 1];
      if (idFromPath && !isNaN(Number(idFromPath))) return Number(idFromPath);
    }

    // Fallback si todo falla
    return 1;
  }, [route?.params?.id, searchId]);
  /* ------------------------------------------------------------------ */

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
    refetch: refetchPlayers, // ← nuevo
  } = usePlayers(sportId);

  // Preparar datos para SeccionHorarios
  const horario = sport?.horario || [];
  const cuotas = {
    cuota_mensual: sport?.cuota_mensual || 0,
    cuota_anual_federacion: sport?.cuota_anual_federacion || 0,
  };
  const pabellon = {
    nombre: sport?.pabellon_nombre || "",
    direccion: sport?.pabellon_direccion || "",
    descripcion: sport?.pabellon_descripcion || "",
    imagenUri:
      "https://www.walashop.com/storyblok/f/191463/768x450/9811023932/basquet-mobile.jpg", // Imagen por defecto
  };
  const texto = {
    descripcion: sport?.descripcion || "",
    cta_titulo: sport?.cta_titulo || "",
    cta_texto: sport?.cta_texto || "",
  };
  const coordenadas = {
    latitud: sport?.latitud || 0,
    longitud: sport?.longitud || 0,
  };
  const foto =
    sport?.foto ||
    "https://www.walashop.com/storyblok/f/191463/768x450/9811023932/basquet-mobile.jpg"; // Imagen por defecto
  const nombre_deporte_abv = sport?.nombre_deporte_abv || "Deporte";

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
  if (sportError || !sport) {
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

  return (
    <SafeAreaView style={styles.wholeScreen} edges={["top", "left", "right"]}>
      {/* Header principal */}
      <HeaderMenu />
      <ScrollView contentContainerStyle={styles.scrollContent} bounces={false}>
        {/* Header interno */}
        <Header title={nombre_deporte_abv} />

        {/* Contenido principal */}
        <SeccionHorarios
          horario={horario}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          cuotas={cuotas}
          pabellon={pabellon}
          texto={texto}
          foto={foto}
          teamId={sportId}
          onInscrito={refetchPlayers}
          coordenadas={coordenadas}
        />

        {/* Jugadores */}
        {!loadingPlayers && players.length > 0 && (
          <PlayersSlider players={players} />
        )}

        {/* Footer de página */}
        <Footer title={nombre_deporte_abv} />
      </ScrollView>

      {/* Footer fijo */}
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
