import React from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Dimensions,
  Image,
  Platform,
} from "react-native";
import { Player } from "@/hooks/usePlayers";
import { COLORS } from "@/constants/theme";

interface Props {
  players: Player[];
}

export function PlayersSlider({ players }: Props) {
  const windowWidth = Dimensions.get("window").width;
  const isMobile = Platform.OS !== "web" || windowWidth < 768;
  console.log("PLAYERS EN SLIDER:", players);

  return (
    <View style={styles.container}>
      <Text style={[styles.title, isMobile && styles.titleMobile]}>
        Miembros
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
        decelerationRate="fast"
        snapToInterval={246}
        snapToAlignment="start"
      >
        {players.map((p) => (
          <View key={p.id} style={styles.card}>
            {p.foto ? (
              <Image
                source={{ uri: p.foto }}
                style={styles.playerImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.placeholder} />
            )}
            <Text style={styles.playerName} numberOfLines={1}>
              {p.nombre}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginVertical: 24 },
  title: { fontSize: 40, fontWeight: "900", color: "#BB4B36", marginLeft: 24 },
  titleMobile: { fontSize: 28 },
  scrollContainer: { paddingHorizontal: 24, paddingTop: 16 },
  card: {
    width: 220,
    height: 320,
    marginRight: 16,
    borderRadius: 15,
    overflow: "hidden",
    backgroundColor: "#eee",
    alignItems: "center",
  },
  playerImage: { width: "100%", height: 320 },
  placeholder: {
    width: "100%",
    height: 320,
    backgroundColor: "rgba(69,69,69,0.3)",
  },
  // Updated player name styling to match EventsSlider
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
});
