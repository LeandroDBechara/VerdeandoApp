import { View, Text, FlatList, StyleSheet, Image } from "react-native";
import type { datos } from "@/contexts/LeaderboardsContext";
import { getResiduoIcon } from "@/contexts/IntercambiosContext";


type TablaMaterialProps = {
  datos: datos[];
  unidad?: string;
};

export default function TablaMaterial({ datos, unidad = "" }: TablaMaterialProps) {

  return (
    <View>
      <FlatList
        data={datos}
        keyExtractor={(item, index) => `${item.nombre}-${index}`}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <View style={styles.rankingItem}>
            <Text style={styles.rankingItemNombre}>{item.nombre}
            <Image source={item.icono} style={{ width: 15, height: 15, resizeMode: "contain" }} />
            </Text>
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
    flex: 1,
    fontSize: 16,
    fontWeight: "bold",
    
  },
  rankingItemPuntos: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
