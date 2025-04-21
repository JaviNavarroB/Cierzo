import React from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  useWindowDimensions,
  StyleProp,
  ViewStyle,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Home, User } from "lucide-react-native";
import Svg, { Defs, ClipPath, Rect, G, Path } from "react-native-svg";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import LogoSVG from "../assets/images/LogoSVG.svg";
import { COLORS } from "@/constants/theme";
import { RootStackParamList } from "@/@types/routes.types";

interface FooterMenuProps {
  style?: StyleProp<ViewStyle>;
  isDark?: boolean;
}

type Navigation = NavigationProp<RootStackParamList>;

export function FooterMenu({ style, isDark = false }: FooterMenuProps) {
  const navigation = useNavigation<Navigation>();
  const insets = useSafeAreaInsets();
  const { width: FOOTER_WIDTH } = useWindowDimensions();

  const FOOTER_HEIGHT = 130;
  const CIRCLE_DIAMETER = 76;
  const CENTER_X = FOOTER_WIDTH / 2;

  const CIRCLE_RADIUS = 41.5;
  const CURVE_ADJUSTMENT = 15;

  const footerBackground = isDark ? COLORS.overlay.darker : COLORS.text.light;
  const centerButtonBg = isDark ? COLORS.text.light : COLORS.primary;
  const logoFill = isDark ? COLORS.text.black : COLORS.text.light;
  const iconColor = isDark ? COLORS.text.light : COLORS.primary;

  return (
    <View style={[styles.container, { bottom: insets.bottom }, style]}>
      <View
        style={[
          styles.footerContainer,
          { width: FOOTER_WIDTH },
          Platform.OS === "web" && styles.footerContainerWeb,
        ]}
      >
        <Svg
          width={FOOTER_WIDTH}
          height={FOOTER_HEIGHT}
          style={[
            styles.footerSvg,
            Platform.OS === "web" && styles.footerSvgWeb,
          ]}
        >
          <Defs>
            <ClipPath id="cut-out-circle" clipPathUnits="userSpaceOnUse">
              <Path
                d={`
                  M 0,20
                  H ${CENTER_X - CIRCLE_RADIUS - CURVE_ADJUSTMENT}
                  Q ${CENTER_X - CIRCLE_RADIUS} 20, ${
                  CENTER_X - CIRCLE_RADIUS
                } ${20 + CURVE_ADJUSTMENT}
                  A ${CIRCLE_RADIUS} ${CIRCLE_RADIUS} 0 1 0 ${
                  CENTER_X + CIRCLE_RADIUS
                } ${20 + CURVE_ADJUSTMENT}
                  Q ${CENTER_X + CIRCLE_RADIUS} 20, ${
                  CENTER_X + CIRCLE_RADIUS + CURVE_ADJUSTMENT
                } 20
                  H ${FOOTER_WIDTH}
                  V ${FOOTER_HEIGHT}
                  H 0
                  Z
                `}
              />
            </ClipPath>
          </Defs>

          <G clipPath="url(#cut-out-circle)">
            <Rect
              x={0}
              y={0}
              width={FOOTER_WIDTH}
              height={FOOTER_HEIGHT}
              fill={footerBackground}
            />
          </G>
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
        onPress={() => navigation.navigate("about")}
      >
        <LogoSVG
          width={350}
          height={350}
          fill={logoFill}
          style={styles.logoSvg}
        />
      </TouchableOpacity>

      <View
        style={[
          styles.iconsContainer,
          { paddingHorizontal: (FOOTER_WIDTH - CIRCLE_DIAMETER) / 2 - 18 },
        ]}
      >
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation.navigate("index")}
        >
          <Home size={34} color={iconColor} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.iconButton, { marginRight: -10 }]}
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
    left: 0,
    right: 0,
    height: 122,
  },
  footerContainer: {
    position: "absolute",
    height: 100,
    left: 0,
    top: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  footerContainerWeb: {
    shadowColor: "transparent",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  footerSvg: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  footerSvgWeb: {
    filter: "drop-shadow(0px -2px 4px rgba(0,0,0,0.25))",
    shadowColor: "transparent",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  centerButton: {
    position: "absolute",
    width: 76,
    height: 76,
    top: 3.5,
    borderRadius: 38,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 2,
  },
  logoSvg: {
    position: "absolute",
    top: -131,
    left: -140.5,
  },
  iconsContainer: {
    position: "absolute",
    height: 90,
    left: 0,
    top: 22,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
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
