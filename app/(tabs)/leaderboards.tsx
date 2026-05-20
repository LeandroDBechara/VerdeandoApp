import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useUser } from "@/contexts/UserContext";

export default function Leaderboards() {
  const { user } = useUser();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <FontAwesome6 name="trophy" size={48} color="#2C7865" />
        <Text style={styles.title}>Ranking</Text>
        <Text style={styles.subtitle}>Ranking de reciclaneitos</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Tu progreso</Text>
        <Text style={styles.points}>{user?.puntos ?? 0} puntos</Text>
        <Text style={styles.hint}>
          La clasificación global estará disponible pronto.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    padding: 16,
    paddingBottom: 80,
  },
  header: {
    alignItems: "center",
    paddingVertical: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#2C7865",
    marginTop: 12,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginTop: 4,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  points: {
    fontSize: 28,
    fontWeight: "bold",
    color: "green",
    marginBottom: 12,
  },
  hint: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
  },
});
