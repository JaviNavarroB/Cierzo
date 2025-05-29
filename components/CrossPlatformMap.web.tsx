// src/components/CrossPlatformMap.web.tsx
import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";

interface Props {
  lat: number;
  lng: number;
  zoom?: number;
  style?: React.CSSProperties;
}

export function CrossPlatformMap({ lat, lng, zoom = 14, style }: Props) {
  const position: LatLngExpression = [lat, lng];
  return (
    <div style={{ width: "100%", height: 220, ...style }}>
      <MapContainer
        center={position}
        zoom={zoom}
        style={{ width: "100%", height: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={position}>
          <Popup>Evento aquí</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
