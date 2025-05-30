import {
  StyleSheet,
  View,
  ScrollView,
  Image,
  Text,
  Platform,
  useWindowDimensions,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome } from "@expo/vector-icons";
import { COLORS } from "@/constants/theme";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { useAuthExported } from "@/contexts/AuthContext";
import { useInscripcionEquipo } from "@/hooks/useInscripcionEquipo";
import { useState } from "react";
import { Image as ExpoImage } from "expo-image";
import React, { useEffect } from "react";
import { CrossPlatformMap } from "@/components/CrossPlatformMap";

export interface HorarioItem {
  dia: string;
  hora?: string;
}

export interface PabellonInfo {
  nombre: string;
  direccion: string;
  descripcion: string;
  imagenUri?: string;
  latitud?: number;
  longitud?: number;
}

export interface CuotasInfo {
  cuota_mensual: number;
  cuota_anual_federacion: number;
}
export interface Texto {
  descripcion: string;
  cta_titulo: string;
  cta_texto: string;
}

interface Props {
  horario: HorarioItem[];
  activeTab: "horario" | "cuotas" | "pabellon";
  onTabChange: (tab: "horario" | "cuotas" | "pabellon") => void;
  cuotas: CuotasInfo;
  pabellon: PabellonInfo;
  texto: Texto;
  foto: string;
  teamId: number;
  onInscrito?: () => void;
  coordenadas: {
    latitud: number;
    longitud: number;
  };
}

