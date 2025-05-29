// src/components/LeafletMap.tsx
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import { LeafletView, MapMarker } from "react-native-leaflet-view";
import { Asset } from "expo-asset";
import * as FileSystem from "expo-file-system";

interface Props {
  lat: number;
  lng: number;
  zoom?: number;
  /** estilos del CONTENEDOR que envuelve al mapa */
  style?: StyleProp<ViewStyle>;
}

const OWN_MARKER_ID = "EVENT_MARKER";

export const LeafletMap: React.FC<Props> = ({ lat, lng, zoom = 15, style }) => {
  const [html, setHtml] = useState<string | null>(null);

  /* ------------------- 1 · cargar el html ------------------- */
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const asset = Asset.fromModule(require("../../assets/leaflet.html"));
        await asset.downloadAsync();
        const htmlStr = await FileSystem.readAsStringAsync(asset.localUri!);
        if (mounted) setHtml(htmlStr);
      } catch (err) {
        Alert.alert("Error cargando mapa", JSON.stringify(err));
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  if (!html) return <ActivityIndicator size="large" />;

  /* ------------------- 2 · marcador del evento -------------- */
  const eventMarker: MapMarker = {
    id: OWN_MARKER_ID,
    position: { lat, lng },
    icon: "📍",
    size: [32, 32],
  };

  /* ------------------- 3 · render --------------------------- */
  return (
    <View
      style={[
        styles.container, // altura + bordes redondeados
        style, // estilos que te pasen
      ]}
    >
      <LeafletView
        source={{ html }}
        zoom={zoom}
        mapCenterPosition={{ lat, lng }}
        mapMarkers={[eventMarker]}
        onMessageReceived={() => {}} // obligatorio aunque sea vacío
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 220,
    borderRadius: 12,
    overflow: "hidden",
  },
});
