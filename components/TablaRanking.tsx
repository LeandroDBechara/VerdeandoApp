import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { View, Text, FlatList, StyleSheet } from "react-native";
import type { datos } from "@/contexts/LeaderboardsContext";

type TablaRankingProps = {
  datos: datos[];
  unidad?: string;
  scoreLabel?: string;
};

const MEDAL_STYLES: Record<
  number,
  { color: string; bg: string; border: string; icon: "trophy" | "medal" }
> = {
  1: { color: "#FFD700", bg: "#FFFBE6", border: "#FFD700", icon: "trophy" },
  2: { color: "#A8A8A8", bg: "#F4F4F4", border: "#C0C0C0", icon: "medal" },
  3: { color: "#CD7F32", bg: "#FFF4E8", border: "#CD7F32", icon: "medal" },
};

function formatValor(valor: number): string {
  if (valor >= 1000) {
    return valor.toLocaleString("es-AR");
  }
  return String(valor);
}

export default function TablaRanking({ datos, unidad = "", scoreLabel = "Puntuacion" }: TablaRankingProps) {
  return (
    <View style={styles.container}>
      <View style={styles.tableHeader}>
        <View style={styles.headerRankCell}>
          <Text style={styles.headerRank}>#</Text>
        </View>
        <Text style={styles.headerName}>Jugador</Text>
        <Text style={styles.headerScore}>{scoreLabel}</Text>
      </View>
      <FlatList
        data={datos}
        keyExtractor={(item, index) => `${item.nombre}-${index}`}
        scrollEnabled={false}
        renderItem={({ item, index }) => {
          const rank = index + 1;
          const medal = MEDAL_STYLES[rank];
          const isTopThree = rank <= 3;

          return (
            <View
              style={[
                styles.rankingItem,
                isTopThree && medal
                  ? {
                      backgroundColor: medal.bg,
                      borderLeftColor: medal.border,
                    }
                  : rank % 2 === 0
                    ? styles.rankingItemAlt
                    : styles.rankingItemEven,
              ]}
            >
              <View style={styles.rankColumn}>
                {isTopThree && medal ? (
                  <View style={[styles.medalBadge, { backgroundColor: medal.color }]}>
                    <FontAwesome6 name={medal.icon} size={14} color="#fff" />
                  </View>
                ) : (
                  <View style={styles.rankBadge}>
                    <Text style={styles.rankText}>{rank}</Text>
                  </View>
                )}
              </View>

              <Text style={[styles.rankingItemNombre, isTopThree && styles.rankingItemNombreTop]} numberOfLines={1}>
                {item.nombre}
              </Text>

              <View style={[styles.scorePill, isTopThree && medal && { borderColor: medal.color }]}>
                <Text style={[styles.rankingItemPuntos, isTopThree && medal && { color: medal.color }]}>
                  {formatValor(item.valor)}
                  {unidad ? ` ${unidad}` : ""}
                </Text>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#D4E8E0",
  },
  tableHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: "#1E5248",
    gap: 8,
    borderLeftWidth: 3,
    borderLeftColor: "transparent",
  },
  headerRankCell: {
    width: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  headerRank: {
    fontSize: 11,
    fontWeight: "700",
    color: "#A8D5C8",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    textAlign: "center",
  },
  headerName: {
    flex: 1,
    fontSize: 11,
    fontWeight: "700",
    color: "#A8D5C8",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  headerScore: {
    fontSize: 11,
    fontWeight: "700",
    color: "#A8D5C8",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  rankingItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E8F2EE",
    borderLeftWidth: 3,
    borderLeftColor: "transparent",
    gap: 8,
  },
  rankingItemEven: {
    backgroundColor: "#FAFFFE",
  },
  rankingItemAlt: {
    backgroundColor: "#F0FAF7",
  },
  rankColumn: {
    width: 36,
    alignItems: "center",
  },
  medalBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  rankBadge: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: "#E8F2EE",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#C5DDD4",
  },
  rankText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#2C7865",
  },
  rankingItemNombre: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
  },
  rankingItemNombreTop: {
    fontWeight: "800",
    color: "#1E5248",
  },
  scorePill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#D4E8E0",
  },
  rankingItemPuntos: {
    fontSize: 13,
    fontWeight: "800",
    color: "#2C7865",
  },
});
