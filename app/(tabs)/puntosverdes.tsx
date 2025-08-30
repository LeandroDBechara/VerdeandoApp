import BasuraTipos from "@/components/BasuraTipos";
import Mapa from "@/components/Mapa";
import ModalCrearPV from "@/components/ModalCrearPV";
import ModalDetallePuntoVerde from "@/components/ModalDetallePuntoVerde";
import { useIntercambios, Residuo } from "@/contexts/IntercambiosContext";
import { PuntoVerde } from "@/contexts/PuntoVerdeContext";
import { useUser } from "@/contexts/UserContext";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useState } from "react";
import { Text, View, Pressable, StyleSheet, TextInput, TouchableOpacity, Modal, Image } from "react-native";

export default function PuntosVerdes() {
  const [searchText, setSearchText] = useState("");
  const {residuos} = useIntercambios();
  const {user} = useUser();
  const [ModalPVVisible, setModalPVVisible] = useState<[boolean, PuntoVerde | null]>([false, null]);
  const [ModalCreatePV, setModalCreatePV] = useState(false);
  const [selectedResiduo, setSelectedResiduo] = useState<Residuo | null>(null);
  const handleSearch = (text: string) => {
    setSearchText(text);
  };

  const clearSearch = () => {
    setSearchText("");
  };
  

  return (
    <View style={{flex: 1, width: "100%", height: "100%"}}>
      <Mapa 
        setModalVisible={(visible, puntoVerde) => setModalPVVisible([visible, puntoVerde])} 
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
        {/* Buscador */}
       <View>
          <View style={styles.searchContainer}>
            <FontAwesome6 name="magnifying-glass" size={20} color="lightgreen" style={styles.searchIcon} />
            <TextInput
              style={styles.input}
              placeholder="Buscar punto verde..."
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

        {/* Residuos */}
        <View
          style={{ flexDirection: "row", justifyContent: "space-around", paddingVertical: 5, flexWrap: "wrap", gap: 5 }}
        >
          {residuos.map((residuo) => (
            <BasuraTipos 
              key={residuo.id} 
              residuo={residuo} 
              selected={false}
              setSelected={() => {}}
            />
          ))}
        </View>

        {/* Botón de crear punto verde */}
      </View>
      {user?.rol === "COLABORADOR" && (
        <View>
          <Pressable style={styles.addButton} onPress={() => {
            setModalPVVisible([false, null]);
            setModalCreatePV(true);
            
          }}>
            <Text style={styles.addButtonText}>+</Text>
          </Pressable>

          <ModalCrearPV ModalCreatePV={ModalCreatePV} setModalCreatePV={setModalCreatePV} />
        </View>
      )}
      <ModalDetallePuntoVerde modalPVVisible={ModalPVVisible} setModalPVVisible={setModalPVVisible} />
    </View>

  );
}

const styles = StyleSheet.create({
 
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
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
});
