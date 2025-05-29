import { Platform } from "react-native";
import { CrossPlatformMap as NativeMap } from "./CrossPlatformMap.native";
import { CrossPlatformMap as WebMap } from "./CrossPlatformMap.native";
// (later, you can add a web version in CrossPlatformMap.web.tsx)
export const CrossPlatformMap = Platform.OS === "web" ? WebMap : NativeMap;
