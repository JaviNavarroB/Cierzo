import React from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Platform,
  Dimensions,
} from "react-native";
import { Home, User } from "lucide-react-native";
import Svg, { Path, Defs, ClipPath, Rect } from "react-native-svg";
import { StyleProp, ViewStyle } from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import LogoSVG from "../assets/images/LogoSVG.svg";
import { COLORS } from "@/constants/theme";
import { RootStackParamList } from "@/@types/routes.types";
interface FooterMenuProps {
  style?: StyleProp<ViewStyle>;
  isDark?: boolean;
}

export function FooterMenu({ style, isDark = false }: FooterMenuProps) {
  type Navigation = NavigationProp<RootStackParamList>;
  const navigation = useNavigation<Navigation>();

  const FOOTER_WIDTH = Dimensions.get("window").width;
  const FOOTER_HEIGHT = 120;
  const CIRCLE_DIAMETER = 76;
  const CENTER_X = FOOTER_WIDTH / 2;

  // Radio del círculo de recorte
  const CIRCLE_RADIUS = 41.5;
  // Ajuste para suavizar las curvas
  const CURVE_ADJUSTMENT = 15;

  // En modo oscuro:
  //   - Fondo del footer: oscuro (COLORS.overlay.darker)
  //   - Círculo: claro (COLORS.text.light)
  //   - LogoSVG: oscuro (COLORS.text.dark)
  //   - Íconos: claros (COLORS.text.light)
  // En modo claro:
  //   - Fondo del footer: claro (COLORS.text.light)
  //   - Círculo: rojo (COLORS.primary)
  //   - LogoSVG: claro (COLORS.text.light)
  //   - Íconos: rojos (COLORS.primary)
  const footerBackground = isDark ? COLORS.overlay.darker : COLORS.text.light;
  const centerButtonBg = isDark ? COLORS.text.light : COLORS.primary;
  const logoFill = isDark ? COLORS.text.black : COLORS.text.light;
  const iconColor = isDark ? COLORS.text.light : COLORS.primary;

  return (
    <View style={[styles.container, style, { left: 0, right: 0 }]}>
      <View style={[styles.footerContainer, { width: FOOTER_WIDTH }]}>
        <Svg
          width={FOOTER_WIDTH}
          height={FOOTER_HEIGHT}
          style={styles.footerSvg}
        >
          <Defs>
            <ClipPath id="cut-out-circle">
              {/* Fondo del footer con esquinas redondeadas */}
              <Rect
                x="0"
                y="20"
                width={FOOTER_WIDTH}
                height={FOOTER_HEIGHT}
                rx="10"
                ry="10"
              />
              {/* 
                Nuevo path para el recorte con bordes suavizados
                Utilizamos curvas bezier para crear una transición suave
              */}
              <Path
                transform="translate(0,20)"
                d={`
                  M ${CENTER_X - CIRCLE_RADIUS - CURVE_ADJUSTMENT} 0
                  Q ${CENTER_X - CIRCLE_RADIUS} 0, ${
                  CENTER_X - CIRCLE_RADIUS
                } ${CURVE_ADJUSTMENT}
                  A ${CIRCLE_RADIUS},${CIRCLE_RADIUS} 0 1,0 ${
                  CENTER_X + CIRCLE_RADIUS
                } ${CURVE_ADJUSTMENT}
                  Q ${CENTER_X + CIRCLE_RADIUS} 0, ${
                  CENTER_X + CIRCLE_RADIUS + CURVE_ADJUSTMENT
                } 0
                `}
              />
            </ClipPath>
          </Defs>

          <Rect
            x="0"
            y="0"
            width={FOOTER_WIDTH}
            height={FOOTER_HEIGHT}
            fill={footerBackground}
            clipPath="url(#cut-out-circle)"
          />
        </Svg>
      </View>

      <TouchableOpacity
        style={[
          styles.centerButton,
          {
            backgroundColor: centerButtonBg,
            left: (FOOTER_WIDTH - CIRCLE_DIAMETER) / 2,
          },
        ]}
        onPress={() => navigation.navigate("event")}
      >
        <LogoSVG
          width={350}
          height={350}
          fill={logoFill}
          style={{
            position: "absolute",
            top: -131, // Ajustado para posicionar correctamente el LogoSVG
            left: -140.5,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.5,
            shadowRadius: 4,
            elevation: 5,
          }}
        />
      </TouchableOpacity>

      <View style={[styles.iconsContainer, { left: 0, right: 0 }]}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation.navigate("index")}
        >
          <Home size={34} color={iconColor} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation.navigate("deporte")}
        >
          <User size={30} color={iconColor} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    height: 112,
    top: Platform.OS === "ios" ? 740 : 700,
  },
  footerContainer: {
    position: "absolute",
    height: 90,
    left: 0,
    top: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  footerSvg: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  centerButton: {
    position: "absolute",
    width: 76,
    height: 76,
    top: 3.5, // Ajusta este valor para posicionar el círculo
    borderRadius: 38,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 2,
  },
  iconsContainer: {
    position: "absolute",
    height: 90,
    left: 0,
    top: 22,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 66,
    alignItems: "center",
    zIndex: 1,
  },
  iconButton: {
    width: 37,
    height: 34,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default FooterMenu;
