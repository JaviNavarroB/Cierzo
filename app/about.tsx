// AboutScreen.tsx
"use client";

import React from "react";
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  useWindowDimensions,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { HeaderMenu } from "@/components/HeaderMenu";
import { FooterMenu } from "@/components/FooterMenu";
import { COLORS } from "@/constants/theme";
import { FontAwesome } from "@expo/vector-icons";
import Svg, { Defs, Pattern, Rect, Circle } from "react-native-svg";

// Dot background pattern
const DotPattern: React.FC = () => {
  const { width, height } = useWindowDimensions();

  return (
    <Svg width={width} height={height} style={styles.dotPatternContainer}>
      <Defs>
        <Pattern
          id="dotPattern"
          // patternUnits must be userSpaceOnUse so 20px spacing is absolute
          patternUnits="userSpaceOnUse"
          width={20}
          height={20}
        >
          <Circle cx={1} cy={1} r={1} fill="#ccc" opacity={0.8} />
        </Pattern>
      </Defs>

      {/* fill entire view with the dot pattern */}
      <Rect x={0} y={0} width={width} height={height} fill="url(#dotPattern)" />
    </Svg>
  );
};

// Divider with label
const Divider: React.FC<{ label: string }> = ({ label }) => (
  <View style={styles.dividerContainer}>
    <View style={styles.circleLeft}>
      <Text style={styles.circleText}>{label}</Text>
    </View>
    <View style={styles.divider} />
    <View style={styles.arrowRight} />
  </View>
);

// Staff member card
interface StaffCardProps {
  img: string;
  name: string;
  title: string;
  email: string;
}
const StaffCard: React.FC<StaffCardProps> = ({ img, name, title, email }) => (
  <View style={styles.staffCard}>
    <Image source={{ uri: img }} style={styles.staffImage} resizeMode="cover" />
    <Text style={styles.staffName}>{name}</Text>
    <Text style={styles.staffTitle}>{title}</Text>
    <Text style={styles.staffEmail}>{email}</Text>
  </View>
);

// Staff section
const StaffSection: React.FC = () => (
  <View style={styles.sectionContainer}>
    <Text style={styles.sectionTitle}>Directiva</Text>
    <View style={styles.staffGrid}>
      <StaffCard
        img="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=256&q=80"
        name="MIGUEL SÁNCHEZ"
        title="Presidente"
        email="miguel@deportes.com"
      />
      <StaffCard
        img="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80"
        name="LAURA MARTÍNEZ"
        title="Vicepresidenta"
        email="laura@deportes.com"
      />
      <StaffCard
        img="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=256&q=80"
        name="CARLOS RODRÍGUEZ"
        title="Director Técnico"
        email="carlos@deportes.com"
      />
    </View>
    <Divider label="D" />
    <Text style={styles.sectionTitle}>Entrenadores</Text>
    <View style={styles.staffGrid}>
      <StaffCard
        img="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80"
        name="ANA GÓMEZ"
        title="Entrenadora Principal"
        email="ana@deportes.com"
      />
      <StaffCard
        img="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80"
        name="JAVIER LÓPEZ"
        title="Entrenador Asistente"
        email="javier@deportes.com"
      />
      <StaffCard
        img="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=256&q=80"
        name="ELENA FERNÁNDEZ"
        title="Preparadora Física"
        email="elena@deportes.com"
      />
    </View>
  </View>
);

