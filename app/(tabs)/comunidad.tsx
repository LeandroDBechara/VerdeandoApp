import { ScrollView, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import InfoTips from "@/components/infotips";
import { useNewsletter } from "@/contexts/NewsletterContext";
import StatsTabs from "@/components/estadisticas/StatsTabs";
import { useState } from "react";
import { useUser } from "@/contexts/UserContext";
import type { Articulo } from "@/contexts/NewsletterContext";

export default function Comunidad() {
  const { articulos } = useNewsletter();
  const [activeTab, setActiveTab] = useState("Noticias");
  const { user } = useUser();

  const favNews = user?.favNews ?? [];

  return (
    <View style={styles.mainContainer}>
      <LinearGradient
        colors={["#1E5248", "#2C7865", "#3D9A82"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.heroBanner}
      >
        <View style={styles.heroIconGlow}>
          <FontAwesome6 name="user-group" size={40} color="#FFD700" />
        </View>
        <Text style={styles.heroTitle}>Comunidad</Text>
        <Text style={styles.heroSubtitle}>
          Noticias ambientales y tips para seguir reciclando
        </Text>
      </LinearGradient>

      <StatsTabs activeTab={activeTab} onTabChange={setActiveTab} tabs={["Noticias", "Mis noticias"]} />

      <ScrollView style={styles.scrollContent} contentContainerStyle={styles.scrollContentContainer}>
        {activeTab === "Noticias" && (
          <>
            <View style={styles.sectionHeader}>
              <LinearGradient
                colors={["#2C7865", "#1E5248"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.sectionHeaderGradient}
              >
                <View style={styles.sectionHeaderIcon}>
                  <FontAwesome6 name="newspaper" size={16} color="#FFD700" />
                </View>
                <Text style={styles.sectionTitle}>Noticias ambientales</Text>
              </LinearGradient>
            </View>

            <View style={styles.list}>
              {articulos.length > 0 ? (
                articulos.map((articulo: Articulo) => (
                  <InfoTips key={articulo.id} infotip={articulo} />
                ))
              ) : (
                <View style={styles.emptyState}>
                  <FontAwesome6 name="newspaper" size={28} color="#2C7865" />
                  <Text style={styles.noDataText}>No hay noticias disponibles</Text>
                </View>
              )}
            </View>
          </>
        )}

        {activeTab === "Mis noticias" && (
          <>
            <View style={styles.sectionHeader}>
              <LinearGradient
                colors={["#2C7865", "#1E5248"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.sectionHeaderGradient}
              >
                <View style={styles.sectionHeaderIcon}>
                  <FontAwesome6 name="heart" size={16} color="#FFD700" />
                </View>
                <Text style={styles.sectionTitle}>Mis noticias favoritas</Text>
              </LinearGradient>
            </View>

            <View style={styles.list}>
              {favNews.length > 0 ? (
                favNews.map((articulo: Articulo) => (
                  <InfoTips key={articulo.id} infotip={articulo} />
                ))
              ) : (
                <View style={styles.emptyState}>
                  <FontAwesome6 name="heart" size={28} color="#2C7865" />
                  <Text style={styles.noDataText}>
                    Aún no agregaste ninguna noticia a tus favoritos
                  </Text>
                </View>
              )}
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#EEF6F3",
  },
  heroBanner: {
    alignItems: "center",
    paddingTop: 24,
    paddingBottom: 22,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    marginBottom: 4,
  },
  heroIconGlow: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "rgba(255, 215, 0, 0.15)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "rgba(255, 215, 0, 0.4)",
    marginBottom: 10,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: "900",
    color: "#fff",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  heroSubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.85)",
    marginTop: 6,
    textAlign: "center",
    lineHeight: 20,
  },
  scrollContent: {
    flex: 1,
  },
  scrollContentContainer: {
    paddingHorizontal: 12,
    paddingBottom: 80,
  },
  sectionHeader: {
    marginBottom: 12,
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#D4E8E0",
    shadowColor: "#1E5248",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeaderGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 10,
  },
  sectionHeaderIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: 0.3,
    flex: 1,
  },
  list: {
    gap: 0,
  },
  emptyState: {
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 24,
    backgroundColor: "#fff",
    borderRadius: 14,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "#D4E8E0",
  },
  noDataText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
  },
});
