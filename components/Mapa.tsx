import { useEffect, useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import * as Location from "expo-location";
import { PuntoVerde, usePuntoVerde } from "@/contexts/PuntoVerdeContext";
import { useUser } from "@/contexts/UserContext";
import { Residuo } from "@/contexts/IntercambiosContext";

interface SearchResult {
  latitude: number;
  longitude: number;
  address: string;
}

export default function Mapa({ 
  setModalVisible, 
  searchText, 
  selectedResiduo 
}: { 
  setModalVisible: (visible: boolean, puntoVerde: PuntoVerde) => void;
  searchText: string;
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
      if (searchText.trim()) {
        searchAddress(searchText);
      } else {
        setSearchResult(null);
      }
    }, 1000); // Esperar 1 segundo después de que el usuario deje de escribir

    return () => clearTimeout(timeoutId);
  }, [searchText]);

  useEffect(() => {
    filterPuntosVerdes();
  }, [selectedResiduo, puntosVerdes]);

  const filterPuntosVerdes = () => {
    if (!selectedResiduo) {
      setFilteredPuntosVerdes(puntosVerdes);
      return;
    }

    const filtered = puntosVerdes.filter(puntoVerde => 
      puntoVerde.residuosAceptados?.includes(selectedResiduo.material || '')
    );
    setFilteredPuntosVerdes(filtered);
  };

  const searchAddress = async (address: string) => {
    try {
      // Primero intentar con Nominatim
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`,
        {
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'VerdeandoApp/1.0'
          }
        }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('La respuesta no es JSON válido');
      }
      
      const data = await response.json();
      
      if (data && data.length > 0) {
        const location = data[0];
        setSearchResult({
          latitude: parseFloat(location.lat),
          longitude: parseFloat(location.lon),
          address: location.display_name
        });
        return;
      }
      
      // Si no se encuentra, intentar con una búsqueda más simple
      console.log('Intentando búsqueda alternativa para:', address);
      
      // Fallback: buscar solo con la primera parte de la dirección
      const simpleAddress = address.split(',')[0].trim();
      if (simpleAddress !== address) {
        const simpleResponse = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(simpleAddress)}&limit=1`,
          {
            headers: {
              'Accept': 'application/json',
              'User-Agent': 'VerdeandoApp/1.0'
            }
          }
        );
        
        if (simpleResponse.ok) {
          const simpleData = await simpleResponse.json();
          if (simpleData && simpleData.length > 0) {
            const location = simpleData[0];
            setSearchResult({
              latitude: parseFloat(location.lat),
              longitude: parseFloat(location.lon),
              address: location.display_name
            });
            return;
          }
        }
      }
      
    } catch (error) {
      console.error('Error al buscar dirección:', error);
      // En caso de error, usar coordenadas por defecto
      setSearchResult({
        latitude: -26.815939568519156,
        longitude: -65.21566985440371,
        address: `Ubicación por defecto: ${address}`
      });
    }
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
    setOrigin(current);
  }

  const handleSearchMarkerDrag = (e: any) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setSearchResult(prev => prev ? { ...prev, latitude, longitude } : null);
    console.log(`Coordenadas del marker: ${latitude}, ${longitude}`);
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: searchResult?.latitude || origin.latitude || -26.815939568519156,
          longitude: searchResult?.longitude || origin.longitude || -65.21566985440371,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {/* Marker de búsqueda */}
        {searchResult && (
          <Marker 
            coordinate={{ 
              latitude: searchResult.latitude, 
              longitude: searchResult.longitude 
            }}
            pinColor="green"
            draggable={true}
            onDragEnd={handleSearchMarkerDrag}
            title="Ubicación buscada"
            description={searchResult.address}
          />
        )}

        {/* Puntos verdes filtrados */}
        {filteredPuntosVerdes.map((puntoVerde) => (
          <Marker 
            key={puntoVerde.id} 
            coordinate={{ 
              latitude: puntoVerde.latitud || 0, 
              longitude: puntoVerde.longitud || 0 
            }} 
            onPress={() => {setModalVisible(true, puntoVerde)}}
            pinColor="red"
            title={puntoVerde.nombre}
            description={puntoVerde.direccion}
          />
        ))} 
      </MapView>

      {/* Información de coordenadas del marker de búsqueda */}
      {searchResult && (
        <View style={styles.coordinatesInfo}>
          <Text style={styles.coordinatesText}>
            Lat: {searchResult.latitude.toFixed(6)}
          </Text>
          <Text style={styles.coordinatesText}>
            Lng: {searchResult.longitude.toFixed(6)}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  coordinatesInfo: {
    position: "absolute",
    bottom: 20,
    left: 20,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    padding: 10,
    borderRadius: 8,
  },
  coordinatesText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
});
