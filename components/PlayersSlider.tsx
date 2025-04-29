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

const windowWidth = Dimensions.get("window").width;
const isMobile = Platform.OS !== "web" || windowWidth < 768;

// Sample data for players (example with 2 real + 4 placeholders)
const players = [
  {
    id: "1",
    image: require("../assets/images/Player1.jpeg"),
    name: "Player 1",
  },
  {
    id: "2",
    image: require("../assets/images/Player1.jpeg"),
    name: "Player 2",
  },
  // Placeholder cards
  ...Array(4)
    .fill(null)
    .map((_, i) => ({
      id: `placeholder-${i + 1}`,
      image: null,
      name: `Player ${i + 3}`,
    })),
];

export function PlayersSlider() {
  return (
    <View style={styles.container}>
      <Text style={[styles.title, isMobile && styles.titleMobile]}>
        Miembros
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContainer,
          isMobile && styles.scrollContainerMobile,
        ]}
        decelerationRate="fast"
        snapToInterval={263 + 26} // Card width + margin
        snapToAlignment="start"
      >
        {players.map((player) => (
          <View key={player.id} style={styles.card}>
            {player.image ? (
              <Image
                source={player.image}
                style={styles.playerImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.placeholderCard} />
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: Platform.select({ web: 488, default: 400 }),
    marginTop: 32, // Negative margin to pull it up (optional)
    display: "flex",
  },
  title: {
    fontFamily: "GTAmericaTrial",
    fontWeight: "900",
    fontSize: 60,
    lineHeight: 75,
    color: "#BB4B36",
    marginLeft: 24,
    marginBottom: 16,
  },
  titleMobile: {
    fontSize: 40,
    lineHeight: 50,
  },
  scrollContainer: {
    marginTop: 32,
    paddingLeft: 24,
    paddingRight: 24,
  },
  scrollContainerMobile: {
    paddingLeft: 24,
    paddingRight: 24,
  },
  card: {
    width: 220,
    height: 280,
    marginRight: 16,
    borderRadius: 15,
    overflow: "hidden",
  },
  playerImage: {
    width: "100%",
    height: "100%",
    borderRadius: 15,
  },
  placeholderCard: {
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(69, 69, 69, 0.5)",
    borderRadius: 15,
  },
});
