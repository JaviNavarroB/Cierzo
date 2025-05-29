// src/components/CrossPlatformMap.native.tsx
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  View,
  StyleProp,
  ViewStyle,
  Linking,
  Platform,
} from "react-native";
import { Asset } from "expo-asset";
import * as FileSystem from "expo-file-system";
import { LeafletView, MapMarker } from "react-native-leaflet-view";

interface Props {
  lat: number;
  lng: number;
  zoom?: number;
  style?: StyleProp<ViewStyle>;
}

export function CrossPlatformMap({ lat, lng, zoom = 14, style }: Props) {
  const [html, setHtml] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      const asset = Asset.fromModule(require("../assets/leaflet.html"));
      await asset.downloadAsync();
      const content = await FileSystem.readAsStringAsync(asset.localUri!);
      if (isMounted) setHtml(content);
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  if (!html) return <ActivityIndicator size="large" style={style} />;

  const eventMarker: MapMarker = {
    id: "EVENT_MARKER",
    position: { lat, lng },
    icon: "📍",
    size: [32, 32],
  };

  return (
    <View
      style={[{ height: 220, borderRadius: 12, overflow: "hidden" }, style]}
    >
      <LeafletView
        source={{ html }}
        zoom={zoom}
        mapCenterPosition={{ lat, lng }}
        mapMarkers={[eventMarker]}
        onMessageReceived={() => {}}
      />
    </View>
  );
}
