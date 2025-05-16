import { View, ScrollView } from "react-native";
import React, { useState } from "react";
import StatsTabs from "../../components/estadisticas/StatsTabs";
import DonutChart from "../../components/estadisticas/DonutChart";
import StatsSummary from "../../components/estadisticas/Summary";
import BarChart from "@/components/estadisticas/BarChart";

export default function Estadisticas() {
  const [activeTab, setActiveTab] = useState("Mensual");

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "white" }}>
      <StatsTabs activeTab={activeTab} onTabChange={setActiveTab} />
      <DonutChart />
      <BarChart />
      <StatsSummary />
    </ScrollView>
  );
}