export default function SeccionHorarios({
  horario,
  activeTab,
  onTabChange,
  cuotas,
  pabellon,
  texto,
  foto,
  teamId,
  onInscrito,
  coordenadas,
}: Props) {
  const { width } = useWindowDimensions();
  const isMobile = Platform.OS !== "web" || width < 768;

  const { user } = useAuthExported();
  const isJugador = user?.rol === "jugador";
  const { inscribir, loading, error } = useInscripcionEquipo();

  /* estado modal */
  const [modal, setModal] = useState(false);
  const [password, setPassword] = useState("");
  const handleJoin = async () => {
    try {
      await inscribir(teamId /* ó props.teamId */, password);
      onInscrito?.();
      Alert.alert("¡¡Inscrito!!", "Ahora eres jugador del equipo");
      setModal(false);
      setPassword("");
    } catch {}
  };

  const renderContent = () => {
    switch (activeTab) {
      case "pabellon":
        return (
          <View style={styles.pabellonContainer}>
            <View style={styles.pabellonInfo}>
              <Text style={styles.pabellonTitle}>{pabellon.nombre}</Text>
              <Text style={styles.pabellonAddress}>{pabellon.direccion}</Text>
              <Text style={styles.pabellonDescription}>
                {pabellon.descripcion}
              </Text>
            </View>
            <View style={styles.pabellonImageContainer}>
              <CrossPlatformMap
                lat={coordenadas.latitud}
                lng={coordenadas.longitud}
                zoom={14}
                style={styles.pabellonMap}
              />
            </View>
          </View>
        );
      case "cuotas":
        return (
          <View style={styles.cuotasContainer}>
            <View style={styles.cuotasContent}>
              {/* Left Column - Actividad */}
              <View style={styles.cuotasColumn}>
                <Text style={styles.priceNumber}>{cuotas.cuota_mensual}</Text>
                <Text style={styles.priceUnit}>euros/mes</Text>
                <Text style={styles.priceLabel}>ACTIVIDAD</Text>
              </View>

              {/* Vertical Divider */}
              <View style={styles.verticalDivider} />

              {/* Right Column - Federacion */}
              <View style={styles.cuotasColumn}>
                <Text style={styles.priceNumber}>
                  {cuotas.cuota_anual_federacion}
                </Text>
                <Text style={styles.priceUnit}>euros/año</Text>
                <Text style={styles.priceLabel}>FEDERACIÓN</Text>
              </View>
            </View>
          </View>
        );
      default:
        return (
          <View style={styles.scheduleContainer}>
            {horario.length > 0 ? (
              horario.map((item, index) => (
                <View key={index} style={styles.scheduleItem}>
                  <Text style={styles.scheduleDay}>{item.dia}</Text>
                  {item.hora && (
                    <Text style={styles.scheduleTime}>{item.hora}</Text>
                  )}
                </View>
              ))
            ) : (
              // Horario por defecto si no hay datos
              <>
                <View style={styles.scheduleItem}>
                  <Text style={styles.scheduleDay}>Martes</Text>
                  <Text style={styles.scheduleTime}>21:00-22:30</Text>
                </View>
                <View style={styles.scheduleItem}>
                  <Text style={styles.scheduleDay}>Jueves</Text>
                  <Text style={styles.scheduleTime}>21:00-22:30</Text>
                </View>
                <View style={[styles.scheduleItem, styles.weekendSchedule]}>
                  <Text style={styles.weekendText}>Sábado/Domingo</Text>
                </View>
              </>
            )}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: 8,
              }}
            >
              <Text style={styles.infoText}>+ información en:</Text>
              <View style={{ flexDirection: "row" }}>
                <FontAwesome
                  name="whatsapp"
                  size={24}
                  color={COLORS.primary}
                  style={{ marginLeft: 16 }}
                />
                <FontAwesome
                  name="instagram"
                  size={24}
                  color={COLORS.primary}
                  style={{ marginLeft: 16 }}
                />
              </View>
            </View>
          </View>
        );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.content, isMobile && styles.contentMobile]}>
          <View
            style={[styles.mainContent, isMobile && styles.mainContentMobile]}
          >
            {isMobile && (
              <View
                style={[
                  styles.imageSection,
                  styles.imageSectionMobile,
                  styles.imageSectionMobileTopMargin,
                ]}
              >
                <ExpoImage
                  source={foto ? { uri: foto } : undefined}
                  style={styles.image}
                  resizeMode="cover"
                />
              </View>
            )}

            {/* Left Section */}
            <View
              style={[
                styles.scheduleSection,
                isMobile && styles.scheduleSectionMobile,
              ]}
            >
              {/* Navigation Header */}
              <View style={styles.headerRow}>
                <Text
                  style={[
                    styles.navItem,
                    activeTab === "horario"
                      ? styles.navItemActive
                      : styles.navItemInactive,
                    styles.navItemLeft,
                  ]}
                  onPress={() => onTabChange("horario")}
                >
                  Horario
                </Text>
                <Text
                  style={[
                    styles.navItem,
                    activeTab === "cuotas"
                      ? styles.navItemActive
                      : styles.navItemInactive,
                  ]}
                  onPress={() => onTabChange("cuotas")}
                >
                  Cuotas
                </Text>
                <Text
                  style={[
                    styles.navItem,
                    activeTab === "pabellon"
                      ? styles.navItemActive
                      : styles.navItemInactive,
                    styles.navItemRight,
                  ]}
                  onPress={() => onTabChange("pabellon")}
                >
                  Pabellón
                </Text>
              </View>

              {/* Dynamic Content */}
              {renderContent()}
            </View>

            {!isMobile && (
              <View style={[styles.imageSection, styles.imageSectionMobile]}>
                <ExpoImage
                  source={
                    foto
                      ? { uri: foto }
                      : {
                          uri: "https://www.walashop.com/storyblok/f/191463/768x450/9811023932/basquet-mobile.jpg",
                        }
                  }
                  style={styles.image}
                  resizeMode="cover"
                />
              </View>
            )}
          </View>

          {/* Re-add original bottom text */}
          <View
            style={[
              styles.bottomSection,
              isMobile && styles.bottomSectionMobile,
            ]}
          >
            <Text style={styles.title}>{texto.cta_titulo}</Text>
            <Text style={[styles.description, styles.justifiedText]}>
              {texto.descripcion ||
                "¡Bienvenido a nuestro equipo! Aquí encontrarás toda la información necesaria para unirte a nosotros y disfrutar de la pasión del deporte."}
            </Text>
          </View>

          {/* CTA Section remains below */}
          {!isJugador && (
            <View style={styles.ctaSection}>
              <LinearGradient
                colors={[COLORS.primary, COLORS.background]}
                start={{ x: 0, y: 0 }}
                end={{ x: 10, y: 10 }}
                style={styles.ctaGradient}
              >
                <Text style={styles.ctaTitle}>¿Listo para unirte?</Text>
                <Text style={styles.ctaDescription}>
                  {texto.cta_texto ||
                    "Forma parte de nuestro equipo y vive la pasión del deporte."}
                </Text>
                <TouchableOpacity
                  style={styles.ctaButton}
                  onPress={() => setModal(true)}
                  disabled={loading}
                >
                  <Text style={styles.ctaButtonText}>
                    {" "}
                    {loading ? "Inscribiendo..." : "Únete"}
                  </Text>
                </TouchableOpacity>
              </LinearGradient>
            </View>
          )}
        </View>
      </ScrollView>
      <Modal
        visible={modal}
        transparent
        animationType="slide"
        onRequestClose={() => setModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={{ fontSize: 18, marginBottom: 12 }}>
              Confirma tu contraseña
            </Text>
            <TextInput
              placeholder="Contraseña"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              style={styles.modalInput}
            />
            {error && <Text style={{ color: "red" }}>{error}</Text>}
            <View style={{ flexDirection: "row", marginTop: 16 }}>
              <TouchableOpacity
                style={styles.modalBtn}
                onPress={() => setModal(false)}
              >
                <Text>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalBtn}
                onPress={handleJoin}
                disabled={loading}
              >
                {loading ? <ActivityIndicator /> : <Text>Confirmar</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    marginTop: Platform.select({
      web: 25,
      default: 0,
    }),
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: Platform.select({ web: 0, default: 0 }),
    paddingVertical: Platform.select({ web: 24, default: 16 }),
  },
  contentMobile: {
    marginHorizontal: 1, // Increased margin for mobile
  },
  mainContent: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: Platform.select({ web: 24, default: 16 }),
    marginBottom: Platform.select({ web: 48, default: 24 }),
    alignSelf: "center",
    width: "100%",
    maxWidth: 1200,
  },
  mainContentMobile: {
    flexDirection: "column",
  },
  scheduleSection: {
    flex: 1,
    minWidth: Platform.OS === "web" ? 300 : undefined,
    maxWidth: Platform.OS === "web" ? 500 : undefined,
    marginStart: Platform.select({ web: 75, default: 0 }),
  },
  scheduleSectionMobile: {
    marginStart: 0,
    width: "85%",
    alignSelf: "center",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: Platform.select({ web: 32, default: 24 }),
  },
  navItem: {
    fontSize: Platform.select({ web: 28, default: 20 }),
    fontWeight: "800",
    paddingVertical: 8,
    flex: 1,
    textAlign: "center",
  },
  navItemActive: {
    color: COLORS.primary,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.primary,
  },
  navItemInactive: {
    color: `${COLORS.primary}80`, // Using hex opacity
  },
  scheduleContainer: {
    gap: 16,
    marginTop: 0,
  },
  scheduleItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: `${COLORS.primary}1A`,
  },
  scheduleDay: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.primary,
  },
  scheduleTime: {
    fontSize: 20,
    color: COLORS.primary,
  },
  weekendSchedule: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    padding: 16,
    justifyContent: "center",
    borderBottomWidth: 0,
  },
  weekendText: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.text.light,
    textAlign: "center",
  },
  infoText: {
    fontSize: 18,
    color: COLORS.primary,
    marginTop: 8,
  },
  imageSection: {
    flex: 1,
    minWidth: Platform.OS === "web" ? 300 : undefined,
    maxWidth: Platform.OS === "web" ? 600 : undefined,
    aspectRatio: 9 / 16,
  },
  imageSectionMobile: {
    marginTop: -15,
    width: "100%",
    alignItems: "center",
  },
  image: {
    width: "90%",
    height: "90%",
    borderRadius: 12,
  },
  bottomSection: {
    alignItems: "center",
    paddingTop: Platform.select({ web: 48, default: 62 }),
    gap: Platform.select({ web: 24, default: 16 }),
    maxWidth: 800,
    alignSelf: "center",
    width: "90%",
    marginBottom: 0, // Remove bottom margin
    paddingBottom: 16, // Add small padding instead
    backgroundColor: COLORS.background,
  },
  bottomSectionMobile: {
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 50,
    fontWeight: "900",
    color: COLORS.primary,
    textAlign: "center",
    lineHeight: 55,
    fontFamily: "GT-America-Compressed-Black-Trial.otf",
  },
  description: {
    fontSize: 18,
    lineHeight: 32,
    color: COLORS.primary,
    opacity: 0.8,
    letterSpacing: 0.75,
    marginTop: 30,
  },
  joinText: {
    fontSize: 20,
    fontWeight: "600",
    color: COLORS.primary,
  },
  navItemLeft: {
    textAlign: "left",
  },
  navItemRight: {
    textAlign: "right",
  },
  justifiedText: {
    textAlign: "justify",
  },
  imageSectionMobileTopMargin: {
    marginBottom: 0, // Add margin between image and schedule
  },
  bottomSectionMobileTopMargin: {
    marginTop: 0, // Add margin between schedule and bottom section
  },
  cuotasContainer: {
    height: 224,
  },
  cuotasContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 0,
  },
  cuotasColumn: {
    flex: 1,
    alignItems: "center",
  },
  verticalDivider: {
    marginTop: 16,
    width: 1,
    height: 194,
    backgroundColor: `${COLORS.primary}80`,
    marginHorizontal: 12,
  },
  priceNumber: {
    marginTop: 16,
    fontSize: 75,
    fontWeight: "900",
    color: COLORS.primary,
  },
  priceUnit: {
    fontSize: 20,
    fontWeight: "900",
    color: `${COLORS.primary}80`,
  },
  priceLabel: {
    fontSize: 20,
    fontWeight: "900",
    color: COLORS.primary,
    marginTop: 16,
    fontFamily: "GT-America-Condensed-Bold-Trial.otf",
    letterSpacing: -0.5,
  },
  icon: {
    width: 18,
    height: 18,
    marginLeft: 8,
    tintColor: COLORS.primary,
  },
  // New styles for Pabe
  // llon section
  pabellonContainer: {
    flex: 1,
  },
  pabellonImageContainer: {
    width: "100%",
    height: 300,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.primary,
    marginTop: 16,
  },
  pabellonMap: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },
  pabellonInfo: {
    padding: 8,
  },
  pabellonTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: COLORS.primary,
    marginBottom: 8,
    marginTop: 16,
  },
  pabellonAddress: {
    fontSize: 18,
    color: COLORS.primary,
    marginBottom: 12,
  },
  pabellonDescription: {
    fontSize: 16,
    lineHeight: 24,
    color: `${COLORS.primary}CC`,
  },
  pabellonMapContainer: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
    overflow: "hidden",
    marginTop: 16,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  // New CTA styles:
  ctaSection: {
    paddingHorizontal: 16,
    paddingVertical: 40,
    alignItems: "center",
  },
  ctaGradient: {
    borderRadius: 20,
    padding: 32,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  ctaTitle: {
    color: COLORS.text.light,
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 16,
    textAlign: "center",
  },
  ctaDescription: {
    color: COLORS.text.light,
    fontSize: 16,
    textAlign: "center",
    marginBottom: 24,
    opacity: 0.9,
    maxWidth: 500,
  },
  ctaButton: {
    backgroundColor: COLORS.text.light,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 30,
  },
  ctaButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalCard: {
    width: "85%",
    maxWidth: 400,
    backgroundColor: COLORS.text.light,
    borderRadius: 16,
    paddingVertical: 28,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.primary,
    marginBottom: 18,
  },
  modalInput: {
    width: "100%",
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
    marginBottom: 14,
    fontSize: 15,
    color: COLORS.text.dark,
  },
  modalError: {
    color: COLORS.primary,
    marginBottom: 8,
    fontSize: 14,
  },
  modalBtnRow: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    marginTop: 6,
  },
  modalBtn: {
    flex: 1,
    backgroundColor: COLORS.primary,
    borderRadius: 1000,
    height: 46,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 4,
  },
  modalBtnOutline: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },
  modalBtnText: {
    color: COLORS.text.light,
    fontWeight: "600",
    fontSize: 15,
  },
  modalBtnTextOutline: {
    color: COLORS.primary,
    fontWeight: "600",
    fontSize: 15,
  },
});
