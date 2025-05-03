// components/SeccionHorarios.tsx

import React from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Image,
  Text,
  Platform,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome } from "@expo/vector-icons";
import { COLORS } from "@/constants/theme";

export interface HorarioItem {
  day: string;
  time?: string;
}

export interface PabellonInfo {
  nombre: string;
  direccion: string;
  descripcion: string;
  imagenUri?: string;
}

export interface CuotasInfo {
  mensual: number;
  anual: number;
}

interface Props {
  horario: HorarioItem[];
  activeTab: "horario" | "cuotas" | "pabellon";
  onTabChange: (tab: "horario" | "cuotas" | "pabellon") => void;
  cuotas: CuotasInfo;
  pabellon: PabellonInfo;
}

export default function SeccionHorarios({
  horario,
  activeTab,
  onTabChange,
  cuotas,
  pabellon,
}: Props) {
  const { width } = useWindowDimensions();
  const isMobile = Platform.OS !== "web" || width < 768;

  const renderContent = () => {
    if (activeTab === "pabellon") {
      return (
        <View style={styles.pabellonContainer}>
          {pabellon.imagenUri && (
            <Image
              source={{ uri: pabellon.imagenUri }}
              style={styles.pabellonImage}
              resizeMode="cover"
            />
          )}
          <View style={styles.pabellonInfo}>
            <Text style={styles.pabellonTitle}>{pabellon.nombre}</Text>
            <Text style={styles.pabellonAddress}>{pabellon.direccion}</Text>
            <Text style={styles.pabellonDescription}>
              {pabellon.descripcion}
            </Text>
          </View>
        </View>
      );
    }
    if (activeTab === "cuotas") {
      return (
        <View style={styles.cuotasContainer}>
          <View style={styles.cuotasContent}>
            <View style={styles.cuotasColumn}>
              <Text style={styles.priceNumber}>{cuotas.mensual}</Text>
              <Text style={styles.priceUnit}>euros/mes</Text>
              <Text style={styles.priceLabel}>ACTIVIDAD</Text>
            </View>
            <View style={styles.verticalDivider} />
            <View style={styles.cuotasColumn}>
              <Text style={styles.priceNumber}>{cuotas.anual}</Text>
              <Text style={styles.priceUnit}>euros/año</Text>
              <Text style={styles.priceLabel}>FEDERACIÓN</Text>
            </View>
          </View>
        </View>
      );
    }
    // horario
    return (
      <View style={styles.scheduleContainer}>
        {horario.map((item, i) => (
          <View key={i} style={styles.scheduleItem}>
            <Text style={styles.scheduleDay}>{item.day}</Text>
            {item.time && <Text style={styles.scheduleTime}>{item.time}</Text>}
          </View>
        ))}
        <View style={styles.infoRow}>
          <Text style={styles.infoText}>+ información en:</Text>
          <View style={styles.socialIcons}>
            <FontAwesome name="whatsapp" size={24} color={COLORS.primary} />
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
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[styles.headerRow]}>
          {(["horario", "cuotas", "pabellon"] as const).map((tab) => (
            <Text
              key={tab}
              onPress={() => onTabChange(tab)}
              style={[
                styles.navItem,
                activeTab === tab ? styles.navActive : styles.navInactive,
                tab === "horario" && styles.navLeft,
                tab === "pabellon" && styles.navRight,
              ]}
            >
              {tab === "horario"
                ? "Horario"
                : tab === "cuotas"
                ? "Cuotas"
                : "Pabellón"}
            </Text>
          ))}
        </View>
        {renderContent()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 0 },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 16,
  },
  navItem: {
    flex: 1,
    textAlign: "center",
    fontWeight: "800",
    fontSize: 18,
    paddingVertical: 8,
  },
  navActive: {
    color: COLORS.primary,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primary,
  },
  navInactive: {
    color: `${COLORS.primary}80`,
  },
  navLeft: { textAlign: "left" },
  navRight: { textAlign: "right" },

  // Horario styles
  scheduleContainer: { margin: 16 },
  scheduleItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: `${COLORS.primary}1A`,
  },
  scheduleDay: { fontSize: 20, fontWeight: "800", color: COLORS.primary },
  scheduleTime: { fontSize: 20, color: COLORS.primary },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    marginHorizontal: 16,
  },
  infoText: { fontSize: 16, color: COLORS.primary },
  socialIcons: { flexDirection: "row" },

  // Cuotas styles
  cuotasContainer: { margin: 16 },
  cuotasContent: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  cuotasColumn: { alignItems: "center" },
  priceNumber: { fontSize: 48, fontWeight: "900", color: COLORS.primary },
  priceUnit: { fontSize: 16, color: `${COLORS.primary}80` },
  priceLabel: { fontSize: 16, color: COLORS.primary, marginTop: 4 },
  verticalDivider: {
    width: 1,
    backgroundColor: `${COLORS.primary}1A`,
    marginHorizontal: 16,
  },

  // Pabellón styles
  pabellonContainer: { margin: 16 },
  pabellonImage: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginBottom: 12,
  },
  pabellonInfo: {},
  pabellonTitle: { fontSize: 24, fontWeight: "800", color: COLORS.primary },
  pabellonAddress: { fontSize: 16, color: COLORS.primary },
  pabellonDescription: { fontSize: 14, color: `${COLORS.primary}CC` },
});
