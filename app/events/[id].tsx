// frontend/src/app/events/[id].tsx
import React, { useState, useRef, useEffect } from "react";
import {
  ActivityIndicator as RNActivityIndicator,
  Linking,
  Platform,
  Animated,
  Dimensions,
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
} from "react-native";
import { useInscripcion } from "@/hooks/useInscripcion";
import { SafeAreaView } from "react-native-safe-area-context";
import { FooterMenu } from "@/components/FooterMenu";
import { HeaderMenu } from "@/components/HeaderMenu";
import { COLORS } from "@/constants/theme";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";
import {
  Calendar,
  MapPin,
  Clock,
  Share2,
  ChevronDown,
} from "lucide-react-native";
import GallerySlider from "@/components/GallerySlider";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { useLocalSearchParams } from "expo-router";
import { useEvent, EventData } from "../../hooks/useEvent";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function EventScreen() {
  // Obtener ID desde URL
  const params = useLocalSearchParams();
  const eventId = params.id ? parseInt(params.id as string, 10) : 0;

  // Fetch
  const { event, loading, error, refetch } = useEvent(eventId);

  // Estado local y animaciones
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const capacityWidthAnim = useRef(new Animated.Value(0)).current;
  const [expandedFaq, setExpandedFaq] = useState<null | number>(null);
  const {
    inscribirseEnEvento,
    loading: inscLoading,
    error: inscError,
  } = useInscripcion();
  const [modalVisible, setModalVisible] = useState(false);
  const [password, setPassword] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Calcula plazas dinámicamente desde los datos del evento
  const inscritos = event?.inscritos || 0;
  const totalCapacity = event?.cupo_total || 0;
  const plazasLibres = totalCapacity - inscritos;
  const capacityPercentage =
    totalCapacity > 0 ? (inscritos / totalCapacity) * 100 : 0;

  function getFriendlyErrorMessage(err: string) {
    if (!err) return "";
    if (err.includes("No puedes inscribirte a un evento pasado"))
      return "El evento ya ha pasado.";
    if (err.includes("El evento ya ha alcanzado el cupo máximo"))
      return "¡El evento está lleno!";
    if (err.includes("Ya estás inscrito"))
      return "Ya estás inscrito en este evento.";
    if (err.includes("Contraseña incorrecta")) return "Contraseña incorrecta.";
    if (err.includes("Usuario no autenticado"))
      return "Debes iniciar sesión para inscribirte.";
    return err; // Por defecto, muestra el error original
  }

  // Calcula si el evento está cerrado por fecha límite o lleno
  const fechaLimite = event?.fecha_limite_inscripcion
    ? new Date(event?.fecha_limite_inscripcion)
    : null;
  const hoy = new Date();
  const plazoFinalizado = fechaLimite ? hoy > fechaLimite : false;
  const eventoLleno =
    event?.cupo_total !== undefined &&
    event?.inscritos !== undefined &&
    event?.inscritos >= event?.cupo_total;
  const inscripcionCerrada = plazoFinalizado || eventoLleno;

  // Animaciones iniciales y al cambiar el porcentaje de capacidad
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    Animated.timing(capacityWidthAnim, {
      toValue: 100 - capacityPercentage,
      duration: 700,
      useNativeDriver: false,
    }).start();
  }, [capacityPercentage]);

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <RNActivityIndicator size="large" color={COLORS.primary} />
      </SafeAreaView>
    );
  }
  if (error) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text style={{ color: "red" }}>
          Error loading event: {error.message}
        </Text>
      </SafeAreaView>
    );
  }
  if (!event) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text>No event found.</Text>
      </SafeAreaView>
    );
  }

  // Mapear datos al tipo EventData
  const eventData: EventData = {
    id: event.id,
    titulo: event.titulo,
    descripcion: event.descripcion,
    fecha: event.fecha ? new Date(event.fecha).toLocaleDateString() : "",
    hora_inicio: event.hora_inicio ? event.hora_inicio.toString() : "",
    hora_fin: event.hora_fin ? event.hora_fin.toString() : "",
    lugar_nombre: event.lugar_nombre,
    direccion: event.direccion,
    latitud: event.latitud,
    longitud: event.longitud,
    fecha_limite_inscripcion: event.fecha_limite_inscripcion
      ? new Date(event.fecha_limite_inscripcion).toLocaleDateString()
      : "",
    cupo_total: event.cupo_total || 0,
    programa: event.programa,
    testimonios: event.testimonios,
    faqs: event.faqs,
    creado_en: event.creado_en
      ? new Date(event.creado_en).toLocaleDateString()
      : "",
    inscritos: event.inscritos || 0,
  };

  // Handlers
  const openMap = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const scheme = Platform.select({
      ios: "maps:0,0?q=",
      android: "geo:0,0?q=",
    });
    const latLng = `${eventData.latitud},${eventData.longitud}`;
    const label = eventData.lugar_nombre;
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`,
    });
    Linking.openURL(url!);
  };

  const shareEvent = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const message = `¡Te invito al ${eventData.titulo} el ${eventData.fecha} en ${eventData.lugar_nombre}!`;
    Linking.openURL(`whatsapp://send?text=${encodeURIComponent(message)}`);
  };

  const toggleFaq = (index: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
      <HeaderMenu />

      <Animated.ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        style={{ opacity: fadeAnim, transform: [{ scale: scaleAnim }] }}
      >
        {/* Hero Section */}
        <View style={styles.heroContainer}>
          <Image
            source={require("../../assets/images/Poster1.jpeg")}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.7)"]}
            style={styles.heroGradient}
          />
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>{eventData.titulo}</Text>
            <View style={styles.heroInfoContainer}>
              <View style={styles.heroInfoItem}>
                <Calendar size={18} color={COLORS.text.light} />
                <Text style={styles.heroInfoText}>{eventData.fecha}</Text>
              </View>
              <View style={styles.heroInfoItem}>
                <Clock size={18} color={COLORS.text.light} />
                <Text style={styles.heroInfoText}>
                  {eventData.hora_inicio} - {eventData.hora_fin}
                </Text>
              </View>
              <View style={styles.heroInfoItem}>
                <MapPin size={18} color={COLORS.text.light} />
                <Text style={styles.heroInfoText}>
                  {eventData.lugar_nombre}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Main Content Area */}
        <View style={styles.mainContentArea}>
          {/* Registro */}
          <Animated.View style={[styles.card, styles.registrationCard]}>
            <View style={styles.registrationStatusContainer}>
              <Text style={styles.registrationStatusText}>
                Inscripciones abiertas
              </Text>
              <View style={styles.spotInfoContainer}>
                <Text style={styles.availableSpotsText}>{plazasLibres}</Text>
                <Text style={styles.totalSpotsText}>
                  /{totalCapacity} plazas disponibles
                </Text>
              </View>
              <Text style={styles.registrationDeadlineText}>
                Fecha límite: {eventData.fecha_limite_inscripcion}
              </Text>
              <View style={styles.capacityBarContainer}>
                <View
                  style={[
                    styles.capacityBarFill,
                    {
                      width: `${capacityPercentage}%`, // ¡Barra proporcional!
                    },
                  ]}
                />
              </View>
            </View>
            <TouchableOpacity
              style={[
                styles.registerButton,
                inscripcionCerrada && { backgroundColor: "rgb(119, 119, 119)" }, // gris si cerrado
              ]}
              onPress={() => setModalVisible(true)}
              disabled={inscripcionCerrada || inscLoading}
            >
              {inscripcionCerrada ? (
                <Text style={[styles.registerButtonText, { color: "#888" }]}>
                  {eventoLleno
                    ? "Evento lleno"
                    : plazoFinalizado
                    ? "Inscripción cerrada"
                    : "No disponible"}
                </Text>
              ) : inscLoading ? (
                <RNActivityIndicator size="small" color={COLORS.background} />
              ) : (
                <Text style={styles.registerButtonText}>Inscribirse</Text>
              )}
            </TouchableOpacity>
          </Animated.View>

          {/* Descripción */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Descripción del Evento</Text>
            <Text style={styles.descriptionText}>{eventData.descripcion}</Text>
          </View>

          {/* Ubicación */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Ubicación</Text>
            <View style={styles.card}>
              <View style={styles.locationContainer}>
                <View style={styles.locationTextContainer}>
                  <Text style={styles.locationName}>
                    {eventData.lugar_nombre}
                  </Text>
                  <Text style={styles.locationAddress}>
                    {eventData.direccion}
                  </Text>
                  <TouchableOpacity
                    style={styles.directionButton}
                    onPress={openMap}
                  >
                    <Text style={styles.directionButtonText}>Cómo llegar</Text>
                    <MaterialIcons
                      name="directions"
                      size={16}
                      color={COLORS.primary}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              {/* MapView deshabilitado */}
            </View>
          </View>

          {/* Programa */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Programa</Text>
            <View style={styles.card}>
              {eventData.programa?.map((item: any, idx: any) => (
                <View key={idx} style={styles.scheduleItem}>
                  <View style={styles.scheduleTimeContainer}>
                    <Text style={styles.scheduleTime}>{item.time}</Text>
                  </View>
                  <View style={styles.scheduleTimelineContainer}>
                    <View
                      style={[
                        styles.scheduleTimeline,
                        idx === eventData.programa.length - 1 &&
                          styles.lastScheduleTimeline,
                      ]}
                    />
                    <View style={styles.scheduleTimelineDot} />
                  </View>
                  <View style={styles.scheduleActivityContainer}>
                    <Text style={styles.scheduleActivity}>{item.activity}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Galería */}
          <View style={[styles.sectionContainer, { marginBottom: 16 }]}>
            <Text style={styles.sectionTitle}>Galería</Text>
            <GallerySlider />
          </View>

          {/* Testimonios */}
          <View style={styles.sectionContainer}>
            <Text style={[styles.sectionTitle, { marginTop: 0 }]}>
              Testimonios
            </Text>
            {eventData.testimonios?.map((t: any, idx: any) => (
              <View key={idx} style={[styles.card, styles.testimonialCard]}>
                <Text style={styles.testimonialText}>"{t.text}"</Text>
                <View style={styles.testimonialAuthorContainer}>
                  <View style={styles.testimonialAvatar}>
                    <Text style={styles.testimonialAvatarText}>
                      {t.name.charAt(0)}
                    </Text>
                  </View>
                  <View style={styles.testimonialAuthorInfo}>
                    <Text style={styles.testimonialName}>{t.name}</Text>
                    <Text style={styles.testimonialRole}>{t.role}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>

          {/* FAQs */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Preguntas Frecuentes</Text>
            {eventData.faqs?.map((f: any, idx: any) => (
              <TouchableOpacity
                key={idx}
                style={[styles.card, styles.faqCard]}
                onPress={() => toggleFaq(idx)}
                activeOpacity={0.8}
              >
                <View style={styles.faqHeader}>
                  <Text style={styles.faqQuestion}>{f.question}</Text>
                  <ChevronDown
                    size={20}
                    color={COLORS.primary}
                    style={[
                      styles.faqIcon,
                      expandedFaq === idx && styles.faqIconExpanded,
                    ]}
                  />
                </View>
                {expandedFaq === idx && (
                  <Text style={styles.faqAnswer}>{f.answer}</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* Compartir */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Comparte este evento</Text>
            <View style={styles.card}>
              <Text style={styles.socialText}>
                ¿Te ha gustado este evento? ¡Compártelo con tus amigos!
              </Text>
              <View style={styles.socialButtonsContainer}>
                <TouchableOpacity
                  style={styles.socialButton}
                  onPress={shareEvent}
                >
                  <FontAwesome
                    name="whatsapp"
                    size={22}
                    color={COLORS.background}
                  />
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialButton}>
                  <FontAwesome
                    name="facebook"
                    size={22}
                    color={COLORS.background}
                  />
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialButton}>
                  <FontAwesome
                    name="twitter"
                    size={22}
                    color={COLORS.background}
                  />
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialButton}>
                  <FontAwesome
                    name="instagram"
                    size={22}
                    color={COLORS.background}
                  />
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialButton}>
                  <Share2 size={22} color={COLORS.background} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Animated.ScrollView>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={modalStyles.overlay}>
          <View style={modalStyles.container}>
            <Text style={modalStyles.title}>Confirma tu contraseña</Text>
            <TextInput
              placeholder="Contraseña"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              style={modalStyles.input}
            />
            {successMsg !== "" && (
              <Text
                style={{
                  color: "green",
                  textAlign: "center",
                  marginVertical: 8,
                }}
              >
                {successMsg}
              </Text>
            )}
            {inscError && (
              <Text style={modalStyles.error}>
                {getFriendlyErrorMessage(inscError)}
              </Text>
            )}
            <View style={modalStyles.buttonsRow}>
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(false);
                  setPassword("");
                  setSuccessMsg("");
                }}
              >
                <Text style={modalStyles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={async () => {
                  try {
                    await inscribirseEnEvento(eventId, password);
                    setSuccessMsg("¡Inscripción exitosa!");
                    await refetch(); // <-- ACTUALIZA LOS DATOS DEL EVENTO
                  } catch (e) {
                    // Ya se muestra inscError
                  } finally {
                    setTimeout(() => {
                      setModalVisible(false);
                      setPassword("");
                      setSuccessMsg("");
                    }, 1500);
                  }
                }}
                disabled={inscLoading || successMsg !== ""}
              >
                <Text style={modalStyles.buttonText}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      {/* Footer fijo */}
      <FooterMenu style={styles.footerMenu} isDark={false} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingTop: 0,
    paddingBottom: 120,
  },
  heroContainer: {
    width: "100%",
    height: SCREEN_HEIGHT * 0.5,
    position: "relative",
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  heroGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "70%",
  },
  heroContent: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
  },
  heroTitle: {
    fontFamily: "GT-America-Standard-Black-Trial.otf",
    fontSize: 32,
    fontWeight: "bold",
    color: COLORS.text.light,
    marginBottom: 15,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  heroInfoContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
  },
  heroInfoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
    marginBottom: 8,
  },
  heroInfoText: {
    color: COLORS.text.light,
    fontFamily: "GT-America-Standard-Black-Trial.otf",
    fontSize: 14,
    marginLeft: 5,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  mainContentArea: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  card: {
    backgroundColor: COLORS.text.light,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  registrationCard: {
    marginTop: -40,
    borderWidth: 1,
    borderColor: "rgba(187, 75, 54, 0.2)",
  },
  registrationStatusContainer: {
    marginBottom: 15,
  },
  registrationStatusText: {
    fontFamily: "GT-America-Standard-Black-Trial.otf",
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 8,
  },
  spotInfoContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 5,
  },
  availableSpotsText: {
    fontFamily: "GT-America-Standard-Black-Trial.otf",
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  totalSpotsText: {
    fontFamily: "GT-America-Standard-Black-Trial.otf",
    fontSize: 16,
    color: COLORS.text.dark,
    marginLeft: 2,
  },
  registrationDeadlineText: {
    fontFamily: "GT-America-Standard-Black-Trial.otf",
    fontSize: 14,
    color: COLORS.text.dark,
    marginBottom: 12,
  },
  capacityBarContainer: {
    height: 8,
    backgroundColor: "rgba(187, 75, 54, 0.2)",
    borderRadius: 4,
    overflow: "hidden",
  },
  capacityBarFill: {
    height: "100%",
    backgroundColor: COLORS.primary,
  },
  registerButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  registerButtonText: {
    color: COLORS.background,
    fontFamily: "GT-America-Standard-Black-Trial.otf",
    fontSize: 16,
    fontWeight: "bold",
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: "GT-America-Standard-Black-Trial.otf",
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 12,
  },
  descriptionText: {
    fontFamily: "GT-America-Standard-Black-Trial.otf",
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.text.dark,
    backgroundColor: COLORS.text.light,
    padding: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  locationContainer: {
    marginBottom: 16,
  },
  locationTextContainer: {
    marginBottom: 10,
  },
  locationName: {
    fontFamily: "GT-America-Standard-Black-Trial.otf",
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 5,
  },
  locationAddress: {
    fontFamily: "GT-America-Standard-Black-Trial.otf",
    fontSize: 14,
    color: COLORS.text.dark,
    marginBottom: 10,
  },
  directionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(187, 75, 54, 0.1)",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  directionButtonText: {
    fontFamily: "GT-America-Standard-Black-Trial.otf",
    fontSize: 14,
    color: COLORS.primary,
    marginRight: 5,
    fontWeight: "500",
  },
  scheduleItem: {
    flexDirection: "row",
    marginBottom: 16,
    alignItems: "flex-start",
  },
  scheduleTimeContainer: {
    width: 60,
    paddingRight: 10,
  },
  scheduleTime: {
    fontFamily: "GT-America-Standard-Black-Trial.otf",
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: "bold",
  },
  scheduleTimelineContainer: {
    width: 20,
    alignItems: "center",
    height: 40,
    position: "relative",
  },
  scheduleTimeline: {
    width: 2,
    position: "absolute",
    top: 10,
    bottom: -16,
    backgroundColor: COLORS.primary,
  },
  lastScheduleTimeline: {
    bottom: 0,
  },
  scheduleTimelineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
  },
  scheduleActivityContainer: {
    flex: 1,
    paddingLeft: 10,
  },
  scheduleActivity: {
    fontFamily: "GT-America-Standard-Black-Trial.otf",
    fontSize: 14,
    color: COLORS.text.dark,
  },
  testimonialCard: {
    marginBottom: 12,
  },
  testimonialText: {
    fontFamily: "GT-America-Standard-Black-Trial.otf",
    fontSize: 14,
    fontStyle: "italic",
    color: COLORS.text.dark,
    marginBottom: 16,
    lineHeight: 22,
  },
  testimonialAuthorContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  testimonialAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  testimonialAvatarText: {
    color: COLORS.text.light,
    fontSize: 18,
    fontWeight: "bold",
  },
  testimonialAuthorInfo: {
    flex: 1,
  },
  testimonialName: {
    fontFamily: "GT-America-Standard-Black-Trial.otf",
    fontSize: 14,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  testimonialRole: {
    fontFamily: "GT-America-Standard-Black-Trial.otf",
    fontSize: 12,
    color: COLORS.text.dark,
  },
  faqCard: {
    marginBottom: 8,
  },
  faqHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  faqQuestion: {
    fontFamily: "GT-America-Standard-Black-Trial.otf",
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.primary,
    flex: 1,
  },
  faqIcon: {
    transform: [{ rotate: "0deg" }],
  },
  faqIconExpanded: {
    transform: [{ rotate: "180deg" }],
  },
  faqAnswer: {
    fontFamily: "GT-America-Standard-Black-Trial.otf",
    fontSize: 14,
    color: COLORS.text.dark,
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "rgba(187, 75, 54, 0.1)",
  },
  socialText: {
    fontFamily: "GT-America-Standard-Black-Trial.otf",
    fontSize: 14,
    color: COLORS.text.dark,
    marginBottom: 16,
  },
  socialButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  socialButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  footerMenu: {
    position: "absolute",
    left: 0,
    right: 0,
    marginTop: -40,
  },
});
const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "80%",
    backgroundColor: COLORS.text.light,
    borderRadius: 12,
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: COLORS.text.dark,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
  },
  error: {
    color: "red",
    marginBottom: 8,
    textAlign: "center",
  },
  buttonsRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  buttonText: {
    color: COLORS.primary,
    fontWeight: "600",
    marginLeft: 16,
  },
});
