import React from "react"
import { StyleSheet, View } from "react-native"
import MapLibreGL from '@rnmapbox/maps';
import positron from './positron.json';

// En MapLibre GL generalmente no se requiere token, ya que usa tiles públicos,
// pero si necesitas usar uno, revisa la documentación correspondiente.

export default function MyMap(): JSX.Element {
  return (
    <View style={styles.container}>
      <MapLibreGL.MapView
        style={styles.map} styleJSON={JSON.stringify(positron)}
       
        
      >
        <MapLibreGL.Camera
          centerCoordinate={[-0.97, 41.64]}  // Ajusta las coordenadas según necesites
          zoomLevel={12}
        />
      </MapLibreGL.MapView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
})
