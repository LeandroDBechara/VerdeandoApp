import Evento from "@/components/Evento";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useEventos } from "@/contexts/EventoContext";
import { Evento as EventoType } from "@/contexts/EventoContext";
import { useUser } from "@/contexts/UserContext";
import { useIntercambios } from "@/contexts/IntercambiosContext";

export default function Home() {
  const { eventos } = useEventos();
  const { user } = useUser();
  const { getResiduosReciclados } = useIntercambios();

  const displayName = user?.nombre?.trim() || "Reciclaneito";

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <LinearGradient
        colors={["#1E5248", "#2C7865", "#3D9A82"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.heroBanner}
      >
        <View style={styles.heroRow}>
          <View style={styles.heroTextBlock}>
            <Text style={styles.heroGreeting}>Hola, {displayName}!</Text>
            <Text style={styles.heroSubtitle}>
              Seguí reciclando y participá en eventos para sumar puntos
            </Text>
          </View>
          <Image
            source={require("@/assets/images/chica-planta.png")}
            style={styles.heroImage}
            resizeMode="contain"
          />
        </View>
      </LinearGradient>

      <LinearGradient
        colors={["#1E5248", "#2C7865"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.statsCard}
      >
        <Text style={styles.statsLabel}>Tu progreso</Text>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <View style={styles.statIconWrap}>
              <FontAwesome6 name="star" size={16} color="#FFD700" />
            </View>
            <Text style={styles.statValue}>{user?.puntos ?? 0}</Text>
            <Text style={styles.statCaption}>Puntos</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <View style={styles.statIconWrap}>
              <FontAwesome6 name="recycle" size={16} color="#FFD700" />
            </View>
            <Text style={styles.statValue}>{getResiduosReciclados()}</Text>
            <Text style={styles.statCaption}>Reciclados (g)</Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.sectionHeader}>
        <LinearGradient
          colors={["#2C7865", "#1E5248"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.sectionHeaderGradient}
        >
          <View style={styles.sectionHeaderIcon}>
            <FontAwesome6 name="calendar-days" size={16} color="#FFD700" />
          </View>
          <Text style={styles.sectionTitle}>Eventos</Text>
        </LinearGradient>
      </View>

      <View style={styles.eventsList}>
        {eventos.map((evento: EventoType) => (
          <Evento key={evento.id} evento={evento} />
        ))}
        {eventos.length === 0 && (
          <View style={styles.emptyState}>
            <FontAwesome6 name="calendar-xmark" size={28} color="#2C7865" />
            <Text style={styles.noDataText}>No hay eventos en este momento</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EEF6F3",
  },
  content: {
    paddingBottom: 80,
  },
  heroBanner: {
    paddingTop: 20,
    paddingBottom: 24,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    marginBottom: 16,
  },
  heroRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  heroTextBlock: {
    flex: 1,
  },
  heroGreeting: {
    fontSize: 24,
    fontWeight: "900",
    color: "#fff",
    letterSpacing: 0.3,
  },
  heroSubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.85)",
    marginTop: 6,
    lineHeight: 20,
  },
  heroImage: {
    width: 100,
    height: 120,
  },
  statsCard: {
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "rgba(255, 215, 0, 0.35)",
    shadowColor: "#1E5248",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  statsLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "rgba(255,255,255,0.65)",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 14,
  },
  statsRow: {
    flexDirection: "row",
    backgroundColor: "rgba(0,0,0,0.2)",
    borderRadius: 12,
    paddingVertical: 14,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  statIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  statValue: {
    fontSize: 28,
    fontWeight: "900",
    color: "#FFD700",
    marginTop: 2,
  },
  statCaption: {
    fontSize: 11,
    fontWeight: "700",
    color: "rgba(255,255,255,0.6)",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  statDivider: {
    width: 1,
    backgroundColor: "rgba(255,255,255,0.2)",
    marginVertical: 4,
  },
  sectionHeader: {
    marginHorizontal: 16,
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
  },
  eventsList: {
    paddingHorizontal: 12,
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
