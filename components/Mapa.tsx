import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import * as Location from "expo-location";

export default function Mapa() {
  const [origin, setOrigin] = useState({
    latitude: -26.815939568519156,
    longitude: -65.21566985440371,
  });
  const [destination, setDestination] = useState({
    latitude: -26.83244074067685,
    longitude: -65.19458393474682,
  })

  useEffect(() => {
    getLocationPermissions();
  }, []);

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
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: -26.815939568519156,
          longitude: -65.21566985440371,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <Marker draggable coordinate={origin} onDragEnd={(direction) => setOrigin(direction.nativeEvent.coordinate)}/>
        <Marker draggable coordinate={destination} onDragEnd={(direction) => setDestination(direction.nativeEvent.coordinate)} />
        <Polyline coordinates={[origin, destination]} />
      </MapView>
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
});
