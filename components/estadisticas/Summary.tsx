import { View, Text } from "react-native";
import React from "react";

export default function StatsSummary() {
  return (
    <View style={{ marginTop: 10, paddingHorizontal: 20 }}>
      <Text style={{ marginBottom: 5 }}>Mejor día de recolección: XX/XX/XXXX</Text>
      <Text style={{ marginBottom: 5 }}>Recompensas canjeadas: XXXXX</Text>
      <Text>Recompensa mayor reclamada: XXXXXXXXXXXX</Text>
    </View>
  );
}