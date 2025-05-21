import { View, ScrollView, StyleSheet, Text, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import StatsTabs from "../../components/estadisticas/StatsTabs";
import StatsSummary from "../../components/estadisticas/Summary";
import BarGraph from "@/components/estadisticas/BarGraph";
import BasuraTipos from "@/components/BasuraTipos";
import Intercambio from "@/components/Intercambio";

export default function Intercambios() {
  const [activeTab, setActiveTab] = useState("Realizados");
  const [intercambios, setIntercambios] = useState<{ id: string, fecha: string, basura: { key: string, icon: string, text: string }[] }[]>([
    {
      id: "1",
      fecha: "2021-01-01",
      basura: [{ key: "1", icon: "paper-plane", text: "Basura" }],
    },
    {
      id: "2",
      fecha: "2021-01-01",
      basura: [{ key: "1", icon: "paper-plane", text: "Basura" }, { key: "2", icon: "paper-plane", text: "Basura" }],
    },
    {
      id: "3",
      fecha: "2021-01-01",
      basura: [{ key: "1", icon: "paper-plane", text: "Basura" }, { key: "2", icon: "paper-plane", text: "Basura" }],
    },
    {
      id: "4",
      fecha: "2021-01-01",
      basura: [{ key: "1", icon: "paper-plane", text: "Basura" }, { key: "2", icon: "paper-plane", text: "Basura" }],
    },
    {
      id: "5",
      fecha: "2021-01-01",
      basura: [{ key: "1", icon: "paper-plane", text: "Basura" }, { key: "2", icon: "paper-plane", text: "Basura" }],
    },
    {
      id: "6",
      fecha: "2021-01-01",
      basura: [{ key: "1", icon: "paper-plane", text: "Basura" }, { key: "2", icon: "paper-plane", text: "Basura" }],
    },
  ]);

  useEffect(() => {
    getIntercambios();
  }, []);

  const getIntercambios = async () => {
    const response = await fetch("https://api.example.com/intercambios");
    const data = await response.json();
    setIntercambios(data);
  };

  const addIntercambio = async () => {
    const response = await fetch("https://api.example.com/intercambios", {
      method: "POST",
    });
    const data = await response.json();
    setIntercambios([...intercambios, data]);
  };

  return (
    <View style={styles.container}>
      <StatsTabs activeTab={activeTab} onTabChange={setActiveTab} />
      <ScrollView style={styles.scrollView}>
        {activeTab === "Realizados" && (
          <>
            <BarGraph />
            {intercambios.map((intercambio) => (
              <Intercambio key={intercambio.id} id={intercambio.id} fecha={intercambio.fecha} basura={intercambio.basura} />
            ))}
          </>
        )}
        {activeTab === "Pendientes" && (
          <>
            {intercambios.map((intercambio) => (
              <Intercambio key={intercambio.id} id={intercambio.id} fecha={intercambio.fecha} basura={intercambio.basura} />
            ))}
          </>
        )}
      </ScrollView>
      <Pressable style={styles.addButton} onPress={addIntercambio}>
        <Text style={styles.addButtonText}>+</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  scrollView: {
    flex: 1,
    marginBottom: 50,
  },
  addButton: {
    position: "absolute",
    bottom:70,
    right: 5,
    borderRadius: 25,
    fontSize: 30,
    backgroundColor: "green",
    width: 50,
    height: 50,

  },
  addButtonText: {
    fontSize: 30,
    color: "white",
    textAlign: "center",
    paddingTop: 4,
  },
});

