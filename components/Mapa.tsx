import { useEffect, useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { PuntoVerde, usePuntoVerde } from "@/contexts/PuntoVerdeContext";
import { Residuo } from "@/contexts/IntercambiosContext";
import { LocationGeocodedAddress } from "expo-location";

export let ubicacion: Ubicacion | null = null;

interface Ubicacion {
  latitude: number;
  longitude: number;
}
interface SearchResult {
  latitude: number;
  longitude: number;
  address: string;
}

export default function Mapa({ 
  setModalVisible, 
  searchText, 
  selectedResiduo,
}: { 
  setModalVisible: (visible: boolean, puntoVerde: PuntoVerde) => void;
  searchText: string | null;
  selectedResiduo: Residuo | null;
}) {  
  const { puntosVerdes } = usePuntoVerde();
  const [origin, setOrigin] = useState({
    latitude: -26.815939568519156,
    longitude: -65.21566985440371,
  });
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [filteredPuntosVerdes, setFilteredPuntosVerdes] = useState<PuntoVerde[]>([]);

  useEffect(() => {
    getLocationPermissions();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchText && searchText.trim()) {
        // Filtrar puntos verdes por texto de búsqueda
        const filtered = puntosVerdes.filter(puntoVerde => {
          const searchLower = searchText.toLowerCase();
          const nombreMatch = puntoVerde.nombre?.toLowerCase().includes(searchLower);
          const direccionMatch = puntoVerde.direccion?.toLowerCase().includes(searchLower);
          return nombreMatch || direccionMatch;
        });
        setFilteredPuntosVerdes(filtered);
      } else {
        setSearchResult(null);
        // Si no hay texto de búsqueda, aplicar solo el filtro de residuos
        filterPuntosVerdes();
      }
    }, 500); // Reducir el tiempo de espera a 500ms para mejor experiencia

    return () => clearTimeout(timeoutId);
  }, [searchText, puntosVerdes]);

  useEffect(() => {
    filterPuntosVerdes();
  }, [selectedResiduo, puntosVerdes]);

  const filterPuntosVerdes = () => {
    let filtered = puntosVerdes;
    
    // Aplicar filtro de residuos si hay uno seleccionado
    if (selectedResiduo) {
      filtered = filtered.filter(puntoVerde => 
        puntoVerde.residuosAceptados?.includes(selectedResiduo.material || '')
      );
    }
    
    // Aplicar filtro de búsqueda si hay texto
    if (searchText && searchText.trim()) {
      const searchLower = searchText.toLowerCase();
      filtered = filtered.filter(puntoVerde => {
        const nombreMatch = puntoVerde.nombre?.toLowerCase().includes(searchLower);
        const direccionMatch = puntoVerde.direccion?.toLowerCase().includes(searchLower);
        return nombreMatch || direccionMatch;
      });
    }
    
    setFilteredPuntosVerdes(filtered);
  };

  async function getLocationPermissions() {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access location was denied");
      return;
    }
    let location = await Location.getCurrentPositionAsync({});  
    const current = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    }
    ubicacion = {
      latitude: current.latitude,
      longitude: current.longitude,
    }
    setOrigin(current);
  }
 
  return (
    <View style={{flex: 1, width: "100%", height: "100%"}}>
      <MapView
        style={styles.map}
        showsUserLocation={true}
        initialRegion={{
          latitude: origin.latitude,
          longitude: origin.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {/* Puntos verdes filtrados */}
        {filteredPuntosVerdes.map((puntoVerde: PuntoVerde) => (
          <Marker 
            key={puntoVerde.id} 
            coordinate={{ 
              latitude: puntoVerde.latitud || 0, 
              longitude: puntoVerde.longitud || 0 
            }} 
            onPress={() => {setModalVisible(true, puntoVerde);}}
            pinColor="red"
            title={puntoVerde.nombre}
            description={puntoVerde.direccion}
          />
        ))} 
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({

  map: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
});
