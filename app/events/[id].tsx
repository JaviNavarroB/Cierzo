// frontend/src/app/events/[id].tsx

import React, { useState, useRef, useEffect } from "react";
import {
  ActivityIndicator as RNActivityIndicator,
  Linking,
  Platform,
  Animated,
  StatusBar,
  Dimensions,
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FooterMenu } from "@/components/FooterMenu";
import { COLORS } from "@/constants/theme";
import { MaterialIcons, FontAwesome, Feather } from "@expo/vector-icons";
import MapView, { Marker } from "react-native-maps";
import {
  Menu,
  Calendar,
  MapPin,
  Clock,
  Share2,
  ChevronDown,
} from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import GallerySlider from "@/components/GallerySlider";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "@/@types/routes.types";
import { useLocalSearchParams } from "expo-router";
import { useEvent, EventData } from "../../hooks/useEvent";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

interface AnimatedHeaderProps {
  scrollY: Animated.Value;
}

function AnimatedHeader({ scrollY }: AnimatedHeaderProps) {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });
  return (
    <>
      <StatusBar barStyle="light-content" />
      <Animated.View
        style={[headerStyles.container, { opacity: headerOpacity }]}
      >
        <View style={headerStyles.header}>
          <Text style={headerStyles.logo}>Cierzo</Text>
          <TouchableOpacity
            style={headerStyles.menuButton}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              navigation.navigate("profile");
            }}
          >
            <Menu size={28} color={COLORS.text.dark} />
          </TouchableOpacity>
        </View>
      </Animated.View>
      <TouchableOpacity
        style={headerStyles.backButton}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          navigation.goBack();
        }}
      >
        <View style={headerStyles.backButtonInner}>
          <Feather name="chevron-left" size={24} color={COLORS.text.light} />
        </View>
      </TouchableOpacity>
    </>
  );
}

