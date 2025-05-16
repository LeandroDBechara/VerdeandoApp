import { View, Text, Pressable } from "react-native";
import React from "react";

const tabs = ["Diario", "Semanal", "Mensual"];

export default function StatsTabs({ activeTab, onTabChange }: { activeTab: string; onTabChange: (tab: string) => void }) {
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-around", paddingVertical: 10 }}>
      {tabs.map((tab) => (
        <Pressable key={tab} onPress={() => onTabChange(tab)}>
          <Text style={{ fontWeight: activeTab === tab ? "bold" : "normal", color: activeTab === tab ? "green" : "black" }}>{tab}</Text>
        </Pressable>
      ))}
    </View>
  );
}