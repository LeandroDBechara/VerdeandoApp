import { View, Text, FlatList, StyleSheet, Image } from "react-native";
import type { datos } from "@/contexts/LeaderboardsContext";

type TablaMaterialProps = {
  datos: datos[];
  unidad?: string;
};

const RANK_COLORS = ["#FFD700", "#C0C0C0", "#CD7F32"];

function formatValor(valor: number): string {
  if (valor >= 1000) {
    return valor.toLocaleString("es-AR");
  }
  return String(valor);
}

export default function TablaMaterial({ datos, unidad = "" }: TablaMaterialProps) {
  return (
    <View style={styles.container}>
      <View style={styles.tableHeader}>
        <View style={styles.headerRankCell}>
          <Text style={styles.headerRank}>#</Text>
        </View>
        <Text style={styles.headerName}>Material</Text>
        <Text style={styles.headerScore}>Cantidad</Text>
      </View>
      <FlatList
        data={datos}
        keyExtractor={(item, index) => `${item.nombre}-${index}`}
        scrollEnabled={false}
        renderItem={({ item, index }) => {
          const rank = index + 1;
          const isTopThree = rank <= 3;
          const accentColor = isTopThree ? RANK_COLORS[rank - 1] : "#2C7865";

          return (
            <View
              style={[
                styles.rankingItem,
                isTopThree
                  ? { borderLeftColor: accentColor, backgroundColor: "#FAFFFE" }
                  : index % 2 === 0
                    ? styles.rankingItemAlt
                    : styles.rankingItemEven,
              ]}
            >
              <View style={styles.rankColumn}>
                <View
                  style={[
                    styles.rankBadge,
                    isTopThree && { backgroundColor: accentColor, borderColor: accentColor },
                  ]}
                >
                  <Text style={[styles.rankText, isTopThree && styles.rankTextTop]}>{rank}</Text>
                </View>
              </View>

              <View style={styles.nameRow}>
                {item.icono && (
                  <Image source={item.icono} style={styles.materialIcon} />
                )}
                <Text style={styles.rankingItemNombre} numberOfLines={1}>
                  {item.nombre}
                </Text>
              </View>

              <View style={[styles.scorePill, isTopThree && { borderColor: accentColor }]}>
                <Text style={[styles.rankingItemPuntos, isTopThree && { color: accentColor }]}>
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
  rankTextTop: {
    color: "#fff",
  },
  nameRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  materialIcon: {
    width: 22,
    height: 22,
    resizeMode: "contain",
  },
  rankingItemNombre: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
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
