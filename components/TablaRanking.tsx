import { View, Text, FlatList, StyleSheet } from "react-native";
import type { datos } from "@/contexts/LeaderboardsContext";

type TablaRankingProps = {
  datos: datos[];
  unidad?: string;
};

export default function TablaRanking({ datos, unidad = "" }: TablaRankingProps) {

  return (
    <View>
      <FlatList
        data={datos}
        keyExtractor={(item, index) => `${item.nombre}-${index}`}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <View style={styles.rankingItem}>
            <Text style={styles.rankingItemNombre}>{item.nombre}</Text>
            <Text style={styles.rankingItemPuntos}>{item.valor}{unidad ? ` ${unidad}` : ""}</Text>
          </View>
        )}
      />
    </View>
  );

}
const styles = StyleSheet.create({
  rankingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rankingItemNombre: {
    fontSize: 16,
    fontWeight: "bold",
  },
  rankingItemPuntos: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
