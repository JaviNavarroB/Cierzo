// components/PlayersSlider.tsx

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

interface Props {
  players: Player[];
}

export function PlayersSlider({ players }: Props) {
  const windowWidth = Dimensions.get("window").width;
  const isMobile = Platform.OS !== "web" || windowWidth < 768;

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
            {p.imageUri ? (
              <Image
                source={{ uri: p.imageUri }}
                style={styles.playerImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.placeholder} />
            )}
          </View>
        ))}
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
  titleMobile: { fontSize: 28 },
  scrollContainer: {
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  card: {
    width: 220,
    height: 280,
    marginRight: 16,
    borderRadius: 15,
    overflow: "hidden",
    backgroundColor: "#eee",
  },
  playerImage: {
    width: "100%",
    height: "100%",
  },
  placeholder: {
    flex: 1,
    backgroundColor: "rgba(69,69,69,0.3)",
  },
});
