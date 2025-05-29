// App.tsx
import { ExpoRoot } from "expo-router";
import { registerRootComponent } from "expo";
import "leaflet/dist/leaflet.css";

export default function App() {
  return (
    <ExpoRoot context={require.context("./app", true, /\.(js|jsx|ts|tsx)$/)} />
  );
}

registerRootComponent(App);