const headerStyles = StyleSheet.create({
  container: {
    position: "absolute",
    width: "100%",
    height: 100,
    left: 0,
    top: 0,
    zIndex: 10,
    backgroundColor: COLORS.text.light,
  },
  header: {
    position: "absolute",
    width: "100%",
    height: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  logo: {
    fontFamily: "DancingScript-Bold",
    fontSize: 40,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 25,
    color: COLORS.text.dark,
  },
  menuButton: {
    position: "absolute",
    right: 20,
    top: Platform.OS === "ios" ? 50 : 17,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
  },
  backButton: {
    position: "absolute",
    left: 20,
    top: Platform.OS === "ios" ? 50 : 17,
    zIndex: 20,
  },
  backButtonInner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default function EventScreen() {
  // Get the event id from the URL parameters
  const params = useLocalSearchParams();
  const eventId = params.id ? parseInt(params.id as string, 10) : 0;

  // Use the useEvent hook to fetch event data
  const { event, loading, error } = useEvent(eventId);

  // Local state & animation values for demonstration (e.g., registration logic)
  const [availableSpots, setAvailableSpots] = useState<number>(
    event?.cupo_disponible || 15
  );
  const totalCapacity = event?.cupo_total || 30;
  const capacityPercentage = (availableSpots / totalCapacity) * 100;
  const scrollY = useRef(new Animated.Value(0)).current;
  const [expandedFaq, setExpandedFaq] = useState<null | number>(null);
  const [isRegistering, setIsRegistering] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const capacityWidthAnim = useRef(new Animated.Value(0)).current;

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
      Animated.timing(capacityWidthAnim, {
        toValue: 100 - capacityPercentage,
        duration: 1200,
        useNativeDriver: false,
      }),
    ]).start();
  }, []);

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

  // Map the fetched event data to our EventData interface.
  // You may choose to format dates as needed.
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
    cupo_disponible: event.cupo_disponible || 0,
    programa: event.programa, // Assuming this is already in the desired format (e.g. an array)
    testimonios: event.testimonios, // Assuming this is already in the desired format
    faqs: event.faqs, // Assuming this is already in the desired format
    creado_en: event.creado_en
      ? new Date(event.creado_en).toLocaleDateString()
      : "",
  };

  const openMap = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const scheme = Platform.select({
      ios: "maps:0,0?q=",
      android: "geo:0,0?q=",
    });
    // Here we use the latitud and longitud from the event data
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

  const handleRegister = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsRegistering(true);
    setTimeout(() => {
      setAvailableSpots((prev) => Math.max(0, prev - 1));
      setIsRegistering(false);
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.05,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
      Animated.timing(capacityWidthAnim, {
        toValue: 100 - ((availableSpots - 1) / totalCapacity) * 100,
        duration: 500,
        useNativeDriver: false,
      }).start();
    }, 1500);
  };

  const toggleFaq = (index: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
      <AnimatedHeader scrollY={scrollY} />
      <Animated.ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
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
          <Animated.View style={[styles.card, styles.registrationCard]}>
            <View style={styles.registrationStatusContainer}>
              <Text style={styles.registrationStatusText}>
                Inscripciones abiertas
              </Text>
              <View style={styles.spotInfoContainer}>
                <Text style={styles.availableSpotsText}>{availableSpots}</Text>
                <Text style={styles.totalSpotsText}>
                  /{totalCapacity} plazas disponibles
                </Text>
              </View>
              <Text style={styles.registrationDeadlineText}>
                Fecha límite: {eventData.fecha_limite_inscripcion}
              </Text>
              <View style={styles.capacityBarContainer}>
                <Animated.View
                  style={[
                    styles.capacityBarFill,
                    {
                      width: capacityWidthAnim.interpolate({
                        inputRange: [0, 100],
                        outputRange: ["0%", "100%"],
                      }),
                    },
                  ]}
                />
              </View>
            </View>
            <TouchableOpacity
              style={[
                styles.registerButton,
                isRegistering && styles.registerButtonDisabled,
              ]}
              onPress={handleRegister}
              disabled={isRegistering}
            >
              {isRegistering ? (
                <View style={styles.loadingContainer}>
                  <Text style={styles.registerButtonText}>Procesando</Text>
                  <RNActivityIndicator
                    size="small"
                    color={COLORS.text.light}
                    style={styles.loadingIndicator}
                  />
                </View>
              ) : (
                <Text style={styles.registerButtonText}>Inscribirse</Text>
              )}
            </TouchableOpacity>
          </Animated.View>
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Descripción del Evento</Text>
            <Text style={styles.descriptionText}>{eventData.descripcion}</Text>
          </View>
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
              <View style={styles.mapContainer}>
                {/*
                <MapView
                  style={styles.map}
                  initialRegion={{
                    latitude: parseFloat(eventData.latitud),
                    longitude: parseFloat(eventData.longitud),
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                  }}
                >
                  <Marker
                    coordinate={{
                      latitude: parseFloat(eventData.latitud),
                      longitude: parseFloat(eventData.longitud),
                    }}
                    title={eventData.lugar_nombre}
                  />
                </MapView>
                */}
              </View>
            </View>
          </View>
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Programa</Text>
            <View style={styles.card}>
              {eventData.programa?.map((programa: any, index: number) => (
                <View key={index} style={styles.scheduleItem}>
                  <View style={styles.scheduleTimeContainer}>
                    <Text style={styles.scheduleTime}>{programa.time}</Text>
                  </View>
                  <View style={styles.scheduleTimelineContainer}>
                    <View
                      style={[
                        styles.scheduleTimeline,
                        index === eventData.programa.length - 1 &&
                          styles.lastScheduleTimeline,
                      ]}
                    />
                    <View style={styles.scheduleTimelineDot} />
                  </View>
                  <View style={styles.scheduleActivityContainer}>
                    <Text style={styles.scheduleActivity}>
                      {programa.activity}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
          <View style={[styles.sectionContainer, { marginBottom: 16 }]}>
            <Text style={styles.sectionTitle}>Galería</Text>
            <GallerySlider />
          </View>
          <View style={styles.sectionContainer}>
            <Text style={[styles.sectionTitle, { marginTop: 0 }]}>
              Testimonios
            </Text>
            {eventData.testimonios?.map((testimonios: any, index: number) => (
              <View key={index} style={[styles.card, styles.testimonialCard]}>
                <Text style={styles.testimonialText}>"{testimonios.text}"</Text>
                <View style={styles.testimonialAuthorContainer}>
                  <View style={styles.testimonialAvatar}>
                    <Text style={styles.testimonialAvatarText}>
                      {testimonios.name.charAt(0)}
                    </Text>
                  </View>
                  <View style={styles.testimonialAuthorInfo}>
                    <Text style={styles.testimonialName}>
                      {testimonios.name}
                    </Text>
                    <Text style={styles.testimonialRole}>
                      {testimonios.role}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Preguntas Frecuentes</Text>
            {eventData.faqs?.map((faq: any, index: number) => (
              <TouchableOpacity
                key={index}
                style={[styles.card, styles.faqCard]}
                onPress={() => toggleFaq(index)}
                activeOpacity={0.8}
              >
                <View style={styles.faqHeader}>
                  <Text style={styles.faqQuestion}>{faq.question}</Text>
                  <ChevronDown
                    size={20}
                    color={COLORS.primary}
                    style={[
                      styles.faqIcon,
                      expandedFaq === index && styles.faqIconExpanded,
                    ]}
                  />
                </View>
                {expandedFaq === index && (
                  <Text style={styles.faqAnswer}>{faq.answer}</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
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
      <FooterMenu style={styles.footerMenu} isDark={false} />
    </SafeAreaView>
  );
}

interface ActivityIndicatorProps {
  size: "small" | "large";
  color: string;
  style?: any;
}

const ActivityIndicator: React.FC<ActivityIndicatorProps> = ({
  size,
  color,
  style,
}) => {
  const spinValue = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    );
    animation.start();
    return () => animation.stop();
  }, []);
  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });
  return (
    <Animated.View
      style={[
        {
          width: size === "small" ? 16 : 24,
          height: size === "small" ? 16 : 24,
          borderRadius: size === "small" ? 8 : 12,
          borderWidth: 2,
          borderColor: color,
          borderTopColor: "transparent",
          transform: [{ rotate: spin }],
        },
        style,
      ]}
    />
  );
};

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
  registerButtonDisabled: {
    backgroundColor: "rgba(187, 75, 54, 0.7)",
  },
  registerButtonText: {
    color: COLORS.background,
    fontFamily: "GT-America-Standard-Black-Trial.otf",
    fontSize: 16,
    fontWeight: "bold",
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingIndicator: {
    marginLeft: 8,
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
  mapContainer: {
    height: 180,
    borderRadius: 12,
    overflow: "hidden",
  },
  map: {
    width: "100%",
    height: "100%",
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
