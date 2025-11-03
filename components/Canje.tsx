import { StyleSheet, Text, View, Image, TouchableOpacity, Modal } from "react-native";
import { Colors } from "../constants/Colors";
import { Canje as CanjeType, Recompensa } from "@/contexts/RecompensaContext";
import { useState } from "react";


export default function Canje({ canje }: { canje: CanjeType }) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  return (
    <View style={styles.cupon}>
      <TouchableOpacity style={styles.contenido} activeOpacity={0.8} onPress={() => setIsModalVisible(true)}>
        <Image source={{ uri: canje.recompensa?.foto }} style={styles.imagen} resizeMode="contain" />
        <View style={styles.info}>
          <Text style={styles.nombre}>{canje.recompensa?.titulo}</Text>
          <Text style={styles.precio}>{canje.recompensa?.puntos}</Text>
        </View>
      </TouchableOpacity>
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.nombre}>{canje.recompensa?.titulo}</Text>
            <Image source={{ uri: canje.recompensa?.foto }} style={styles.modalImage} resizeMode="contain" />
            <Text style={styles.descripcion}>{canje.recompensa?.descripcion}</Text>
            <Text style={styles.precio}>Puntos requeridos: {canje.recompensa?.puntos}</Text>
            <Text style={styles.fecha}>Fecha de canjeo: {canje.fechaDeCanjeo}</Text>
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.botonCanjear} onPress={() => setIsModalVisible(false)}>
                <Text style={styles.textoBoton}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  cupon: {
    backgroundColor: "white",
    borderRadius: 15,
    margin: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  puntoCorte: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#f0f0f0",
    borderWidth: 2,
    borderColor: "#ddd",
  },
  contenido: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "white",
  },
  imagen: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 15,
  },
  info: {
    flex: 1,
  },
  nombre: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  precio: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.light.tint,
  },
  botonCanjear: {
    backgroundColor: Colors.light.tint,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginLeft: 10,
  },
  textoBoton: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "90%",
    alignItems: "center",
  },
  modalImage: {
    width: "100%",
    height: 180,
    borderRadius: 8,
    marginVertical: 12,
  },
  modalActions: {
    width: "100%",
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  descripcion: {
    fontSize: 14,
    color: "#333",
  },
  cantidad: {
    fontSize: 14,
    color: "#333",
  },
  fecha: {
    fontSize: 14,
    color: "#333",
  },
});

