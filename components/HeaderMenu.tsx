"use client";

import { useState, useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Pressable,
  Platform,
  Image,
  Text,
  useWindowDimensions,
  StatusBar,
} from "react-native";
import {
  type NavigationProp,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import type { RootStackParamList } from "@/@types/routes.types";
import { COLORS } from "@/constants/theme";
import { Menu, X } from "lucide-react-native";

interface HeaderMenuProps {
  isDark?: boolean;
}

type Navigation = NavigationProp<RootStackParamList>;

export function HeaderMenu({ isDark = false }: HeaderMenuProps) {
  const navigation = useNavigation<Navigation>();
  const route = useRoute();
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === "web" && width >= 768;

  // Estado y animaciones
  const [open, setOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const menuAnimation = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const indicatorAnim = useRef(new Animated.Value(0)).current;

  // Cerrar menú al cambiar a vista desktop
  useEffect(() => {
    if (isDesktop && open) {
      setOpen(false);
    }
  }, [isDesktop, width]);

  // Determinar la ruta actual para resaltar el elemento de menú activo
  const currentRoute = route.name as keyof RootStackParamList;

  // Animación del indicador de página activa
  useEffect(() => {
    Animated.timing(indicatorAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [currentRoute]);

  const toggleMenu = () => {
    setOpen((prev) => !prev);
    Animated.timing(menuAnimation, {
      toValue: open ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const navigate = (routeName: keyof RootStackParamList) => {
    if (open) {
      toggleMenu();
    }

    // Solo navegar si no estamos ya en esa ruta
    if (currentRoute !== routeName) {
      // Animar salida del indicador actual
      Animated.timing(indicatorAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        navigation.navigate(routeName);
      });
    }
  };

  // Animación al hacer scroll
  const handleScroll = (offset: number) => {
    Animated.timing(fadeAnim, {
      toValue: offset > 50 ? 0.95 : 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  // Transformaciones para animación del menú móvil
  const translateY = menuAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [-20, 0],
  });

  const opacity = menuAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  // Función para manejar hover en web
  const handleHover = (item: string | null) => {
    if (Platform.OS === "web") {
      setHoveredItem(item);
    }
  };

  return (
    <>
      <Animated.View
        style={[
          styles.container,
          {
            backgroundColor: COLORS.primary,
            opacity: fadeAnim,
          },
        ]}
      >
        {/* Logo (centro) */}
        <View style={styles.logoContainer}>
          <TouchableOpacity
            onPress={() => navigate("index")}
            style={styles.logoButton}
          >
            <Image
              source={require("../assets/images/LogoLetras.png")}
              style={[
                styles.logo,
                { tintColor: COLORS.background },
                hoveredItem === "logo" && styles.logoHovered,
              ]}
            />
          </TouchableOpacity>
        </View>

        {/* Menú de navegación para desktop */}
        {isDesktop && (
          <View style={styles.desktopNav}>
            <TouchableOpacity
              style={[styles.navItem]}
              onPress={() => navigate("index")}
            >
              <Text
                style={[
                  styles.navText,
                  currentRoute === "index" && styles.activeNavText,
                  hoveredItem === "index" && styles.hoveredNavText,
                ]}
              >
                Inicio
              </Text>
              {currentRoute === "index" && (
                <Animated.View
                  style={[
                    styles.activeIndicator,
                    {
                      opacity: indicatorAnim,
                      transform: [{ scaleX: indicatorAnim }],
                    },
                  ]}
                />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.navItem]}
              onPress={() => navigate("about")}
            >
              <Text
                style={[
                  styles.navText,
                  currentRoute === "about" && styles.activeNavText,
                  hoveredItem === "about" && styles.hoveredNavText,
                ]}
              >
                Sobre nosotros
              </Text>
              {currentRoute === "about" && (
                <Animated.View
                  style={[
                    styles.activeIndicator,
                    {
                      opacity: indicatorAnim,
                      transform: [{ scaleX: indicatorAnim }],
                    },
                  ]}
                />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.navItem]}
              onPress={() => navigate("profile")}
            >
              <Text
                style={[
                  styles.navText,
                  currentRoute === "profile" && styles.activeNavText,
                  hoveredItem === "profile" && styles.hoveredNavText,
                ]}
              >
                Perfil
              </Text>
              {currentRoute === "profile" && (
                <Animated.View
                  style={[
                    styles.activeIndicator,
                    {
                      opacity: indicatorAnim,
                      transform: [{ scaleX: indicatorAnim }],
                    },
                  ]}
                />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.navItem]}
              onPress={() => navigate("deportes")}
            >
              <Text
                style={[
                  styles.navText,
                  currentRoute === "deportes" && styles.activeNavText,
                  hoveredItem === "deportes" && styles.hoveredNavText,
                ]}
              >
                Deportes
              </Text>
              {currentRoute === "deportes" && (
                <Animated.View
                  style={[
                    styles.activeIndicator,
                    {
                      opacity: indicatorAnim,
                      transform: [{ scaleX: indicatorAnim }],
                    },
                  ]}
                />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.navItem]}
              onPress={() => navigate("eventos")}
            >
              <Text
                style={[
                  styles.navText,
                  currentRoute === "eventos" && styles.activeNavText,
                  hoveredItem === "eventos" && styles.hoveredNavText,
                ]}
              >
                Eventos
              </Text>
              {currentRoute === "eventos" && (
                <Animated.View
                  style={[
                    styles.activeIndicator,
                    {
                      opacity: indicatorAnim,
                      transform: [{ scaleX: indicatorAnim }],
                    },
                  ]}
                />
              )}
            </TouchableOpacity>
          </View>
        )}

        {/* Menú desplegable para móvil */}
        {!isDesktop && (
          <>
            <View style={styles.emptySpace} />
            <TouchableOpacity
              style={styles.menuButton}
              onPress={toggleMenu}
              accessibilityLabel="Menú"
            >
              <View
                style={[
                  styles.menuButtonCircle,
                  hoveredItem === "menu" && styles.menuButtonCircleHovered,
                  open && styles.menuButtonCircleActive,
                ]}
              >
                {open ? (
                  <X size={20} color={COLORS.primary} />
                ) : (
                  <Menu
                    size={20}
                    color={
                      hoveredItem === "menu"
                        ? COLORS.primary
                        : COLORS.background
                    }
                  />
                )}
              </View>
            </TouchableOpacity>
          </>
        )}

        {!isDesktop && open && (
          <View style={styles.mobileMenuContainer}>
            {/* Backdrop */}
            <Pressable style={styles.backdrop} onPress={toggleMenu} />

            {/* Menú */}
            <Animated.View
              style={[
                styles.mobileMenu,
                {
                  transform: [{ translateY }],
                  opacity,
                },
              ]}
            >
              <TouchableOpacity
                style={[
                  styles.mobileMenuItem,
                  currentRoute === "index" && styles.activeMobileMenuItem,
                ]}
                onPress={() => navigate("index")}
              >
                <Text
                  style={[
                    styles.mobileMenuText,
                    currentRoute === "index" && styles.activeMobileMenuText,
                  ]}
                >
                  Inicio
                </Text>
                {currentRoute === "index"}
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.mobileMenuItem,
                  currentRoute === "about" && styles.activeMobileMenuItem,
                ]}
                onPress={() => navigate("about")}
              >
                <Text
                  style={[
                    styles.mobileMenuText,
                    currentRoute === "about" && styles.activeMobileMenuText,
                  ]}
                >
                  Sobre nosotros
                </Text>
                {currentRoute === "about"}
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.mobileMenuItem,
                  currentRoute === "profile" && styles.activeMobileMenuItem,
                ]}
                onPress={() => navigate("profile")}
              >
                <Text
                  style={[
                    styles.mobileMenuText,
                    currentRoute === "profile" && styles.activeMobileMenuText,
                  ]}
                >
                  Perfil
                </Text>
                {currentRoute === "profile"}
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.mobileMenuItem,
                  currentRoute === "deportes" && styles.activeMobileMenuItem,
                ]}
                onPress={() => navigate("deportes")}
              >
                <Text
                  style={[
                    styles.mobileMenuText,
                    currentRoute === "deportes" && styles.activeMobileMenuText,
                  ]}
                >
                  Deportes
                </Text>
                {currentRoute === "deportes"}
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.mobileMenuItem,
                  currentRoute === "eventos" && styles.activeMobileMenuItem,
                ]}
                onPress={() => navigate("eventos")}
              >
                <Text
                  style={[
                    styles.mobileMenuText,
                    currentRoute === "eventos" && styles.activeMobileMenuText,
                  ]}
                >
                  Eventos
                </Text>
                {currentRoute === "eventos"}
              </TouchableOpacity>
            </Animated.View>
          </View>
        )}
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: Platform.OS === "web" ? 70 : 90, // Reduced height
    paddingTop: Platform.OS === "web" ? 0 : 35, // Reduced top padding
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    zIndex: 100,
    position: "relative",
  },
  // Logo
  logoContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 0,
  },
  logoButton: {
    paddingVertical: 10,
  },
  logo: {
    width: 120,
    height: 40,
    resizeMode: "contain",
  },
  logoHovered: {
    transform: [{ scale: 1.05 }],
  },
  // Espacio vacío para equilibrar el layout en móvil
  emptySpace: {
    width: 40,
    height: 40,
    zIndex: 1,
  },
  // Estilos para navegación desktop
  desktopNav: {
    flexDirection: "row",
    alignItems: "center",
  },
  navItem: {
    marginLeft: 40,
    position: "relative",
    paddingBottom: 2, // Reduced bottom padding
    paddingTop: 2, // Reduced top padding
  },
  navText: {
    fontSize: 16,
    color: `rgba(${COLORS.background},0.7)`,
    fontWeight: "400",
    letterSpacing: 0.3,
  },
  activeNavText: {
    color: COLORS.background,
    fontWeight: "500",
  },
  hoveredNavText: {
    color: COLORS.background,
  },
  activeIndicator: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
    height: 1,
    backgroundColor: COLORS.background,
    transformOrigin: "left",
  },
  // Estilos para botón de menú móvil
  menuButton: {
    padding: 8,
    zIndex: 1,
    position: "absolute",
    right: 24,
  },
  menuButtonCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.background,
  },
  menuButtonCircleHovered: {
    backgroundColor: COLORS.background,
  },
  menuButtonCircleActive: {
    backgroundColor: COLORS.background,
  },
  // Estilos para menú móvil
  mobileMenuContainer: {
    position: "absolute",
    top: Platform.OS === "web" ? 70 : 70, // Match new container height
    left: 0,
    right: 0,
    zIndex: 100,
  },
  backdrop: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.1)",
    zIndex: -1,
  },
  mobileMenu: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    position: "relative",
    overflow: "hidden",
  },
  mobileMenuItem: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    position: "relative",
  },
  activeMobileMenuItem: {
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  mobileMenuText: {
    fontSize: 16,
    color: `rgba(${COLORS.background},0.7)`,
    letterSpacing: 0.3,
  },
  activeMobileMenuText: {
    color: COLORS.background,
    fontWeight: "500",
  },
});
