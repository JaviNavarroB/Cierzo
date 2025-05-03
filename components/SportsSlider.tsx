// components/SportsSlider.tsx

import * as React from "react";
import {
  View,
  Dimensions,
  Platform,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolate,
  useSharedValue,
} from "react-native-reanimated";
import Carousel, {
  ICarouselInstance,
  Pagination,
} from "react-native-reanimated-carousel";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "@/constants/theme";
import { useEquipos, EquipoItem } from "@/hooks/useEquipos";

interface SportsSliderProps {
  scrollRef?: React.Ref<any>;
}

const windowWidth = Dimensions.get("window").width;
const isMobile = Platform.OS !== "web" || windowWidth < 768;
const cardWidth = isMobile ? 250 : 300;
const cardHeight = isMobile ? 400 : 350;

export default function SportsSlider({ scrollRef }: SportsSliderProps) {
  const { equipos, loading, error } = useEquipos();
  const router = useRouter();
  const ref = React.useRef<ICarouselInstance>(null);
  const progress = useSharedValue(0);

  // Show spinner or error
  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }
  if (error) {
    return (
      <View style={styles.loader}>
        <Text style={{ color: "red" }}>{error.message}</Text>
      </View>
    );
  }

  // Map your equipos into the shape the carousel needs.
  // For now we use a placeholder image for every team.
  const data = equipos.map((e: EquipoItem) => ({
    id: e.id,
    sportName: e.nombre_deporte_abv,
    teamName: e.nombre,
    imageUri: require("../assets/images/Poster1.jpeg"),
  }));

  const Card = ({ index }: { index: number }) => {
    const item = data[index];
    const animatedStyle = useAnimatedStyle(() => {
      const diff = Math.abs(progress.value - index);
      const widthInterpolated = interpolate(
        diff,
        [0, 1],
        [cardWidth, cardWidth / 3],
        Extrapolate.CLAMP
      );
      return { width: widthInterpolated };
    });

    return (
      <TouchableOpacity
        onPress={() =>
          router.push({
            pathname: "/sports/[id]",
            params: { id: item.id.toString() },
          })
        }
      >
        <Animated.View style={[styles.cardContainer, animatedStyle]}>
          <Image
            source={item.imageUri}
            style={styles.cardImage}
            resizeMode="cover"
          />
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.9)"]}
            style={styles.gradient}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
          />
          <View style={styles.textOverlay}>
            <Text style={styles.sportText}>{item.sportName}</Text>
            <Text style={styles.teamText}>{item.teamName}</Text>
          </View>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  const onPressPagination = (index: number) => {
    ref.current?.scrollTo({
      count: index - progress.value,
      animated: true,
    });
  };

  return (
    <View style={styles.container}>
      <Carousel
        ref={ref}
        width={windowWidth}
        height={cardHeight}
        data={data}
        onProgressChange={progress}
        mode="parallax"
        modeConfig={{
          parallaxScrollingScale: 0.9,
          parallaxScrollingOffset: 260,
        }}
        onConfigurePanGesture={(g) => g.activeOffsetX([-10, 10])}
        renderItem={({ index }) => <Card index={index} />}
      />

      <Pagination.Basic
        progress={progress}
        data={data}
        dotStyle={styles.dot}
        activeDotStyle={styles.activeDot}
        containerStyle={styles.pagination}
        onPress={onPressPagination}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  loader: {
    width: "100%",
    height: 300,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "100%",
    height: Platform.select({ web: 488, default: 390 }),
    alignItems: "center",
    justifyContent: "center",
  },
  cardContainer: {
    borderRadius: 15,
    overflow: "hidden",
    marginHorizontal: 10,
    alignSelf: "center",
  },
  cardImage: {
    width: "100%",
    height: "100%",
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "66%",
    zIndex: 2,
  },
  textOverlay: {
    position: "absolute",
    bottom: 25,
    left: 20,
    right: 20,
    zIndex: 3,
  },
  sportText: {
    color: COLORS.text.light,
    fontSize: 22,
    fontWeight: "800",
  },
  teamText: {
    color: COLORS.text.light,
    fontSize: 18,
    marginTop: 4,
  },
  dot: {
    backgroundColor: COLORS.dots.inactive.dark,
    borderRadius: 50,
  },
  activeDot: {
    backgroundColor: COLORS.dots.active.dark,
    borderRadius: 50,
  },
  pagination: {
    gap: 5,
    marginTop: 10,
  },
});
