import { StyleSheet, Text, View, Image, TouchableOpacity, Modal } from "react-native";
import { Colors } from "../constants/Colors";
import { Recompensa, useRecompensas } from "@/contexts/RecompensaContext";
import { useState } from "react";


export default function Cupon({ recompensa }: { recompensa: Recompensa }) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { canjearRecompensa } = useRecompensas();
  return (
    <View style={styles.cupon}>      
      <View style={styles.contenido}>
        <Image source={{ uri: recompensa.foto }} style={styles.imagen} resizeMode="contain" />
        
        <View style={styles.info}>
          <Text style={styles.nombre}>{recompensa.titulo}</Text>
          <Text style={styles.precio}>{recompensa.puntos}</Text>
        </View>
        
        <TouchableOpacity style={styles.botonCanjear} onPress={() => setIsModalVisible(true)}>
          <Text style={styles.textoBoton}>Canjear</Text>
        </TouchableOpacity>
      </View>
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.nombre}>{recompensa.titulo}</Text>
            <Image source={{ uri: recompensa.foto }} style={styles.modalImage} resizeMode="contain" />
            <Text style={styles.descripcion}>{recompensa.descripcion}</Text>
            <Text style={styles.precio}>Puntos requeridos: {recompensa.puntos}</Text>
            <Text style={styles.cantidad}>Cantidad disponible: {recompensa.cantidad}</Text>
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.botonCanjearModal} onPress={() => {setIsModalVisible(false); canjearRecompensa(recompensa.id || "")  }}>
                <Text style={styles.textoBoton}>Canjear</Text>
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
    borderRadius: 15,
    width: "90%",
    alignItems: "stretch",
  },
  modalImage: {
    width: "100%",
    height: 180,
    borderRadius: 8,
    marginVertical: 12,
  },
  modalActions: {
    width: "100%",
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  botonCanjearModal: {
    backgroundColor: Colors.light.tint,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    minWidth: 120,
    alignItems: "center",
  },
  descripcion: {
    fontSize: 14,
    color: "#333",
  },
  cantidad: {
    fontSize: 14,
    color: "#333",
  },
});

