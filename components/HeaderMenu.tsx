import {
  StyleSheet,
  View,
  TouchableOpacity,
  Platform,
  Text,
} from "react-native";
import { Menu } from "lucide-react-native";
import { COLORS } from "@/constants/theme";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "@/@types/routes.types";
interface HeaderMenuProps {
  isDark?: boolean;
}
type Navigation = NavigationProp<RootStackParamList>;

const navigation = useNavigation<Navigation>();
export function HeaderMenu({ isDark = false }: HeaderMenuProps) {
  // En modo claro: fondo = primary (rojo) y logo = text.light (claro)
  // En modo oscuro: fondo = text.light (claro) y logo = text.dark (oscuro)
  const headerBackground = isDark ? COLORS.text.light : COLORS.primary;
  const logoColor = isDark ? COLORS.text.black : COLORS.text.light;
  const menuIconColor = isDark ? COLORS.text.black : "#FDF5EA"; // o podrías usar logoColor

  return (
    <View style={styles.container}>
      <View style={[styles.header, { backgroundColor: headerBackground }]}>
        <View>
          <View>
            <Text style={[styles.logo, { color: logoColor }]}>Cierzo</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => navigation.navigate("profile")}
        >
          <Menu size={28} color={menuIconColor} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    width: "100%",
    height: 100,
    left: 0,
    top: 0,
    zIndex: 10,
    alignContent: "center",
  },
  header: {
    position: "absolute",
    width: "100%",
    height: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    fontFamily: "DancingScript_700Bold",
    fontSize: 40,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 25,
  },
  menuButton: {
    position: "absolute",
    right: 20,
    top: Platform.OS === "ios" ? 50 : 17,
    width: 28,
    height: 28,
    justifyContent: "center",
    alignItems: "center",
  },
});
