// components/TeamsSlider.tsx
"use client";

import React from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  Dimensions,
  Platform,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { useEquipos, EquipoItem } from "@/hooks/useEquipos";
import SERVER_URL from "@/constants/Server";
import { COLORS } from "@/constants/theme";

interface Props {
  scrollRef?: React.RefObject<any>;
}

export function SportSlider({ scrollRef }: Props) {
  const { equipos, loading, error } = useEquipos();
  const windowWidth = Dimensions.get("window").width;
  const isMobile = Platform.OS !== "web" || windowWidth < 768;
  const router = useRouter();

  if (loading) return <Text style={styles.loading}>Cargando equipos…</Text>;
  if (error) return <Text style={styles.loading}>Error: {error.message}</Text>;

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
        decelerationRate="fast"
        snapToInterval={246}
        snapToAlignment="start"
      >
        {equipos.map((team: EquipoItem) => {
          const uri = `/sports/${team.foto}`;
          console.log(`Loading image: ${uri}`);

          return (
            <TouchableOpacity
              key={team.id}
              style={styles.card}
              onPress={() => router.push(`/sports/${team.id}`)}
              activeOpacity={0.8}
            >
              {team.foto ? (
                <Image
                  source={{ uri: team.foto }}
                  style={styles.playerImage}
                  resizeMode="cover"
                  onError={(e) =>
                    console.warn(
                      `Error loading image for team ${team.id}:`,
                      e.nativeEvent.error
                    )
                  }
                />
              ) : (
                <View style={styles.placeholder} />
              )}
              <Text style={styles.playerName} numberOfLines={1}>
                {team.nombre}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 24,
  },
  title: {
    fontSize: 40,
    fontWeight: "900",
    color: "#BB4B36",
    marginLeft: 24,
  },
  titleMobile: {
    fontSize: 28,
  },
  scrollContainer: {
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  card: {
    width: 220,
    height: 320,
    marginRight: 16,
    borderRadius: 15,
    overflow: "hidden",
    backgroundColor: "#eee",
    alignItems: "center",
  },
  playerImage: {
    width: "100%",
    height: 320,
  },
  placeholder: {
    width: "100%",
    height: 320,
    backgroundColor: "rgba(69,69,69,0.3)",
  },
  playerName: {
    position: "absolute",
    bottom: 25,
    right: 20,
    width: 125,
    textAlign: "right",
    color: COLORS.text.light,
    fontSize: 25,
    fontWeight: "900",
    zIndex: 999,
    textShadowRadius: 5,
    opacity: 0.8,
  },
  loading: {
    fontSize: 16,
    color: COLORS.text.dark,
    marginLeft: 24,
  },
});
