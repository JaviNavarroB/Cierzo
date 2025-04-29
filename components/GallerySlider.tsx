import * as React from "react";
import {
  Dimensions,
  View,
  Platform,
  StyleSheet,
  Image,
  Text,
} from "react-native";
import { useSharedValue } from "react-native-reanimated";
import Carousel, {
  ICarouselInstance,
  Pagination,
} from "react-native-reanimated-carousel";
import { COLORS } from "@/constants/theme";

// Define dimensions and proportions similar to EventsSlider.tsx
const cardWidth = 340;
const cardHeight = 275;
const cardMarginRight = 0;

const data = [...new Array(6).keys()];

interface SportsSliderProps {
  scrollRef?: React.Ref<any>;
}

function GallerySlider({ scrollRef }: SportsSliderProps) {
  const ref = React.useRef<ICarouselInstance>(null);
  const progress = useSharedValue<number>(0);

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
        width={cardWidth}
        height={cardHeight}
        data={data}
        onProgressChange={progress}
        vertical={false}
        mode="parallax"
        modeConfig={{
          parallaxScrollingScale: 1,
          parallaxScrollingOffset: 0,
        }}
        onConfigurePanGesture={(gestureChain) =>
          gestureChain.activeOffsetX([-10, 10])
        }
        renderItem={({ index }) => (
          <View
            style={{
              flex: 1,
              borderRadius: 0,
              overflow: "hidden",
              justifyContent: "center",
              marginRight: cardMarginRight,
              marginLeft: cardMarginRight,
            }}
          >
            <Image
              source={require("../assets/images/Poster1.jpeg")}
              style={{
                width: "100%",
                height: "100%",
                overflow: "hidden",
              }}
              resizeMode="cover"
            />
          </View>
        )}
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
        containerStyle={{ gap: 5, marginTop: 20 }}
        onPress={onPressPagination}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 280,
    marginTop: 0,

    alignItems: "center", // new line to center the card horizontally
  },
  title: {
    fontWeight: 900,
    fontFamily: "GT America Trial",

    fontSize: 60,
    lineHeight: 75,
    color: COLORS.primary,
    position: "absolute",
    left: 40,
    top: -70,
    zIndex: 2, // Increased to ensure it's above carousel
  },
  titleMobile: {
    fontSize: 35,
    lineHeight: 50,
  },
  textOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.overlay.dark,
    padding: 10,
  },
  cardText: {
    color: COLORS.text.light,
    fontSize: 16,
    fontWeight: "600",
  },
});

export default GallerySlider;
