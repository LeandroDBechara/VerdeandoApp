import BasuraTipos from "@/components/BasuraTipos";
import Mapa from "@/components/Mapa";
import ModalCrearPV from "@/components/ModalCrearPV";
import { useIntercambios, Residuo } from "@/contexts/IntercambiosContext";
import { PuntoVerde, usePuntoVerde } from "@/contexts/PuntoVerdeContext";
import { useUser } from "@/contexts/UserContext";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useState } from "react";
import { Text, View, Pressable, StyleSheet, TextInput, TouchableOpacity, Modal } from "react-native";

export default function PuntosVerdes() {
  const [searchText, setSearchText] = useState("");
  const [ModalPVVisible, setModalPVVisible] = useState(false);
  const [ModalCreatePV, setModalCreatePV] = useState(false);
  const [selectedResiduo, setSelectedResiduo] = useState<Residuo | null>(null);
  const { user } = useUser();
  const [puntoVerde, setPuntoVerde] = useState<PuntoVerde | null>(null);
  const { residuos } = useIntercambios();
  
  const handleSearch = (text: string) => {
    setSearchText(text);
  };

  const clearSearch = () => {
    setSearchText("");
  };

  const handleModalVisible = (visible: boolean, puntoVerde: PuntoVerde) => {
    setModalPVVisible(visible);
    setPuntoVerde(puntoVerde);
  };

  const handleResiduoSelection = (residuo: Residuo) => {
    if (selectedResiduo?.id === residuo.id) {
      setSelectedResiduo(null);
    } else {
      setSelectedResiduo(residuo);
    }
  };

  return (
    <View>
      <Mapa 
        setModalVisible={handleModalVisible} 
        searchText={searchText}
        selectedResiduo={selectedResiduo}
      />
      <View
        style={{
          position: "absolute",
          top: 12,
          left: 20,
          right: 20,
        }}
      >
        <View>
          <View style={styles.searchContainer}>
            <FontAwesome6 name="magnifying-glass" size={20} color="lightgreen" style={styles.searchIcon} />
            <TextInput
              style={styles.input}
              placeholder="Buscar dirección..."
              value={searchText}
              onChangeText={handleSearch}
              placeholderTextColor="gray"
            />
            {searchText.length > 0 && (
              <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
                <FontAwesome6 name="x" size={14} color="gray" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View
          style={{ flexDirection: "row", justifyContent: "space-around", paddingVertical: 5, flexWrap: "wrap", gap: 5 }}
        >
          {residuos.map((residuo) => (
            <BasuraTipos 
              key={residuo.id} 
              residuo={residuo} 
              selected={selectedResiduo?.id === residuo.id} 
              setSelected={() => handleResiduoSelection(residuo)} 
            />
          ))}
        </View>

        {/* Información del residuo seleccionado */}
        {selectedResiduo && (
          <View style={styles.selectedResiduoInfo}>
            <Text style={styles.selectedResiduoText}>
              Mostrando puntos verdes que aceptan: {selectedResiduo.material}
            </Text>
            <TouchableOpacity 
              style={styles.clearFilterButton}
              onPress={() => setSelectedResiduo(null)}
            >
              <FontAwesome6 name="times" size={16} color="white" />
            </TouchableOpacity>
          </View>
        )}

        <Modal
          animationType="slide"
          transparent={true}
          visible={ModalPVVisible}
          onRequestClose={() => {
            setModalPVVisible(false);
          }}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContent}>
              <Text style={styles.text}>Nombre del local: {puntoVerde?.nombre}</Text>
              <Text style={styles.text}>Dirección del local: {puntoVerde?.direccion}</Text>
              <Text style={styles.text}>Descripción: {puntoVerde?.descripcion}</Text>
              <Text style={styles.text}>Días de atención: {puntoVerde?.diasAtencion}</Text>
              <Text style={styles.text}>Horario de atención: {puntoVerde?.horario}</Text>
              <Text style={styles.text}>Imagen: {puntoVerde?.imagen}</Text>
              <Text style={styles.text}>Colaborador: {puntoVerde?.colaboradorId}</Text>
              {puntoVerde?.residuosAceptados && puntoVerde.residuosAceptados.length > 0 && (
                <Text style={styles.text}>
                  Residuos aceptados: {puntoVerde.residuosAceptados.join(', ')}
                </Text>
              )}
              <Pressable style={styles.closeButton} onPress={() => setModalPVVisible(false)}>
                <Text style={styles.closeButtonText}>Cerrar</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </View>
      {user?.rol === "COLABORADOR" && (
        <View>
          <Pressable style={styles.addButton} onPress={() => {
            setModalPVVisible(false);
            setPuntoVerde(null);
            setModalCreatePV(true);
            
          }}>
            <Text style={styles.addButtonText}>+</Text>
          </Pressable>

          <ModalCrearPV ModalCreatePV={ModalCreatePV} setModalCreatePV={setModalCreatePV} />
        </View>
      )}
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: "white",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 25,
    paddingHorizontal: 15,
    height: 45,
    borderColor: "lightgreen",
    borderWidth: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  clearButton: {
    padding: 5,
  },
  selectedResiduoInfo: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "lightgreen",
    padding: 10,
    borderRadius: 10,
    marginTop: 5,
  },
  selectedResiduoText: {
    flex: 1,
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  clearFilterButton: {
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 15,
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  closeButton: {
    backgroundColor: "lightgreen",
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
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
