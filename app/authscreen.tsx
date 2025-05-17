import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  SafeAreaView,
  ScrollView,
  Dimensions,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useLoginRegister } from "../hooks/useLoginRegister"; // FALTA PONER TODA LA LÓGICA DE LOGIN Y REGISTRO
import { Mail, Lock, User } from "lucide-react-native";
import { useFonts, Lobster_400Regular } from "@expo-google-fonts/lobster";
import {
  Raleway_300Light,
  Raleway_400Regular,
} from "@expo-google-fonts/raleway";
import { COLORS } from "@/constants/theme";
import { StatusBar } from "expo-status-bar";

// Calculate these outside the component so they are available in the stylesheet.
const deviceWidth = Dimensions.get("window").width;
const cardWidth = Platform.OS === "web" ? 500 : deviceWidth - 40;

const AuthScreen: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [fontsLoaded] = useFonts({
    Lobster_400Regular,
    Raleway_300Light,
    Raleway_400Regular,
  });

  const { registerUser, loginUser, loading, error } = useLoginRegister();

  const handleSubmit = async () => {
    try {
      if (isLogin) {
        console.log("Attempting login...");
        await loginUser({
          Correo: email,
          Contrasenya: password,
        });
        console.log("Login successful");
        await new Promise((resolve) => setTimeout(resolve, 100));
        // CORRECT:
        router.replace({
          pathname: "/homescreen",
        });
      } else {
        if (password !== confirmPassword) {
          Alert.alert("Error", "Passwords do not match");
          return;
        }
        console.log("Attempting registration...");
        await registerUser({
          Nombre: name,
          Correo: email,
          Contrasenya: password,
        });
        console.log("Registration successful");
        Alert.alert("Success", "User registered successfully");
        setIsLogin(true);
      }
    } catch (err) {
      console.error("Error:", err);
      Alert.alert("Error", (err as Error).message);
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: COLORS.text.dark }]}
    >
      <StatusBar style="light" />

      <LinearGradient
        colors={[COLORS.text.dark, COLORS.text.dark]}
        style={styles.gradient}
      >
        <Image
          source={require("../assets/images/LogoLetras.png")}
          style={[styles.logo, { tintColor: COLORS.background }]}
        />
        {/* Fixed header with logo at the top */}
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoidingView}
        >
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.card}>
              <View style={styles.toggleContainer}>
                <TouchableOpacity
                  style={[styles.toggleButton, isLogin && styles.activeToggle]}
                  onPress={() => setIsLogin(true)}
                >
                  <Text
                    style={[
                      styles.toggleText,
                      isLogin && styles.activeToggleText,
                    ]}
                  >
                    Login
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.toggleButton, !isLogin && styles.activeToggle]}
                  onPress={() => setIsLogin(false)}
                >
                  <Text
                    style={[
                      styles.toggleText,
                      !isLogin && styles.activeToggleText,
                    ]}
                  >
                    Register
                  </Text>
                </TouchableOpacity>
              </View>
              {!isLogin && (
                <View style={styles.inputContainer}>
                  <User size={20} color="#666" style={styles.inputIcon} />
                  <TextInput
                    placeholder="Name"
                    value={name}
                    onChangeText={setName}
                    style={styles.input}
                  />
                </View>
              )}
              <View style={styles.inputContainer}>
                <Mail size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  placeholder="Email"
                  value={email}
                  onChangeText={setEmail}
                  style={styles.input}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
              <View style={styles.inputContainer}>
                <Lock size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  placeholder="Password"
                  value={password}
                  onChangeText={setPassword}
                  style={styles.input}
                  secureTextEntry
                />
              </View>
              {!isLogin && (
                <View style={styles.inputContainer}>
                  <Lock size={20} color="#666" style={styles.inputIcon} />
                  <TextInput
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    style={styles.input}
                    secureTextEntry
                  />
                </View>
              )}
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmit}
                disabled={loading}
              >
                <Text style={styles.submitButtonText}>
                  {loading ? "Loading..." : isLogin ? "Login" : "Register"}
                </Text>
              </TouchableOpacity>
              {error && <Text style={styles.errorText}>{error}</Text>}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 10,
    zIndex: 1,
  },
  logo: {
    width: 120,
    height: 40,
    color: COLORS.text.light,
    alignContent: "center",
    alignSelf: "center",
    marginTop: 30,
  },
  card: {
    backgroundColor: COLORS.text.light,
    borderRadius: 20,
    padding: 20,
    alignSelf: "center", // center on all platforms
    width: "100%",
    maxWidth: 500, // will never grow beyond 500px
    marginHorizontal: 20, // ensures some padding on mobile devices
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },

  toggleContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  toggleButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 5,
    borderRadius: 20,
    backgroundColor: "rgba(197, 186, 170, 0.84)",
  },
  activeToggle: {
    backgroundColor: "#B64B37",
  },
  toggleText: {
    fontSize: 16,
    color: COLORS.text.black,
  },
  activeToggleText: {
    color: COLORS.text.light,
    fontWeight: "bold",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    borderWidth: 1,
    borderColor: COLORS.text.black,
    borderRadius: 12,
    backgroundColor: "rgba(253, 245, 234, 0.93)",
  },
  inputIcon: {
    padding: 10,
  },
  input: {
    flex: 1,
    height: 50,
    paddingHorizontal: 10,
    fontSize: 16,
    color: COLORS.text.black,
  },
  submitButton: {
    backgroundColor: "#B64B37",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
  },
  submitButtonText: {
    color: COLORS.text.light,
    fontSize: 16,
    fontWeight: "bold",
  },
  errorText: {
    color: "#B64B37",
    marginTop: 10,
    textAlign: "center",
  },
});

export default AuthScreen;
