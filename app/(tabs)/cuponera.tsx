import { ScrollView, View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Cupon from "@/components/Cupon";
import { useState } from "react";
import { useRecompensas } from "@/contexts/RecompensaContext";
import { useUser } from "@/contexts/UserContext";
import StatsTabs from "@/components/estadisticas/StatsTabs";
import Canje from "@/components/Canje";

export default function Cuponera() {
  const { recompensas, canjes } = useRecompensas();
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState("Cupones");

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#1E5248", "#2C7865"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.pointsBanner}
      >
        <View style={styles.pointsIcon}>
          <FontAwesome6 name="star" size={20} color="#FFD700" />
        </View>
        <View style={styles.pointsTextBlock}>
          <Text style={styles.pointsLabel}>Tus puntos</Text>
          <Text style={styles.pointsValue}>{user?.puntos ?? 0}</Text>
        </View>
      </LinearGradient>

      <StatsTabs activeTab={activeTab} onTabChange={setActiveTab} tabs={["Cupones", "Canjes"]} />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {activeTab === "Cupones" && (
          <View>
            {recompensas.map((recompensa) => (
              <Cupon key={recompensa.id} recompensa={recompensa} />
            ))}
            {recompensas.length === 0 && (
              <View style={styles.emptyState}>
                <FontAwesome6 name="gift" size={28} color="#2C7865" />
                <Text style={styles.noDataText}>
                  Estamos trabajando en agregar las mejores recompensas para ti
                </Text>
              </View>
            )}
          </View>
        )}
        {activeTab === "Canjes" && (
          <View>
            {canjes.map((canje) => (
              <Canje key={canje.id} canje={canje} />
            ))}
            {canjes.length === 0 && (
              <View style={styles.emptyState}>
                <FontAwesome6 name="ticket" size={28} color="#2C7865" />
                <Text style={styles.noDataText}>
                  No has canjeado ninguna recompensa aún. Seguí participando en eventos y ganá puntos para canjear.
                </Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EEF6F3",
  },
  pointsBanner: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 12,
    marginTop: 12,
    marginBottom: 4,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    gap: 12,
    borderWidth: 2,
    borderColor: "rgba(255, 215, 0, 0.35)",
  },
  pointsIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  pointsTextBlock: {
    flex: 1,
  },
  pointsLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "rgba(255,255,255,0.65)",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  pointsValue: {
    fontSize: 28,
    fontWeight: "900",
    color: "#FFD700",
    marginTop: 2,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 12,
    paddingBottom: 80,
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
