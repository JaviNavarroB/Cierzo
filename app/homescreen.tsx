"use client";

import React, { useRef, useEffect, useState } from "react";
import {
  StyleSheet,
  Animated,
  Platform,
  View,
  Text,
  useWindowDimensions,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { HeaderMenu } from "@/components/HeaderMenu";
import { SportSlider } from "@/components/SportsSlider";
import { EventsSlider } from "@/components/EventsSlider";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import GallerySlider from "@/components/GallerySlider";
import { FooterMenu } from "@/components/FooterMenu";
import { COLORS } from "@/constants/theme";
import BackgroundPattern from "@/assets/images/BackgroundPattern.svg";
import { LinearGradient } from "expo-linear-gradient";
import { ArrowRight, ChevronDown } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { StatusBar } from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "@/@types/routes.types";
import { useAuthExported } from "@/contexts/AuthContext";

// Override useLayoutEffect with useEffect on the server
if (typeof window === "undefined") {
  React.useLayoutEffect = React.useEffect;
}
type Navigation = NavigationProp<RootStackParamList>;
export default function HomeScreen() {
  const { user } = useAuthExported(); // ← 1. Usuario actual
  const isInvitado = !user || user.id_rol === 1; // ← 2. Es invitado
  const { width, height } = useWindowDimensions();
  const isMobile = Platform.OS !== "web" || width < 768;
  const navigation = useNavigation<Navigation>();
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const titleAnim = useRef(new Animated.Value(0)).current;
  const descriptionAnim = useRef(new Animated.Value(0)).current;
  const joinAnim = useRef(new Animated.Value(0)).current;
  const scrollY = useRef(new Animated.Value(0)).current;
  const scrollRef = useRef<any>(null);

  // Animation values for section headings
  const eventsSectionAnim = useRef(new Animated.Value(0)).current;
  const sportsSectionAnim = useRef(new Animated.Value(0)).current;
  const gallerySectionAnim = useRef(new Animated.Value(0)).current;

  // State for section visibility tracking
  const [activeSection, setActiveSection] = useState("hero");
  const sectionRefs = {
    hero: useRef<View>(null),
    events: useRef<View>(null),
    sports: useRef<View>(null),
    gallery: useRef<View>(null),
  };

  // State for gallery Y position
  const [galleryY, setGalleryY] = useState(0);

  // Scroll to section function
  const scrollToSection = (section: keyof typeof sectionRefs) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (scrollRef.current && sectionRefs[section]?.current) {
      sectionRefs[section].current.measureLayout(
        scrollRef.current,
        (x: number, y: number) => {
          scrollRef.current.scrollTo({ y: y - 80, animated: true });
        },
        () => console.log("Failed to measure")
      );
    }
    setActiveSection(section);
  };

  // Remove derived animation and create new animated value
  const scrollIndicatorValue = useRef(new Animated.Value(1)).current;

  // Handle section animations on scroll
  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    {
      useNativeDriver: false,
      listener: (event: any) => {
        const y = event.nativeEvent.contentOffset.y;

        // Animate sections as they come into view
        if (y > 300 && y < 800) {
          Animated.timing(eventsSectionAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }).start();
        }

        if (y > 700 && y < 1200) {
          Animated.timing(sportsSectionAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }).start();
        }

        if (y > 1100) {
          Animated.timing(gallerySectionAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }).start();
        }
      },
    }
  );

  // Run entrance animations
  useEffect(() => {
    Animated.stagger(200, [
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(titleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(descriptionAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(joinAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Setup scroll indicator animation
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(scrollIndicatorValue, {
          toValue: 0.7,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(scrollIndicatorValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    pulseAnimation.start();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar backgroundColor={COLORS.text.dark} barStyle="light-content" />
      <SafeAreaView
        style={[
          styles.wholeScreen,
          {
            backgroundColor: COLORS.background,
          },
        ]}
        edges={["top", "left", "right"]}
      >
        <HeaderMenu />

        {/* Changed to Animated.ScrollView to properly support onScroll animated events */}
        <Animated.ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.scrollContent}
          bounces={false}
          scrollEventThrottle={16}
          onScroll={handleScroll}
        >
          {/* Hero Section */}
          <View
            ref={sectionRefs.hero}
            style={[styles.fullScreenSection, { height: height * 0.9 }]}
          >
            <Animated.View
              style={[styles.backgroundContainer, { opacity: fadeAnim }]}
            >
              <BackgroundPattern
                width="100%"
                height="100%"
                preserveAspectRatio="xMidYMid slice"
              />
              <LinearGradient
                colors={["transparent", "rgba(251, 245, 231, 0.1)", "#fbf5e7"]}
                style={styles.gradient}
              />
            </Animated.View>

            <View style={styles.content}>
              <Animated.Text
                style={[
                  styles.title,
                  {
                    opacity: titleAnim,
                    transform: [
                      {
                        translateY: titleAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [30, 0],
                        }),
                      },
                    ],
                  },
                ]}
              >
                Deporte y comunidad en un solo lugar
              </Animated.Text>

              <Animated.Text
                style={[
                  styles.description,
                  styles.justifiedText,
                  {
                    opacity: descriptionAnim,
                    transform: [
                      {
                        translateY: descriptionAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [20, 0],
                        }),
                      },
                    ],
                  },
                ]}
              >
                Únete a nosotros y descubre el placer de crecer a través del
                deporte en un ambiente inclusivo y motivador.
              </Animated.Text>
              {isInvitado && (
                <Animated.View
                  style={{
                    opacity: joinAnim,
                    transform: [
                      {
                        translateY: joinAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [20, 0],
                        }),
                      },
                    ],
                  }}
                >
                  <TouchableOpacity
                    style={styles.joinButton}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                      navigation.navigate("member");
                    }}
                  >
                    <Text style={styles.joinButtonText}>Únete ahora</Text>
                    <ArrowRight size={18} color={COLORS.text.light} />
                  </TouchableOpacity>
                </Animated.View>
              )}
            </View>

            {/* Scroll indicator */}
            <Animated.View
              style={[
                styles.scrollIndicator,
                {
                  opacity: scrollIndicatorValue,
                  transform: [
                    {
                      translateY: scrollIndicatorValue.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 10],
                      }),
                    },
                  ],
                },
              ]}
            >
              <ChevronDown size={28} color={COLORS.primary} />
              <Text style={styles.scrollText}>Desliza para ver más</Text>
            </Animated.View>
          </View>

          {/* Events Section */}
          <View ref={sectionRefs.events} style={styles.section}>
            <Animated.View
              style={[
                styles.sectionHeaderWrapper,
                {
                  opacity: eventsSectionAnim,
                  transform: [
                    {
                      translateY: eventsSectionAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [20, 0],
                      }),
                    },
                  ],
                },
              ]}
            >
              <Text style={styles.sectionTitle}>Próximos Eventos</Text>
              <Text style={styles.sectionSubtitle}>
                Descubre y participa en nuestras actividades
              </Text>
              <Text style={styles.sectionDescription}>
                Explora todos los eventos deportivos que organizamos a lo largo
                del año. Desde torneos competitivos hasta actividades
                recreativas, tenemos opciones para todas las edades y niveles de
                habilidad.
              </Text>
            </Animated.View>

            <EventsSlider />
          </View>

          {/* Sports Section */}
          <View ref={sectionRefs.sports} style={styles.section}>
            <Animated.View
              style={[
                styles.sectionHeaderWrapper,
                {
                  opacity: sportsSectionAnim,
                  transform: [
                    {
                      translateY: sportsSectionAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [20, 0],
                      }),
                    },
                  ],
                },
              ]}
            >
              <Text style={styles.sectionTitle}>Nuestros Deportes</Text>
              <Text style={styles.sectionSubtitle}>
                Variedad de disciplinas para todos los gustos
              </Text>
              <Text style={styles.sectionDescription}>
                Ofrecemos una amplia gama de disciplinas deportivas adaptadas a
                diferentes preferencias y niveles. Desde deportes de equipo que
                fomentan la colaboración hasta actividades individuales para el
                desarrollo personal.
              </Text>
            </Animated.View>

            <SportSlider scrollRef={scrollRef} />
          </View>

          {/* Gallery Section */}
          <View
            ref={sectionRefs.gallery}
            style={styles.section}
            onLayout={(e) => {
              setGalleryY(e.nativeEvent.layout.y);
            }}
          >
            <Animated.View
              style={[
                styles.sectionHeaderWrapper,
                {
                  opacity: gallerySectionAnim,
                  transform: [
                    {
                      translateY: gallerySectionAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [20, 0],
                      }),
                    },
                  ],
                },
              ]}
            >
              <Text style={styles.sectionTitle}>Galería</Text>
              <Text style={styles.sectionSubtitle}>
                Momentos memorables de nuestra comunidad
              </Text>
              <Text style={styles.sectionDescription}>
                Explora nuestra colección de fotografías que capturan la esencia
                de nuestros eventos y competiciones. Cada imagen refleja el
                espíritu deportivo, la camaradería y los logros de nuestra
                comunidad.
              </Text>
            </Animated.View>

            <GallerySlider scrollRef={scrollRef} />
          </View>

          {/* Call to action section */}
          {isInvitado && (
            <View style={styles.ctaSection}>
              <LinearGradient
                colors={[COLORS.primary, "#9a3d2d"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.ctaGradient}
              >
                <Text style={styles.ctaTitle}>¿Listo para unirte?</Text>
                <Text style={styles.ctaDescription}>
                  Forma parte de nuestra comunidad deportiva y disfruta de todos
                  los beneficios
                </Text>
                <TouchableOpacity
                  style={styles.ctaButton}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    navigation.navigate("member");
                  }}
                >
                  <Text style={styles.ctaButtonText}>Inscríbete</Text>
                </TouchableOpacity>
              </LinearGradient>
            </View>
          )}
        </Animated.ScrollView>

        <FooterMenu style={styles.footerMenu} />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  wholeScreen: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 120,
    top: -60, // Space for footer
  },
  footerMenu: {
    position: "absolute",
    left: 0,
    right: 0,
    marginTop: -40,
  },
  fullScreenSection: {
    position: "relative",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  backgroundContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },
  gradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "50%",
  },
  content: {
    zIndex: 1,
    paddingHorizontal: 24,
    alignItems: "center",
    width: "100%",
    maxWidth: 800,
  },
  title: {
    width: "95%",
    fontSize: 50,
    fontWeight: "900",
    color: COLORS.text.dark,
    textAlign: "center",
    lineHeight: 55,
    fontFamily: "GT-America-Standard-Black-Trial.otf",
    letterSpacing: -1,
    paddingHorizontal: 10,
    top: -40,
    textShadowColor: "rgba(0,0,0,0.05)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  description: {
    top: -25,
    paddingHorizontal: 16,
    fontSize: 18,
    lineHeight: 32,
    color: COLORS.text.dark,
    opacity: 0.8,
    letterSpacing: 0.75,
    marginTop: 15,
    textAlign: "center",
    marginBottom: 12,
    maxWidth: 600,
    fontFamily: "GT-America-Standard-Black-Trial.otf",
  },
  justifiedText: {
    textAlign: "center",
  },
  joinButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  joinButtonText: {
    color: COLORS.text.light,
    fontSize: 18,
    fontWeight: "600",
    marginRight: 8,
  },
  scrollIndicator: {
    position: "absolute",
    bottom: 85,
    alignItems: "center",
  },
  scrollText: {
    color: COLORS.primary,
    fontSize: 14,
    marginTop: 8,
    fontWeight: "500",
  },
  // Updated section styles for even and aesthetic spacing:
  section: {
    paddingTop: 40,
    paddingBottom: 40, // Increased bottom padding for separation
    paddingHorizontal: 16,
    marginBottom: 20, // Margin between sections
  },
  sectionHeaderWrapper: {
    marginBottom: 32, // Increased bottom margin for header
    paddingHorizontal: 8,
  },
  sectionTitle: {
    fontSize: 32,
    fontWeight: "800",
    color: COLORS.primary,
    fontFamily: "GT-America-Standard-Black-Trial.otf",
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text.dark,
    opacity: 0.8,
    marginBottom: 16,
    letterSpacing: 0.3,
  },
  sectionDescription: {
    fontSize: 16,
    lineHeight: 26,
    color: COLORS.text.dark,
    opacity: 0.75,
    letterSpacing: 0.2,
    paddingTop: 8,
    paddingBottom: 8,
    borderTopWidth: 1,
    borderTopColor: "rgba(187, 75, 54, 0.15)",
    paddingLeft: 2,
    fontFamily: "GT-America-Standard-Black-Trial.otf",
  },
  ctaSection: {
    paddingHorizontal: 16,
    paddingVertical: 40,
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
});
