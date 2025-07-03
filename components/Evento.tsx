import { View, Text, Image, StyleSheet, TouchableOpacity, Modal } from "react-native";
import { Evento as EventoType } from "@/contexts/EventoContext";

import { useState } from "react";

// Función para formatear fecha en formato europeo DD-MM-YYYY
const formatearFechaEuropea = (fecha: Date | string | undefined): string => {
  if (!fecha) return "Fecha no disponible";

  const fechaObj = new Date(fecha);
  if (isNaN(fechaObj.getTime())) return "Fecha inválida";

  const dia = fechaObj.getDate().toString().padStart(2, "0");
  const mes = (fechaObj.getMonth() + 1).toString().padStart(2, "0");
  const año = fechaObj.getFullYear();

  return `${dia}/${mes}/${año}`;
};

export default function Evento({ evento }: { evento: EventoType }) {
  const { titulo, descripcion, imagen, fechaInicio, fechaFin, puntosVerdesPermitidos } = evento;
  const fechaInicioFormateada = formatearFechaEuropea(fechaInicio);
  const fechaFinFormateada = formatearFechaEuropea(fechaFin);
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <View style={{marginBottom: 10}}>
      <TouchableOpacity
        onPress={() => {
          setModalVisible(true);
        }}
      >
        <View style={styles.container}>
          <Image source={{ uri: imagen }} style={styles.image} />
          <View style={styles.infoContainer}>   
            <Text style={styles.title}>{titulo}</Text>
          </View>
        </View>
      </TouchableOpacity>
      <Modal visible={modalVisible} transparent={true} animationType="fade" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <Image source={{ uri: imagen }} style={styles.modalImage} />
          <Text style={styles.modalTitle}>{titulo}</Text>
          <Text style={styles.modalDate}>Detalles del evento:</Text>
          <Text style={styles.modalDescription}>{descripcion}</Text>
          <Text style={styles.modalDate}>Duracion: {fechaInicioFormateada} - {fechaFinFormateada}</Text>
          {puntosVerdesPermitidos && puntosVerdesPermitidos.length > 0 && (
            <Text style={styles.modalPoints}>Puntos verdes habilitados: {puntosVerdesPermitidos.join(", ")}</Text>
          )}
          <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalCloseButton}>
            <Text style={styles.modalCloseButtonText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 10,
    margin: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  image: {
    width: "100%",
    height: 100,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    marginTop: 10,
    color: "black",
    
  },
  infoContainer: {

    backgroundColor: "white",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    
    width: "100%",
  },
  modalContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    backgroundColor: "white",
    width: "95%",
    padding: 10,
    borderRadius: 10,
  },
  modalImage: {
    width: "80%",
    height: "25%",
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  modalDescription: {
    fontSize: 16,
  },
  modalDate: {
    fontSize: 14,
  },
  modalPoints: {
    fontSize: 12,
  },
  modalCloseButton: {
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 10,
  },
  modalCloseButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
