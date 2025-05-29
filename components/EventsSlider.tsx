// frontend/src/components/EventsSlider.tsx

import React from "react";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  Image,
  Platform,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSharedValue } from "react-native-reanimated";
import Carousel, { Pagination } from "react-native-reanimated-carousel";
import { COLORS } from "@/constants/theme";
import { useEvents } from "@/hooks/useEvents";
import { useRouter } from "expo-router"; // Import useRouter for navigation
import { useAuthExported } from "@/contexts/AuthContext"; // Import your auth context

const windowWidth = Dimensions.get("window").width;
const isMobile = Platform.OS !== "web" || windowWidth < 768;

export function EventsSlider(): JSX.Element {
  const { user } = useAuthExported(); // o tu contexto de auth
  console.log("→ render EventsSlider. user.rol =", user?.rol); // 👈
  const cardWidth = 325;
  const cardHeight = 475;
  const progress = useSharedValue<number>(0);
  const router = useRouter(); // Get the router instance

  // Use the custom hook to fetch events from the backend

  const { events, loading, error } = useEvents();
  console.log("ROL ACTUAL DEL USUARIO:", user?.rol);
  console.log("EVENTOS:", events);
  const eventosAdmitidos =
    user && user.rol
      ? events.filter((e) =>
          String(e.roles_admitidos || "")
            .split(",")
            .map((r) => r.trim().toLowerCase())
            .includes(user.rol.toLowerCase())
        )
      : [];
  console.log("ROL ACTUAL DEL USUARIO:", user?.rol);
  console.log("EVENTOS:", events);
  // Handle loading or error states
  if (loading) {
    return (
      <Text style={{ textAlign: "center", marginTop: 40 }}>
        Loading events...
      </Text>
    );
  }
  if (error) {
    return (
      <Text style={{ color: "red", textAlign: "center", marginTop: 40 }}>
        Error loading events: {error.message}
      </Text>
    );
  }
  if (events.length === 0) {
    return (
      <Text style={{ textAlign: "center", marginTop: 40 }}>
        No events available.
      </Text>
    );
  }

  // Map fetched events to the shape your carousel expects
  const dataForCarousel = eventosAdmitidos.map((evt) => ({
    id: evt.id.toString(),
    // Replace this placeholder image with your event image URL when ready:
    image: require("../assets/images/Poster1.jpeg"),
    name: evt.titulo || "Evento sin título",
  }));
  if (eventosAdmitidos.length === 0) {
    return (
      <Text style={{ textAlign: "center", marginTop: 40 }}>
        No hay eventos disponibles para tu rol.
      </Text>
    );
  }
  const onPressPagination = (index: number) => {
    progress.value = index;
  };

  return (
    <View style={styles.container}>
      <Carousel
        width={cardWidth}
        height={cardHeight}
        data={dataForCarousel}
        onProgressChange={progress}
        vertical={false}
        mode="parallax"
        modeConfig={{
          parallaxScrollingScale: 1,
          parallaxScrollingOffset: 0, //-15,
        }}
        onConfigurePanGesture={(gestureChain) =>
          gestureChain.activeOffsetX([-10, 10])
        }
        renderItem={({ item }) => (
          // Wrap the card in TouchableOpacity and navigate on press.
          <TouchableOpacity
            onPress={() => {
              // Navigate to the dynamic route. For example, if your event page file is [id].tsx,
              // pushing `/events/{id}` should load that page.
              router.push(`/events/${item.id}`);
            }}
          >
            <View style={styles.card}>
              {item.image ? (
                <View style={{ flex: 1 }}>
                  <Image
                    source={item.image}
                    style={styles.playerImage}
                    resizeMode="cover"
                  />
                  <Text style={styles.playerName}>{item.name}</Text>
                  <LinearGradient
                    colors={["transparent", "rgba(0,0,0,0.9)"]}
                    style={styles.gradient}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 1 }}
                  />
                </View>
              ) : (
                <View style={styles.placeholderCard} />
              )}
            </View>
          </TouchableOpacity>
        )}
      />
      <Pagination.Basic
        progress={progress}
        data={dataForCarousel}
        dotStyle={{
          backgroundColor: "rgba(253, 245, 234, 0.6)",
          borderRadius: 50,
        }}
        activeDotStyle={{
          backgroundColor: "rgba(253, 245, 234, 1)",
          borderRadius: 50,
        }}
        containerStyle={styles.pagination}
        onPress={onPressPagination}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 490,
    marginTop: 0,
    marginBottom: 0,
    display: "flex",
    alignItems: "center", // Center horizontally
    justifyContent: "center", // Center vertically
    position: "relative", // Relative positioning for children
  },
  card: {
    position: "relative", // So absolute elements inside position relative to card
    width: 325,
    height: 475, // Consistent height
    marginRight: 16,
    borderRadius: 15,
    overflow: "hidden",
  },
  playerImage: {
    width: "100%",
    height: "100%",
  },
  placeholderCard: {
    width: "100%",
    height: "100%",
    backgroundColor: COLORS.placeholder,
    borderRadius: 15,
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "66%",
    zIndex: 2,
  },
  playerName: {
    position: "absolute",
    bottom: 50,
    right: 20,
    width: 125,
    textAlign: "right",
    color: COLORS.text.light,
    fontSize: 25,
    fontWeight: "900",
    zIndex: 999, // Ensure it appears above the gradient and image
    textShadowRadius: 5,
    opacity: 0.8,
  },
  pagination: {
    position: "absolute",
    bottom: 30,
    zIndex: 1000, // Above everything
    gap: 5,
  },
});
