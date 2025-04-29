import * as React from "react";
import {
  Dimensions,
  View,
  Platform,
  StyleSheet,
  Image,
  Text,
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
import { COLORS } from "@/constants/theme";
import { LinearGradient } from "expo-linear-gradient"; // <-- new import
interface SportsSliderProps {
  scrollRef?: React.Ref<any>;
}
const windowWidth = Dimensions.get("window").width;
const isMobile = Platform.OS !== "web" || windowWidth < 768;
// Card's "center width"
const cardWidth = isMobile ? 250 : 250;
// Card's height
const cardHeight = isMobile ? 400 : 300;

const data = [...new Array(6).keys()];

export default function SportsSlider({ scrollRef }: SportsSliderProps) {
  const ref = React.useRef<ICarouselInstance>(null);
  const progress = useSharedValue(0);

  // A Card component that changes width based on how far it is from center
  const Card = ({ index }: { index: number }) => {
    const animatedStyle = useAnimatedStyle(() => {
      const diff = Math.abs(progress.value - index);
      // Interpolate from full width (center) to half width (sides)
      const widthInterpolated = interpolate(
        diff,
        [0, 1],
        [cardWidth, cardWidth / 3],
        Extrapolate.CLAMP
      );
      return { width: widthInterpolated };
    });
    // Added animated style to control text visibility based on center card condition
    const textAnimatedStyle = useAnimatedStyle(() => {
      const diff = Math.abs(progress.value - index);
      return { opacity: diff < 0.5 ? 0 : 0 }; //change the opacity so the name's appear
    });
    return (
      <Animated.View style={[styles.cardOuterContainer, animatedStyle]}>
        <Image
          source={require("../assets/images/Poster1.jpeg")}
          style={styles.cardImage}
          resizeMode="cover"
        />
        {/* Moved gradient directly under Image */}
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.9)"]}
          style={styles.gradient}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
        />
        {/* Apply animated opacity on the text only */}
        <Animated.Text style={[styles.cardText, textAnimatedStyle]}>
          Deporte {index + 1}
        </Animated.Text>
      </Animated.View>
    );
  };

  // Jump to page on pagination press
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
        // The carousel should span the full screen width,
        // but each card is narrower (cardWidth).
        width={windowWidth}
        height={cardHeight}
        pagingEnabled={true} // Let multiple cards be visible
        data={data}
        onProgressChange={progress}
        vertical={false}
        mode="parallax"
        modeConfig={{
          // Slight scale for side cards
          parallaxScrollingScale: 0.9,
          // Smaller offset to keep side cards visible
          parallaxScrollingOffset: 260,
        }}
        onConfigurePanGesture={(gestureChain) =>
          // changed threshold from [-30, 30] to [-10, 10] for scroll behavior like GallerySlider
          gestureChain.activeOffsetX([-10, 10])
        }
        renderItem={({ index }) => <Card index={index} />}
      />

      <Pagination.Basic
        progress={progress}
        data={data}
        dotStyle={{
          backgroundColor: COLORS.dots.inactive.dark,
          borderRadius: 50,
        }}
        activeDotStyle={{
          backgroundColor: COLORS.dots.active.dark,
          borderRadius: 50,
        }}
        containerStyle={{ gap: 5, marginTop: 10 }}
        onPress={onPressPagination}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    // Enough height for the carousel to show
    height: Platform.select({ web: 488, default: 390 }),
    marginTop: 0,
    marginBottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  cardOuterContainer: {
    // Occupies the interpolated width
    flex: 1,
    borderRadius: 15,
    overflow: "hidden",
    // Margin so the next card is partially visible
    marginHorizontal: 10,
    alignSelf: "center",
  },
  cardImage: {
    width: "100%",
    height: "100%",
  },
  textOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
  },
  // New gradient style matching EventsSlider background behind name
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "66%",
    zIndex: 2,
  },
  // Updated styling for sport name to match EventsSlider
  cardText: {
    position: "absolute",
    flex: 1,
    right: 25,
    alignItems: "center",
    bottom: 25,
    color: COLORS.text.light,
    fontSize: 24,
    fontWeight: "900",
    zIndex: 999,
    // Removed static opacity to allow animated opacity to work
  },
});
