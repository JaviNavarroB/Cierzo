import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  Platform,
  Dimensions,
} from "react-native";
import { HeaderMenu } from "@/components/HeaderMenu";
import { FooterMenu } from "@/components/FooterMenu";
import { useAuthExported } from "@/contexts/AuthContext";
import { useUpdateProfile } from "@/hooks/useProfiles";
import { COLORS } from "@/constants/theme";
import { useLoadProfile } from "@/hooks/useProfiles";
const { width: SCREEN_WIDTH } = Dimensions.get("window");
const INPUT_WIDTH = 320;
const BUTTON_WIDTH = 160;
const BUTTON_HEIGHT = 50;

import { RootStackParamList } from "@/@types/routes.types";
import { NavigationProp } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
type Navigation = NavigationProp<RootStackParamList>;

export default function BecomeMemberScreen() {
  const navigation = useNavigation<Navigation>();
  const { user } = useAuthExported();
  const { updateProfile, loading, error } = useUpdateProfile();

  const [apellidos, setApellidos] = useState(user?.apellidos || "");
  const [genero, setGenero] = useState(user?.genero || "");
  const [telefono, setTelefono] = useState(user?.telefono || "");
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [redirecting, setRedirecting] = useState(false);
  const [registered, setRegistered] = useState(false);

  useEffect(() => {
    if (user?.id_rol === 2) {
      setSuccessMsg("Ya eres socio. Redirigiendo...");
      setRedirecting(true);
      setTimeout(() => {
        navigation.goBack();
      }, 1200);
    }
  }, [user, navigation]);

  const handleSubmit = async () => {
    if (user?.id_rol === 2) {
      setSuccessMsg("Ya eres socio");
      return;
    }

    if (!apellidos.trim()) {
      Alert.alert("Completa tu apellido");
      return;
    }
    if (!genero) {
      Alert.alert("Selecciona tu género");
      return;
    }
    try {
      await updateProfile({
        apellidos,
        genero,
        telefono,
        id_rol: 2,
      });
      setRegistered(true);
      setSuccessMsg("¡Ahora eres socio! 🎉");
      setTimeout(() => {
        navigation.goBack();
      }, 1200);
    } catch (err) {
      // Muestra error si lo hay
    }
  };

  if (user?.id_rol === 2 || redirecting) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <HeaderMenu />
        <View style={[styles.scrollContent, { flex: 1 }]}>
          <Text style={styles.title}>¡Ya eres socio!</Text>
          <Text style={{ color: "green", marginTop: 15 }}>
            {successMsg || "Ya eres socio."}
          </Text>
        </View>
        <FooterMenu />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <HeaderMenu />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>¡Hazte socio!</Text>
        <Text style={styles.subtitle}>
          Completa tus datos para formar parte del club y disfrutar de todos los
          beneficios.
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Apellidos"
          value={apellidos}
          onChangeText={setApellidos}
        />
        <View style={styles.pickerRow}>
          <Text
            style={{ marginRight: 12, fontSize: 15, color: COLORS.text.dark }}
          >
            Género:
          </Text>
          <TouchableOpacity
            style={[
              styles.pickerBtn,
              genero === "Hombre" && styles.pickerSelected,
            ]}
            onPress={() => setGenero("Hombre")}
          >
            <Text style={styles.pickerText}>Hombre</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.pickerBtn,
              genero === "Mujer" && styles.pickerSelected,
            ]}
            onPress={() => setGenero("Mujer")}
          >
            <Text style={styles.pickerText}>Mujer</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.pickerBtn,
              genero === "Otro" && styles.pickerSelected,
            ]}
            onPress={() => setGenero("Otro")}
          >
            <Text style={styles.pickerText}>Otro</Text>
          </TouchableOpacity>
        </View>
        <TextInput
          style={styles.input}
          placeholder="Teléfono (opcional)"
          value={telefono}
          onChangeText={setTelefono}
          keyboardType="phone-pad"
        />

        <TouchableOpacity
          style={[
            styles.button,
            (loading || registered || user?.id_rol === 2) &&
              styles.buttonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={loading || registered || user?.id_rol === 2}
        >
          <Text style={styles.buttonText}>
            {loading
              ? "Guardando..."
              : registered || user?.id_rol === 2
              ? "Ya eres socio"
              : "¡Hazme socio!"}
          </Text>
        </TouchableOpacity>

        {successMsg && (
          <Text style={{ color: "green", marginTop: 15 }}>{successMsg}</Text>
        )}
        {error && (
          <Text style={{ color: "red", marginTop: 10, textAlign: "center" }}>
            {error}
          </Text>
        )}
      </ScrollView>
      <FooterMenu />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 15,
    color: COLORS.primary,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.text.dark,
    opacity: 0.8,
    marginBottom: 32,
    textAlign: "center",
    maxWidth: 350,
  },
  input: {
    width: INPUT_WIDTH,
    height: 50,
    borderWidth: 1,
    borderColor: COLORS.text.dark,
    borderRadius: 1000,
    paddingLeft: 20,
    marginVertical: 10,
    fontSize: 15,
    backgroundColor: "#fff",
    color: COLORS.text.dark,
  },
  pickerRow: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  pickerBtn: {
    borderWidth: 1,
    borderColor: COLORS.text.dark,
    borderRadius: 18,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginHorizontal: 4,
    backgroundColor: "#fff",
  },
  pickerSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  pickerText: {
    color: COLORS.text.dark,
    fontWeight: "600",
    fontSize: 15,
  },
  button: {
    width: BUTTON_WIDTH,
    height: BUTTON_HEIGHT,
    backgroundColor: COLORS.primary,
    borderRadius: 1000,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 25,
  },
  buttonText: {
    color: COLORS.text.light,
    fontWeight: "bold",
    fontSize: 17,
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
    opacity: 0.7,
  },
});
