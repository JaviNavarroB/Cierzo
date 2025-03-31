import { useState } from "react";
import { StyleSheet, View, Text } from "react-native";

import { COLORS } from "@/constants/theme";

export function Footer() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>BASKET</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#454545", // You might want to add this color to theme.ts
    borderBottomWidth: 1,
    borderBottomColor: "#454545",
    height: 200, // Altura ajustada para móvil
    width: "100%",
    marginTop: 64,
  },
  // Aplica la rotación en el contenedor y no en el Text
  titleContainer: {
    transform: [{ rotate: "180deg" }],
    // Si es necesario, se pueden ajustar márgenes/paddings aquí
  },
  title: {
    fontFamily: "GT-America-Compressed-Black-Trial.otf",
    fontSize: 90, // Tamaño de fuente ajustado para móvil
    fontWeight: "900",
    textAlign: "center",
    letterSpacing: -2, // Ajuste de interletrado
    color: COLORS.background,
    marginTop: 90,
    // Se eliminó marginBottom para evitar efectos indeseados tras la rotación
  },
});