// Contact section
const ContactSection: React.FC = () => (
  <View style={styles.sectionContainer}>
    <Text style={styles.sectionTitle}>Contacto</Text>
    <Text style={styles.contactHeading}>Hablemos.</Text>
    <View style={styles.contactColumns}>
      <View style={styles.contactColumn}>
        <Text style={styles.contactColumnTitle}>Información General</Text>
        <Text style={styles.contactName}>Oficina Central</Text>
        <Text style={styles.contactEmail}>info@deportes.com</Text>
      </View>
      <View style={styles.contactColumn}>
        <Text style={styles.contactColumnTitle}>Nuevas Inscripciones</Text>
        <Text style={styles.contactName}>Depto. Admisiones</Text>
        <Text style={styles.contactEmail}>inscripciones@deportes.com</Text>
      </View>
    </View>
    <View style={styles.dividerContainer}>
      <View style={styles.circleLeft}>
        <Text style={styles.circleText}>E</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.arrowRight} />
    </View>
    <Text style={styles.contactColumnTitle}>Ubicación</Text>
    <Text style={styles.contactAddress}>
      Calle Principal, 123{`\n`}Ciudad Deportiva{`\n`}28001 Madrid
    </Text>
    <Text style={styles.contactColumnTitle}>Redes Sociales</Text>
    <View style={styles.socialIcons}>
      {(["instagram", "facebook", "twitter", "youtube-play"] as const).map(
        (icon) => (
          <FontAwesome
            key={icon}
            name={icon}
            size={20}
            color={COLORS.primary}
            style={styles.socialIcon}
          />
        )
      )}
    </View>
  </View>
);

