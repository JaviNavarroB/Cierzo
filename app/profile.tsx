import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Platform,
  ScrollView,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { HeaderMenu } from "@/components/HeaderMenu";
import { FooterMenu } from "@/components/FooterMenu";
import { COLORS } from "@/constants/theme";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// Common widths for elements:
const PROFILE_CIRCLE_SIZE = 120;
const PROFILE_INNER_SIZE = 100;
const INPUT_WIDTH = 320;
const INPUT_HEIGHT = 52;
const BUTTON_WIDTH = 150;
const BUTTON_HEIGHT = 52;
const LABEL_WIDTH = 80;

export default function Profile() {
  // Multi-step editing mode
  const [isEditing, setIsEditing] = useState(false);
  // Editable fields for Email and Contraseña:
  const [email, setEmail] = useState("test@example.com");
  const [password, setPassword] = useState("password");

  // Non-editable fields:
  const nombre = "Juan";
  const apellidos = "Pérez";
  const usuario = "juanp";

  const handleLeftButtonPress = () => {
    if (isEditing) {
      // Save changes (insert save logic here if needed) and exit edit mode
      setIsEditing(false);
    } else {
      // Enter editing mode
      setIsEditing(true);
    }
  };

  const handleRightButtonPress = () => {
    if (isEditing) {
      // Cancel editing
      setIsEditing(false);
    } else {
      // Log out / close session logic here
      console.log("Cerrar Sesión");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <HeaderMenu isDark={false} />

      {/* ScrollView */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Main content area (light cream background) */}
        <View style={styles.mainWhiteArea} />

        {/* Profile Circle (outer border + inner image) */}
        <View
          style={[
            styles.profileCircleContainer,
            {
              backgroundColor: isEditing
                ? COLORS.dots.active.darkish
                : "transparent",
            },
          ]}
        >
          <Image
            style={styles.profileCircleInner}
            source={require("../assets/images/kurokoProfile.jpeg")}
          />
        </View>

        {/* Nombre (non-editable) */}
        <TextInput
          style={[styles.input, { top: 266 }]}
          value={nombre}
          editable={false}
          placeholder="Nombre"
          placeholderTextColor={COLORS.text.black}
        />

        <View
          style={[styles.inputLabelEditing, { top: 266, borderWidth: 0 }]}
        />

        <Text style={[styles.inputLabel, { top: 266 - 8 }]}>Nombre</Text>

        {/* Apellidos (non-editable) */}
        <TextInput
          style={[styles.input, { top: 343 }]}
          value={apellidos}
          editable={false}
          placeholder="Apellidos"
          placeholderTextColor={COLORS.text.black}
        />

        <View
          style={[styles.inputLabelEditing, { top: 343, borderWidth: 0 }]}
        />

        <Text style={[styles.inputLabel, { top: 343 - 8 }]}>Apellidos</Text>

        {/* Email */}
        {isEditing ? (
          <TextInput
            style={[
              styles.input,
              { top: 420, backgroundColor: COLORS.dots.active.darkish },
            ]}
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            placeholderTextColor={COLORS.text.black}
          />
        ) : (
          <TextInput
            style={[styles.input, { top: 420 }]}
            value={email}
            editable={false}
            placeholder="Email"
            placeholderTextColor={COLORS.text.black}
          />
        )}

        {isEditing ? (
          <View style={[styles.inputLabelEditing, { top: 420 }]} />
        ) : (
          <View
            style={[styles.inputLabelEditing, { top: 420, borderWidth: 0 }]}
          />
        )}

        <Text style={[styles.inputLabel, { top: 420 - 8 }]}>Email</Text>

        {/* Contraseña */}
        {isEditing ? (
          <TextInput
            style={[
              styles.input,
              { top: 497, backgroundColor: COLORS.dots.active.darkish },
            ]}
            value={password}
            onChangeText={setPassword}
            placeholder="Contraseña"
            placeholderTextColor={COLORS.text.black}
            secureTextEntry
          />
        ) : (
          <TextInput
            style={[styles.input, { top: 497 }]}
            value={password.replace(/./g, "*")}
            editable={false}
            placeholder="Contraseña"
            placeholderTextColor={COLORS.text.black}
            secureTextEntry
          />
        )}

        {isEditing ? (
          <View style={[styles.inputLabelEditing, { top: 497 }]} />
        ) : (
          <View
            style={[styles.inputLabelEditing, { top: 497, borderWidth: 0 }]}
          />
        )}

        <Text style={[styles.inputLabel, { top: 497 - 8 }]}>Contraseña</Text>

        {/* Buttons */}
        <TouchableOpacity
          style={[styles.buttonSave, { top: 574 }]}
          onPress={handleLeftButtonPress}
        >
          <Text style={styles.saveText}>
            {isEditing ? "Guardar" : "Editar Perfil"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.buttonExit, { top: 574 }]}
          onPress={handleRightButtonPress}
        >
          <Text style={styles.exitText}>
            {isEditing ? "Salir" : "Cerrar Sesión"}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Footer */}
      <FooterMenu style={styles.footerMenu} isDark={false} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
  },

  /* Main white area (light cream background) */
  mainWhiteArea: {
    position: "absolute",
    width: SCREEN_WIDTH,
    height: 746,
    left: 0,
    top: 0,
    backgroundColor: COLORS.background,
  },

  /* Profile Circle Container (outer border) */
  profileCircleContainer: {
    position: "absolute",
    left: (SCREEN_WIDTH - PROFILE_CIRCLE_SIZE) / 2,
    top: 100,
    width: PROFILE_CIRCLE_SIZE,
    height: PROFILE_CIRCLE_SIZE,
    borderWidth: 2,
    borderColor: COLORS.text.dark,
    borderRadius: 1000,
    justifyContent: "center",
    alignItems: "center",
  },
  profileCircleInner: {
    width: PROFILE_INNER_SIZE,
    height: PROFILE_INNER_SIZE,
    borderRadius: 1000,
  },

  /* Each input (320x52), centered horizontally */
  input: {
    position: "absolute",
    left: (SCREEN_WIDTH - INPUT_WIDTH) / 2,
    width: INPUT_WIDTH,
    height: INPUT_HEIGHT,
    borderWidth: 1,
    borderColor: COLORS.text.dark,
    borderRadius: 1000,
    paddingLeft: 20,
    color: COLORS.text.black,
    fontSize: 13,
    fontFamily: "GT America Trial",
  },

  /* Label (80 wide), centered horizontally */
  inputLabel: {
    position: "absolute",
    left: 65,
    width: LABEL_WIDTH,
    height: 14,
    fontFamily: "GT America Trial",
    fontSize: 11,
    lineHeight: 14,
    textAlign: "center",
    letterSpacing: -0.03,
    color: COLORS.text.dark,
    overflow: "hidden",
  },
  inputLabelEditing: {
    display: "flex",
    position: "absolute",
    left: 65,
    width: LABEL_WIDTH,
    height: 11,
    letterSpacing: -0.03,
    color: COLORS.text.dark,
    overflow: "hidden",
    backgroundColor: COLORS.text.light,

    // Hide top border
    borderTopWidth: 0,
    // Show bottom + left + right borders
    borderWidth: 1,
    borderColor: COLORS.text.dark,
    // Round only bottom corners
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },

  /* Left button: "Guardar" / "Editar Perfil" */
  buttonSave: {
    position: "absolute",
    left: SCREEN_WIDTH / 2 - BUTTON_WIDTH - 10,
    width: BUTTON_WIDTH,
    height: BUTTON_HEIGHT,
    backgroundColor: COLORS.overlay.darker,
    borderRadius: 1000,
    justifyContent: "center",
    alignItems: "center",
  },

  /* Right button: "Salir" / "Cerrar Sesión" */
  buttonExit: {
    position: "absolute",
    left: SCREEN_WIDTH / 2 + 10,
    width: BUTTON_WIDTH,
    height: BUTTON_HEIGHT,
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderRadius: 1000,
    justifyContent: "center",
    alignItems: "center",
  },

  saveText: {
    fontFamily: "GT America Trial",
    fontSize: 13,
    lineHeight: 25,
    textAlign: "center",
    letterSpacing: -0.03,
    color: COLORS.text.light,
  },

  exitText: {
    fontFamily: "GT America Trial",
    fontSize: 13,
    lineHeight: 25,
    textAlign: "center",
    letterSpacing: -0.03,
    color: COLORS.primary,
  },

  /* Footer Menu positioning */
  footerMenu: {
    position: "absolute",
    left: 0,
    right: 0,
    marginTop: -40,
  },
});
