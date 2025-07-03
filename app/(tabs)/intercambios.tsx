import { View, ScrollView, StyleSheet, Text, Pressable, Modal, TextInput, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import StatsTabs from "../../components/estadisticas/StatsTabs";
import StatsSummary from "../../components/estadisticas/Summary";
import BarGraph from "@/components/estadisticas/BarGraph";
import Intercambio from "@/components/Intercambio";
import { useIntercambios } from "@/contexts/IntercambiosContext";
import { useUser } from "@/contexts/UserContext";
import { CameraView } from "expo-camera";
import ResiduoIntercambio from "@/components/ResiduoIntercambio";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function Intercambios() {
  const [activeTab, setActiveTab] = useState("Realizados");
  const { intercambios, addIntercambio, residuos } = useIntercambios();
  const { user } = useUser();
  const [modalVisible, setModalVisible] = useState(false);
  const [codigo, setCodigo] = useState("");
  const [residuosData, setResiduosData] = useState<{ [key: string]: { selected: boolean; peso: string } }>({});

  const handleResiduoDataChange = (residuoId: string, selected: boolean, peso: string) => {
    setResiduosData((prev) => ({
      ...prev,
      [residuoId]: { selected, peso },
    }));
  };

  const handleCrearIntercambio = async () => {
    // Filtrar solo los residuos seleccionados que tengan peso
    const residuosSeleccionados = Object.entries(residuosData)
      .filter(([_, data]) => data.selected && data.peso.trim() !== "")
      .map(([residuoId, data]) => ({
        residuoId,
        peso: parseFloat(data.peso) || 0,
      }));

    if (residuosSeleccionados.length === 0) {
      alert("Debes seleccionar al menos un residuo con peso");
      return;
    }

    try {
      await addIntercambio({
        usuarioId: user?.id || "",
        codigoCupon: codigo,
        detalleIntercambio : residuosSeleccionados.map((r) => ({
          residuo: residuos?.find((res) => res.id === r.residuoId) || {
            id: r.residuoId,
            material: "",
            icon: require("@/assets/icons/papel.png"),
          },
          pesoGramos: r.peso,
        })),
      });

      // Limpiar el formulario
      setCodigo("");
      setResiduosData({});
      setModalVisible(false);
    } catch (error) {
      console.error("Error al crear intercambio:", error);
      alert("Error al crear el intercambio");
    }
  };

  return (
    <View style={styles.container}>
      <StatsTabs activeTab={activeTab} onTabChange={setActiveTab} tabs={["Realizados", "Pendientes"]} />
      <ScrollView style={styles.scrollView}>
        {activeTab === "Realizados" && (
          <>
            <BarGraph />
            {intercambios.map((intercambio) => (
              <Intercambio key={intercambio.id} intercambio={intercambio} />
            ))}
          </>
        )}
        {activeTab === "Pendientes" && (
          <>
          {intercambios.map((intercambio) => (
            <Intercambio key={intercambio.id} intercambio={intercambio} />
          ))}
          </>
        )}
      </ScrollView>
      <Pressable style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.addButtonText}>+</Text>
      </Pressable>

      {user?.rol === "COLABORADOR" && (
        <Pressable
          style={styles.qrscanButton}
          onPress={() => {
            router.navigate("/camera");
          }}
        >
          <MaterialIcons style={styles.qrscanButtonText} name="qr-code-scanner" size={24} color="white" />
        </Pressable>
      )}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity style={styles.modalContainer} activeOpacity={1} onPress={() => setModalVisible(false)}>
          <TouchableOpacity style={styles.modalContent} activeOpacity={1} onPress={() => {}}>
            <Text>Intercambio</Text>
            <View style={styles.modalBasuraContainer}>
              {residuos && residuos.map((residuo) => (
                <ResiduoIntercambio key={residuo.id} residuo={residuo} onDataChange={handleResiduoDataChange} />
              ))}
            </View>
            <View style={styles.modalCodigoContainer}>
              <Text style={styles.modalCodigoText}>Código:</Text>
              <View style={styles.modalCodigoInputContainer}>
                <TextInput placeholder="Código" keyboardType="numeric" onChangeText={setCodigo} value={codigo} />
              </View>
            </View>
            <View style={styles.modalCodigoButtonContainer}>
              <Pressable style={styles.modalCodigoButton} onPress={handleCrearIntercambio}>
                <Text>Crear intercambio</Text>
              </Pressable>

            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
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
    bottom: 70,
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
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    
  },
  modalContent: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "90%",
    gap: 30,
  },
  modalButton: {
    backgroundColor: "green",
    padding: 10,
    borderRadius: 5,
  },
  modalButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalBasuraContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 10,
  },
  modalCodigoContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 10,
  },
  modalCodigoInputContainer: {
        height: 40,
        backgroundColor: "white",
        borderColor: "#D9D9D9",
        borderWidth: 1,
        color: "#929292",
        padding: 10,
  },
  modalCodigoButton: {
    backgroundColor: "lightgreen",
    padding: 10,
    borderRadius: 5,
  },
  modalCodigoButtonContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 20,
    marginBottom: 20,
  },
  modalCodigoText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  qrscanButton: {
    position: "absolute",
    bottom: 70,
    left: 5,
    borderRadius: 25,
    backgroundColor: "green",
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  qrscanButtonText: {
    fontSize: 30,
    color: "white",
  },
  cameraView: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
});