export default function AboutScreen() {
  const { width } = useWindowDimensions();
  const [activeSection, setActiveSection] = React.useState<
    "about" | "staff" | "contact"
  >("about");

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <DotPattern />
      <HeaderMenu />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.titleContainer}>
          <Text style={styles.pageTitle}>Sobre Nosotros</Text>
        </View>
        <Divider label="A" />
        <View style={styles.tabContainer}>
          {(["about", "staff", "contact"] as const).map((key) => (
            <TouchableOpacity
              key={key}
              onPress={() => setActiveSection(key)}
              style={styles.tab}
            >
              <Text
                style={[
                  styles.tabText,
                  activeSection === key && styles.activeTabText,
                ]}
              >
                {key === "about"
                  ? "Asociación"
                  : key === "staff"
                  ? "Equipo"
                  : "Contacto"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {activeSection === "about" && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>
              Integridad. Servicio. Deporte.
            </Text>
            <View style={styles.missionColumns}>
              <Text style={styles.missionText}>
                Nuestro enfoque colaborativo para crear entornos deportivos
                mejora la calidad de vida.
              </Text>
              <Text style={styles.missionText}>
                Diseñamos espacios que fomentan el cambio positivo, la equidad y
                el bienestar.
              </Text>
            </View>
            <Divider label="B" />
            <Text style={styles.sectionTitle}>Historia</Text>

            <Text style={styles.historyText}>
              Fundada en 2005, nuestra asociación deportiva ha crecido desde un
              pequeño grupo de entusiastas hasta convertirse en un referente
              deportivo en la región. A lo largo de los años, hemos organizado
              numerosos torneos, formado a cientos de deportistas y creado un
              espacio donde la pasión por el deporte se combina con valores como
              el respeto, la disciplina y el trabajo en equipo.
            </Text>
            <Text style={styles.historyText}>
              Nuestro compromiso con la excelencia deportiva y el desarrollo
              personal de nuestros miembros nos ha permitido expandir nuestras
              instalaciones y programas, ofreciendo cada vez más oportunidades
              para que personas de todas las edades disfruten de los beneficios
              del deporte.
            </Text>

            <Divider label="C" />
            <Text style={styles.sectionTitle}>Valores</Text>
            {[
              {
                num: 1,
                title: "Excelencia",
                desc: "Buscamos la mejora continua en todo lo que hacemos, tanto en el ámbito deportivo como organizativo.",
              },
              {
                num: 2,
                title: "Inclusión",
                desc: "Creamos un espacio donde todos son bienvenidos independientemente de su nivel o experiencia.",
              },
              {
                num: 3,
                title: "Respeto",
                desc: "Fomentamos el respeto mutuo entre todos los miembros denuestra comunidad deportiva.",
              },
            ].map((v) => (
              <View key={v.num} style={styles.valueItem}>
                <View style={styles.valueNumber}>
                  <Text style={styles.valueNumberText}>{v.num}</Text>
                </View>
                <View style={styles.valueContent}>
                  <Text style={styles.valueTitle}>{v.title}</Text>
                  <Text style={styles.valueDescription}>{v.desc}</Text>
                </View>
              </View>
            ))}
          </View>
        )}
        {activeSection === "staff" && <StaffSection />}
        {activeSection === "contact" && <ContactSection />}
        <View style={styles.ctaSection}>
          <Text style={styles.ctaTitle}>¿Listo para unirte?</Text>
          <TouchableOpacity style={styles.ctaButton}>
            <Text style={styles.ctaButtonText}>Inscríbete</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <FooterMenu style={styles.footerMenu} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  dotPatternContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
  footerMenu: {
    position: "absolute",
    left: 0,
    right: 0,
    marginTop: -40,
  },
  scrollContent: { paddingBottom: 120 },
  titleContainer: { paddingTop: 60, paddingHorizontal: 24, marginBottom: 20 },
  pageTitle: {
    fontSize: 48,
    fontWeight: "400",
    color: COLORS.primary,
    marginBottom: 16,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    marginVertical: 40,
  },
  circleLeft: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  circleText: { fontSize: 16, color: COLORS.primary },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.primary,
    marginHorizontal: 10,
  },
  arrowRight: {
    width: 10,
    height: 10,
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderColor: COLORS.primary,
    transform: [{ rotate: "45deg" }],
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    marginBottom: 40,
  },
  tab: {},
  tabText: { fontSize: 16, color: "#999" },
  activeTabText: { color: COLORS.primary },
  sectionContainer: { paddingHorizontal: 24 },
  sectionTitle: {
    fontSize: 32,
    fontWeight: "400",
    color: COLORS.primary,
    marginBottom: 24,
  },
  missionColumns: { flexDirection: "row", marginBottom: 40 },
  missionText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
    marginRight: 20,
  },
  historyText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
    marginBottom: 16,
  },
  staffGrid: { flexDirection: "row", flexWrap: "wrap", marginTop: 24 },
  staffCard: { width: "30%", marginRight: "3%", marginBottom: 40 },
  staffImage: { width: "100%", height: 300, marginBottom: 16 },
  staffName: {
    fontSize: 18,
    fontWeight: "500",
    color: COLORS.primary,
    marginBottom: 4,
  },
  staffTitle: { fontSize: 16, color: "#333", marginBottom: 4 },
  staffEmail: { fontSize: 14, color: "#666" },
  contactHeading: {
    fontSize: 32,
    fontWeight: "400",
    color: COLORS.primary,
    marginBottom: 40,
  },
  contactColumns: { flexDirection: "row", marginBottom: 32 },
  contactColumn: { flex: 1, marginRight: 40 },
  contactColumnTitle: {
    fontSize: 18,
    fontWeight: "500",
    color: COLORS.primary,
    marginBottom: 16,
  },
  contactName: { fontSize: 16, color: "#333", marginBottom: 4 },
  contactEmail: { fontSize: 16, color: "#666" },
  contactAddress: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
    marginBottom: 32,
  },
  socialIcons: { flexDirection: "row", marginBottom: 40 },
  socialIcon: { marginRight: 24 },
  valueItem: { flexDirection: "row", marginBottom: 32 },
  valueNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
    marginTop: 4,
  },
  valueNumberText: { fontSize: 16, color: COLORS.primary },
  valueContent: { flex: 1 },
  valueTitle: {
    fontSize: 20,
    fontWeight: "500",
    color: COLORS.primary,
    marginBottom: 8,
  },
  valueDescription: { fontSize: 16, lineHeight: 24, color: "#333" },
  ctaSection: {
    paddingHorizontal: 24,
    paddingVertical: 60,
    alignItems: "center",
  },
  ctaTitle: {
    fontSize: 32,
    fontWeight: "400",
    color: COLORS.primary,
    marginBottom: 24,
    textAlign: "center",
  },
  ctaButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  ctaButtonText: { color: COLORS.primary, fontSize: 16 },
});
