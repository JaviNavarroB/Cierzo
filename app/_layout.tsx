import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Inter_400Regular, Inter_700Bold } from "@expo-google-fonts/inter";
import { DancingScript_700Bold } from "@expo-google-fonts/dancing-script";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Platform } from "react-native";
//import * as NavigationBar from "expo-navigation-bar";
import { COLORS } from "@/constants/theme"; // added for color reference

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    DancingScript: require("../assets/fonts/DancingScript-VariableFont_wght.ttf"),
    DancingScript_Bold: require("../assets/fonts/DancingScript-Bold.otf"),
    // Added custom GT-America fonts for Android support
    GTAmericaTrial: require("../assets/fonts/GT-America-Standard-Regular-Trial.otf"),
    GTAmericaCompressedBlackTrial: require("../assets/fonts/GT-America-Compressed-Black-Trial.otf"),
    GTAmericaCondensedBoldTrial: require("../assets/fonts/GT-America-Condensed-Bold-Trial.otf"),
    Inter_400Regular,
    Inter_700Bold,
    DancingScript_700Bold,
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
      if (Platform.OS === "android") {
        // Set Android navigation bar color to match FooterMenu (using COLORS.text.light)
        NavigationBar.setBackgroundColorAsync(COLORS.text.light);
      }
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="deporte" />
        <Stack.Screen name="profile" />
        <Stack.Screen name="events/[id]" />
        <Stack.Screen name="about" />
      </Stack>
      <StatusBar style="dark" backgroundColor="#BB4B36" />
    </GestureHandlerRootView>
  );
}
