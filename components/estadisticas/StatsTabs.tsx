import { View, Text, Pressable } from "react-native";
import React from "react";

export default function StatsTabs({ activeTab, onTabChange, tabs }: { activeTab: string; onTabChange: (tab: string) => void, tabs: string[] }) {
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