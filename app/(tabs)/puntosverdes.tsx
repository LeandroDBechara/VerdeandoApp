import BasuraTipos from "@/components/BasuraTipos";
import Mapa from "@/components/Mapa";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useState } from "react";
import { Text, View, Pressable, StyleSheet, TextInput, TouchableOpacity } from "react-native";

export default function PuntosVerdes() {
  const [searchText, setSearchText] = useState("");

  const handleSearch = (text: string) => {
    setSearchText(text);
  };

  const clearSearch = () => {
    setSearchText("");
  };
  return (
    <View>
      <Mapa />
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
              placeholder="Buscar..."
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
          <BasuraTipos icon="newspaper" text="Papel" />
          <BasuraTipos icon="bottle-water" text="Plastico" />
          <BasuraTipos icon="wine-bottle" text="Vidrio" />
          <BasuraTipos icon="bowl-food" text="Orgánico" />
          <BasuraTipos icon="battery-quarter" text="Batería" />
        </View>
      </View>
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
});
