import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  Dimensions,
  ActivityIndicator,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { HeaderMenu } from "@/components/HeaderMenu";
import { FooterMenu } from "@/components/FooterMenu";
import { COLORS } from "@/constants/theme";
import { useAuthExported } from "@/contexts/AuthContext";
import { useUpdateProfile, useLoadProfile } from "@/hooks/useProfiles";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const PROFILE_CIRCLE_SIZE = 120;
const PROFILE_INNER_SIZE = 100;
const INPUT_WIDTH = 320;
const INPUT_HEIGHT = 52;
const BUTTON_WIDTH = 150;
const BUTTON_HEIGHT = 52;
const LABEL_WIDTH = 80;

export default function Profile() {
  const { logout } = useAuthExported();
  const { updateProfile, loading: updating, error } = useUpdateProfile();
  const {
    profile,
    setProfile,
    loading: loadingProfile,
    error: errorProfile,
  } = useLoadProfile();

  const [isEditing, setIsEditing] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Campos editables (sincronizados con los datos del backend)
  const [nombre, setNombre] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Modal para contraseña actual
  const [showModal, setShowModal] = useState(false);
  const [oldPassword, setOldPassword] = useState("");

  // Al cargar perfil, pon los datos en los campos editables
  useEffect(() => {
    if (profile) {
      setNombre(profile.nombre || "");
      setApellidos(profile.apellidos || "");
      setEmail(profile.correo || "");
    }
  }, [profile]);

  const handleCancelEdit = () => {
    setEmail(profile?.correo || "");
    setNewPassword("");
    setConfirmPassword("");
    setIsEditing(false);
    setSuccessMsg(null);
  };

  // Si pulsa guardar, primero pide contraseña con modal
  const handleTrySave = () => {
    if (newPassword && newPassword !== confirmPassword) {
      Alert.alert("Error", "Las contraseñas nuevas no coinciden");
      return;
    }
    setShowModal(true);
  };

  // Cuando confirma el modal con la contraseña actual
  const handleSave = async () => {
    setSuccessMsg(null);
    setShowModal(false);
    try {
      const resp = await updateProfile({
        correo: email,
        ...(newPassword ? { oldPassword, newPassword } : { oldPassword }),
      });
      setSuccessMsg("Perfil actualizado correctamente");
      setIsEditing(false);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      // Actualiza los datos del perfil después de guardar
      if (resp?.user) setProfile(resp.user);
    } catch (err) {
      // El error lo muestra el hook
    }
  };

  if (loadingProfile) return <ActivityIndicator style={{ marginTop: 100 }} />;
  if (errorProfile)
    return <Text style={{ color: "red", marginTop: 100 }}>{errorProfile}</Text>;
  if (!profile)
    return <Text style={{ marginTop: 100 }}>No se pudo cargar el perfil.</Text>;

  return (
    <SafeAreaView style={styles.safeArea}>
      <HeaderMenu isDark={false} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.mainWhiteArea} />

        {/* Profile Circle */}
        <View
          style={
            isEditing
              ? [
                  styles.profileCircleContainer,
                  { backgroundColor: COLORS.dots.active.darkish },
                ]
              : styles.profileCircleContainer
          }
        >
          <Image
            style={styles.profileCircleInner}
            source={
              profile.foto
                ? { uri: profile.foto }
                : require("../../assets/images/kurokoProfile.jpeg")
            }
          />
        </View>

        {/* Nombre (no editable) */}
        <TextInput
          style={[styles.input, { top: 266 }]}
          value={nombre}
          editable={false}
          placeholder="Nombre"
          placeholderTextColor={COLORS.text.black}
        />
        <View
          style={[styles.inputLabelEditing, { top: 265, borderWidth: 0 }]}
        />
        <Text style={[styles.inputLabel, { top: 258 }]}>Nombre</Text>

        {/* Apellidos (no editable) */}
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
        <Text style={[styles.inputLabel, { top: 335 }]}>Apellidos</Text>

        {/* Email */}
        <TextInput
          style={[
            styles.input,
            {
              top: 420,
              backgroundColor: isEditing
                ? COLORS.dots.active.darkish
                : undefined,
            },
          ]}
          value={email}
          editable={isEditing}
          onChangeText={setEmail}
          placeholder="Email"
          placeholderTextColor={COLORS.text.black}
        />
        <View
          style={[
            styles.inputLabelEditing,
            { top: 420, borderWidth: isEditing ? 1 : 0, borderTopWidth: 0 },
          ]}
        />
        <Text style={[styles.inputLabel, { top: 412 }]}>Email</Text>

        {/* Contraseña */}
        {isEditing ? (
          <>
            <TextInput
              style={[
                styles.input,
                { top: 497, backgroundColor: COLORS.dots.active.darkish },
              ]}
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="Nueva contraseña"
              placeholderTextColor={COLORS.text.black}
              secureTextEntry
            />
            <View style={[styles.inputLabelEditing, { top: 497 }]} />

            <TextInput
              style={[
                styles.input,
                { top: 574, backgroundColor: COLORS.dots.active.darkish },
              ]}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirmar contraseña"
              placeholderTextColor={COLORS.text.black}
              secureTextEntry
            />
            <View style={[styles.inputLabelEditing, { top: 574 }]} />
            <Text style={[styles.inputLabel, { top: 565 }]}>Contraseña</Text>
          </>
        ) : (
          <>
            <TextInput
              style={[styles.input, { top: 497 }]}
              value={"••••••••"}
              editable={false}
              placeholder="Contraseña"
              placeholderTextColor={COLORS.text.black}
              secureTextEntry
            />
            <View
              style={[
                styles.inputLabelEditing,
                {
                  top: 497,
                  borderWidth: 0,
                  borderBottomLeftRadius: 0,
                  borderBottomRightRadius: 0,
                },
              ]}
            />
          </>
        )}
        <Text style={[styles.inputLabel, { top: 489 }]}>Contraseña</Text>
        {/* Botones */}
        <TouchableOpacity
          style={[styles.buttonSave, { top: isEditing ? 651 : 574 }]}
          onPress={isEditing ? handleTrySave : () => setIsEditing(true)}
          disabled={updating}
        >
          <Text style={styles.saveText}>
            {updating
              ? "Guardando..."
              : isEditing
              ? "Guardar"
              : "Editar Perfil"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.buttonExit, { top: isEditing ? 651 : 574 }]}
          onPress={isEditing ? handleCancelEdit : logout}
          disabled={updating}
        >
          <Text style={styles.exitText}>
            {isEditing ? "Cancelar" : "Cerrar Sesión"}
          </Text>
        </TouchableOpacity>

        {successMsg && (
          <Text
            style={{
              color: "green",
              marginTop: isEditing ? 690 : 650,
              textAlign: "center",
            }}
          >
            {successMsg}
          </Text>
        )}
        {error && (
          <Text
            style={{
              color: "red",
              marginTop: isEditing ? 710 : 670,
              textAlign: "center",
            }}
          >
            {error}
          </Text>
        )}
        {updating && (
          <ActivityIndicator style={{ marginTop: isEditing ? 730 : 690 }} />
        )}
      </ScrollView>
      <FooterMenu style={styles.footerMenu} isDark={false} />

      {/* Modal para contraseña actual */}
      <Modal
        visible={showModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <Text
              style={{ fontWeight: "bold", fontSize: 17, marginBottom: 14 }}
            >
              Introduce tu contraseña actual
            </Text>
            <TextInput
              style={styles.modalInput}
              value={oldPassword}
              onChangeText={setOldPassword}
              placeholder="Contraseña actual"
              secureTextEntry
              autoFocus
            />
            <View style={{ flexDirection: "row", marginTop: 15 }}>
              <TouchableOpacity
                onPress={() => {
                  setOldPassword("");
                  setShowModal(false);
                }}
                style={[
                  styles.buttonExit,
                  { width: 110, left: 0, position: "relative" },
                ]}
              >
                <Text style={styles.exitText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSave}
                style={[
                  styles.buttonSave,
                  { width: 110, left: 20, position: "relative" },
                ]}
                disabled={updating || !oldPassword}
              >
                <Text style={styles.saveText}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  mainWhiteArea: {
    position: "absolute",
    width: SCREEN_WIDTH,
    height: 900,
    left: 0,
    top: 0,
    backgroundColor: COLORS.background,
  },
  profileCircleContainer: {
    position: "absolute",
    left: (SCREEN_WIDTH - PROFILE_CIRCLE_SIZE) / 2,
    top: 100,
    width: PROFILE_CIRCLE_SIZE,
    height: PROFILE_CIRCLE_SIZE,
    borderWidth: 2,
    borderRadius: 1000,
    justifyContent: "center",
    alignItems: "center",
    borderColor: COLORS.text.dark,
    // El color se cambia dinámicamente
  },
  profileCircleInnerBg: {
    width: PROFILE_INNER_SIZE,
    height: PROFILE_INNER_SIZE,
    borderRadius: 1000,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  profileCircleInner: {
    width: PROFILE_INNER_SIZE,
    height: PROFILE_INNER_SIZE,
    borderRadius: 1000,
  },
  /*profileCircleInner: {
    width: PROFILE_INNER_SIZE,
    height: PROFILE_INNER_SIZE,
    borderRadius: 1000,
  },*/
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
    fontFamily: "GT-America-Standard-Black-Trial.otf",
    zIndex: 1,
  },
  inputLabel: {
    position: "absolute",
    left: 65,
    width: LABEL_WIDTH,
    height: 17,
    fontFamily: "GT-America-Standard-Black-Trial.otf",
    fontSize: 11,
    lineHeight: 14,
    textAlign: "center",
    letterSpacing: -0.03,
    color: COLORS.text.dark,
    overflow: "hidden",
    zIndex: 5,
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
    backgroundColor: COLORS.background,
    zIndex: 1,
    borderTopWidth: 0,
    borderWidth: 1,
    borderColor: COLORS.text.dark,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
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
    fontFamily: "GT-America-Standard-Black-Trial.otf",
    fontSize: 13,
    lineHeight: 25,
    textAlign: "center",
    letterSpacing: -0.03,
    color: COLORS.text.light,
  },
  exitText: {
    fontFamily: "GT-America-Standard-Black-Trial.otf",
    fontSize: 13,
    lineHeight: 25,
    textAlign: "center",
    letterSpacing: -0.03,
    color: COLORS.primary,
  },
  footerMenu: {
    position: "absolute",
    left: 0,
    right: 0,
    marginTop: -40,
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.25)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    backgroundColor: COLORS.text.light,
    padding: 24,
    borderRadius: 20,
    alignItems: "center",
    minWidth: 300,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
    color: COLORS.text.dark,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: COLORS.text.dark,
    borderRadius: 14,
    width: 200,
    height: 45,
    paddingHorizontal: 18,
    fontSize: 15,
    marginBottom: 4,
    color: COLORS.text.black,
  },
});
