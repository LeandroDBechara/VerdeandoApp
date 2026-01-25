import React, { useEffect, useState } from "react";
import { usePuntoVerde } from "@/contexts/PuntoVerdeContext";
import { useIntercambios, Residuo } from "@/contexts/IntercambiosContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import {
  View,
  Text,
  Modal,
  TextInput,
  Button,
  StyleSheet,
  Pressable,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { z } from "zod";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MapView, { Marker } from "react-native-maps";
import { ubicacion } from "./Mapa";
import * as ImagePicker from "expo-image-picker";

export default function ModalCrearPV({
  ModalCreatePV,
  setModalCreatePV,
}: {
  ModalCreatePV: boolean;
  setModalCreatePV: (visible: boolean) => void;
}) {
  const { crearPuntoVerde } = usePuntoVerde();
  const { residuos } = useIntercambios();
  const [selectedResiduos, setSelectedResiduos] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [mapRegion, setMapRegion] = useState<{
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  } | null>(null);
  const [direccionFromMap, setDireccionFromMap] = useState(""); // Dirección obtenida del mapa (solo para referencia, no se muestra en el campo)
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const registerSchema = z.object({
    nombre: z.string().nonempty("El nombre es obligatorio"),
    direccion: z.string().nonempty("La dirección es obligatoria"),
    descripcion: z.string().nonempty("La descripción es obligatoria"),
    diasHorarioAtencion: z.string().nonempty("Los días de atención son obligatorios"),
    imagen: z.string().optional(),
    coordenadas: z.object({
      lat: z.number().min(-90, "La latitud debe ser mayor a -90").max(90, "La latitud debe ser menor a 90"),
      lng: z.number().min(-180, "La longitud debe ser mayor a -180").max(180, "La longitud debe ser menor a 180"),
    }),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
    setValue,
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      nombre: "",
      direccion: "",
      descripcion: "",
      diasHorarioAtencion: "",
      
      imagen: "",
      coordenadas: {
        lat: coordinates?.lat || 0,
        lng: coordinates?.lng || 0,
      },
    },
  });

  const pickImage = async () => {
    try {
      // Solicitar permisos
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permisos requeridos', 'Se necesitan permisos para acceder a la galería de fotos.');
        return;
      }

      // Abrir selector de imagen
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
        // También actualizar el valor del formulario
        const form = watch();
        form.imagen = result.assets[0].uri;
      }
    } catch (error) {
      console.error('Error al seleccionar imagen:', error);
      Alert.alert('Error', 'No se pudo seleccionar la imagen.');
    }
  };

  // Efecto para resetear cuando se abre el modal
  useEffect(() => {
    if (ModalCreatePV) {
      setDireccionFromMap(""); // Dirección obtenida del mapa (solo para mostrar en el marcador)
      setCoordinates(null);
      // Inicializar el mapa con la ubicación del usuario o una ubicación por defecto
      setMapRegion({
        latitude: ubicacion?.latitude || -26.815939568519156,
        longitude: ubicacion?.longitude || -65.21566985440371,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
    }
  }, [ModalCreatePV]);

  // Función para hacer reverse geocoding (obtener dirección desde coordenadas)
  const reverseGeocode = async (lat: number, lng: number) => {
    const MAPBOX_TOKEN = process.env.EXPO_PUBLIC_MAPBOX_TOKEN;
    if (!MAPBOX_TOKEN) {
      console.error("Mapbox token no configurado");
      return;
    }

    setIsLoading(true);
    try {
      const url = `https://api.mapbox.com/search/geocode/v6/reverse?longitude=${lng}&latitude=${lat}&access_token=${MAPBOX_TOKEN}&language=es`;
      
      const response = await fetch(url, {
        headers: {
          Accept: "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        
        if (data.features && data.features.length > 0) {
          const feature = data.features[0];
          const props = feature.properties || {};
          const fullAddress = props.full_address || props.name || "Dirección no disponible";
          
          // Guardar la dirección obtenida del mapa (solo para mostrar en el marcador, NO actualiza el campo del formulario)
          setDireccionFromMap(fullAddress);
        } else {
          // Si no se encuentra dirección, usar coordenadas como fallback
          setDireccionFromMap(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
        }
      } else {
        // Si falla la respuesta, usar coordenadas como dirección
        setDireccionFromMap(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
      }
    } catch (error) {
      console.error("Error al hacer reverse geocoding:", error);
      // Si falla, usar coordenadas como dirección
      setDireccionFromMap(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Función para manejar cuando el usuario toca el mapa
  const handleMapPress = (event: any) => {
    // El evento puede venir en diferentes formatos dependiendo de la versión de react-native-maps
    const coordinate = event.nativeEvent?.coordinate || event.nativeEvent?.coordinatePoint || event.coordinate;
    
    if (!coordinate) {
      console.error("No se pudo obtener las coordenadas del evento");
      return;
    }

    const latitude = coordinate.latitude;
    const longitude = coordinate.longitude;
    
    if (!latitude || !longitude) {
      console.error("Coordenadas inválidas:", coordinate);
      return;
    }
    
    // Guardar coordenadas
    setCoordinates({ lat: latitude, lng: longitude });
    
    // Actualizar región del mapa para enfocar en la ubicación seleccionada
    setMapRegion({
      latitude: latitude,
      longitude: longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });

    // Hacer reverse geocoding para obtener la dirección
    reverseGeocode(latitude, longitude);
  };

  // Función para geocodificar la dirección y mover el mapa (opcional, para búsqueda)
  const geocodeAddress = async (addressText: string) => {
    const text = addressText.trim();
    
    if (text.length < 3) {
      setError("direccion", { message: "Por favor ingresa una dirección válida (mínimo 3 caracteres)" });
      return;
    }

    const MAPBOX_TOKEN = process.env.EXPO_PUBLIC_MAPBOX_TOKEN;
    if (!MAPBOX_TOKEN) {
      setError("direccion", { message: "Error de configuración: Token de Mapbox no encontrado" });
      return;
    }

    setIsLoading(true);
    setError("direccion", { message: "" });

    try {
      let mapboxUrl = `https://api.mapbox.com/search/geocode/v6/forward?q=${encodeURIComponent(text)}&access_token=${MAPBOX_TOKEN}&limit=1&country=ar&language=es`;
      
      if (ubicacion) {
        mapboxUrl += `&proximity=${ubicacion.longitude},${ubicacion.latitude}`;
      }

      let response = await fetch(mapboxUrl, {
        headers: {
          Accept: "application/json",
        },
      });

      if (response.ok) {
        let data = await response.json();
        
        if (!data.features || data.features.length === 0) {
          let globalUrl = `https://api.mapbox.com/search/geocode/v6/forward?q=${encodeURIComponent(text)}&access_token=${MAPBOX_TOKEN}&limit=1&language=es`;
          
          if (ubicacion) {
            globalUrl += `&proximity=${ubicacion.longitude},${ubicacion.latitude}`;
          }

          response = await fetch(globalUrl, {
            headers: {
              Accept: "application/json",
            },
          });

          if (response.ok) {
            data = await response.json();
          }
        }

        if (data.features && data.features.length > 0) {
          const feature = data.features[0];
          const coords = feature.geometry?.coordinates || [];
          const longitude = coords[0];
          const latitude = coords[1];

          if (latitude && longitude) {
            setCoordinates({ lat: latitude, lng: longitude });
            
            setMapRegion({
              latitude: latitude,
              longitude: longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            });

            // Hacer reverse geocoding para actualizar direccionFromMap (solo para mostrar en el marcador)
            reverseGeocode(latitude, longitude);
            
            // NO actualizar el campo de dirección del formulario
            // El campo de dirección permanece con lo que el usuario escribió
          }
        } else {
          setError("direccion", { message: "No se encontró la dirección. Por favor, verifica que sea correcta." });
        }
      }
    } catch (error) {
      console.error("Error al geocodificar dirección:", error);
      setError("direccion", { message: "Error de conexión. Por favor, verifica tu internet e intenta nuevamente." });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleResiduo = (material: string) => {
    setSelectedResiduos((prev) => (prev.includes(material) ? prev.filter((r) => r !== material) : [...prev, material]));
  };

  const onSubmit = async (data: any) => {
    if (!coordinates) {
      setError("direccion", { message: "No se pudo obtener las coordenadas de la dirección" });
      return;
    }

    if (selectedResiduos.length === 0) {
      alert("Debe seleccionar al menos un tipo de residuo");
      return;
    }

    const puntoVerdeData = {
      ...data,
      imagen: selectedImage || data.imagen, // Usar la imagen seleccionada o la del formulario
      latitud: coordinates.lat,
      longitud: coordinates.lng,
      residuosAceptados: selectedResiduos,
    };

    try {
      await crearPuntoVerde(puntoVerdeData);
      setModalCreatePV(false);
      reset();
      setSelectedResiduos([]);
      setCoordinates(null);
    } catch (error) {
      console.log("Error al crear punto verde:", error);
      alert("Error al crear el punto verde: " + error);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={ModalCreatePV}
      onRequestClose={() => {
        setModalCreatePV(false);
        reset();
        setSelectedResiduos([]);
        setCoordinates(null);
        setMapRegion(null);
        setDireccionFromMap("");
        setSelectedImage(null);
      }}
    >
      <View style={styles.modalBackground}>
        <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.container}>
            <Text style={styles.title}>Crear Nuevo Punto Verde</Text>

            <Controller
              control={control}
              name="nombre"
              render={({ field: { onChange, onBlur, value } }) => (
                <View>
                  <View style={styles.inputContainer}>
                    <Text style={styles.placeholder}>Nombre</Text>
                    <TextInput
                      style={styles.input}
                      placeholder=""
                      keyboardType="default"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                    />
                  </View>
                  {errors.nombre && <Text style={styles.error}>{errors.nombre.message}</Text>}
                </View>
              )}
            />

            <Controller
              control={control}
              name="direccion"
              render={({ field: { onChange, onBlur, value } }) => (
                <View>
                  <View style={styles.inputContainer}>
                    <Text style={styles.placeholder}>Dirección</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Toca el mapa para seleccionar ubicación o busca una dirección"
                      keyboardType="default"
                      onBlur={onBlur}
                      onChangeText={(text) => {
                        onChange(text);
                        // El campo de dirección es independiente, solo se actualiza cuando el usuario escribe
                      }}
                      value={value}
                      editable={!isLoading}
                    />
                  </View>

                  {/* Botón opcional para buscar dirección y mover el mapa */}
                  {value && value.trim().length >= 3 && (
                    <Pressable
                      style={({ pressed }) => [
                        styles.geocodeButton,
                        pressed && styles.geocodeButtonPressed,
                        isLoading && styles.geocodeButtonDisabled
                      ]}
                      onPress={() => geocodeAddress(value)}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Text style={styles.geocodeButtonText}>Buscando...</Text>
                      ) : (
                        <Text style={styles.geocodeButtonText}>🔍 Buscar y Mover Mapa</Text>
                      )}
                    </Pressable>
                  )}

                  {/* Mapa interactivo - siempre visible */}
                  <View style={styles.mapContainer}>
                    <Text style={styles.mapInstructionText}>
                      {coordinates ? "📍 Arrastra el marcador o toca el mapa para cambiar la ubicación" : "👆 Toca el mapa para colocar el marcador"}
                    </Text>
                    {mapRegion && (
                      <MapView
                        style={styles.map}
                        region={mapRegion}
                        onRegionChangeComplete={setMapRegion}
                        onPress={handleMapPress}
                        showsUserLocation={true}
                      >
                        {coordinates && (
                          <Marker
                            coordinate={{
                              latitude: coordinates.lat,
                              longitude: coordinates.lng,
                            }}
                            title="Ubicación del punto verde"
                            description={direccionFromMap || "Ubicación seleccionada"}
                            pinColor="green"
                            draggable={true}
                            onDragEnd={(e) => {
                              const { latitude, longitude } = e.nativeEvent.coordinate;
                              setCoordinates({ lat: latitude, lng: longitude });
                              setMapRegion({
                                latitude: latitude,
                                longitude: longitude,
                                latitudeDelta: 0.01,
                                longitudeDelta: 0.01,
                              });
                              reverseGeocode(latitude, longitude);
                            }}
                          />
                        )}
                      </MapView>
                    )}
                  </View>

                  {/* Mostrar coordenadas si están disponibles */}
                  {coordinates && (
                    <View style={styles.coordinatesContainer}>
                      <Text style={styles.coordinatesText}>✓ Ubicación seleccionada</Text>
                      <Text style={styles.coordinatesText}>Lat: {coordinates.lat.toFixed(6)}</Text>
                      <Text style={styles.coordinatesText}>Lng: {coordinates.lng.toFixed(6)}</Text>
                    </View>
                  )}

                  {errors.direccion && <Text style={styles.error}>{errors.direccion.message}</Text>}
                </View>
              )}
            />

            <Controller
              control={control}
              name="descripcion"
              render={({ field: { onChange, onBlur, value } }) => (
                <View>
                  <View style={styles.inputContainer}>
                    <Text style={styles.placeholder}>Descripción</Text>
                    <TextInput
                      style={styles.input}
                      placeholder=""
                      keyboardType="default"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      multiline
                      numberOfLines={3}
                    />
                  </View>
                  {errors.descripcion && <Text style={styles.error}>{errors.descripcion.message}</Text>}
                </View>
              )}
            />

            <Controller
              control={control}
              name="diasHorarioAtencion"
              render={({ field: { onChange, onBlur, value } }) => (
                <View>
                  <View style={styles.inputContainer}>
                    <Text style={styles.placeholder}>Días de atención</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Ej: Lunes a Viernes de 8:00 a 18:00\nSábados de 8:00 a 12:00"
                      keyboardType="default"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      multiline
                    />
                  </View>
                  {errors.diasHorarioAtencion && <Text style={styles.error}>{errors.diasHorarioAtencion.message}</Text>}
                </View>
              )}
            />

            <View>
              <Text style={styles.placeholder}>Imagen del punto verde</Text>
              <View style={styles.imageContainer}>
                {selectedImage ? (
                  <View style={styles.selectedImageContainer}>
                    <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
                    <Pressable style={styles.changeImageButton} onPress={pickImage}>
                      <Text style={styles.changeImageButtonText}>Cambiar imagen</Text>
                    </Pressable>
                  </View>
                ) : (
                  <Pressable style={styles.selectImageButton} onPress={pickImage}>
                    <FontAwesome6 name="image" size={24} color="#666" />
                    <Text style={styles.selectImageButtonText}>Seleccionar imagen</Text>
                  </Pressable>
                )}
              </View>
            </View>

            {/* Sección de residuos aceptados */}
            <View style={styles.residuosSection}>
              <Text style={styles.sectionTitle}>Residuos Aceptados</Text>
              <View style={styles.residuosContainer}>
                {residuos.map((residuo) => (
                  <TouchableOpacity
                    key={residuo.id}
                    style={[
                      styles.residuoButton,
                      selectedResiduos.includes(residuo.material || "") && styles.residuoButtonSelected,
                    ]}
                    onPress={() => toggleResiduo(residuo.material || "")}
                  >
                    <Text
                      style={[
                        styles.residuoText,
                        selectedResiduos.includes(residuo.material || "") && styles.residuoTextSelected,
                      ]}
                    >
                      {residuo.material}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <Pressable
              style={({ pressed }) => [styles.buttonIngresar, pressed && styles.buttonPressed]}
              onPress={handleSubmit(onSubmit)}
            >
              <Text style={styles.buttonIngresarText}>Crear Punto Verde</Text>
            </Pressable>

            <Pressable
              style={styles.cancelButton}
              onPress={() => {
                setModalCreatePV(false);
                reset();
                setSelectedResiduos([]);
                setCoordinates(null);
                setMapRegion(null);
                setDireccionFromMap("");
                setSelectedImage(null);
              }}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </Pressable>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContainer: {
    maxHeight: "90%",
    width: "100%",
  },
  container: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 15,
    margin: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2C7865",
    marginBottom: 20,
    textAlign: "center",
  },
  buttonIngresar: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: 300,
    borderRadius: 20,
    backgroundColor: "#2C7865",
    paddingVertical: 11,
    marginTop: 20,
  },
  buttonIngresarText: {
    color: "#D9EDBF",
    fontSize: 20,
    fontWeight: "medium",
    fontFamily: "Noto Sans",
  },
  buttonPressed: {
    opacity: 0.5,
  },
  cancelButton: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: 300,
    borderRadius: 20,
    backgroundColor: "#ccc",
    paddingVertical: 11,
    marginTop: 10,
  },
  cancelButtonText: {
    color: "#333",
    fontSize: 18,
    fontWeight: "medium",
    fontFamily: "Noto Sans",
  },
  inputContainer: {
    position: "relative",
    width: 300,
    marginBottom: 10,
  },
  input: {
    width: "100%",
    height: 56,
    borderRadius: 8,
    backgroundColor: "white",
    borderColor: "#D9D9D9",
    borderWidth: 1,
    color: "#929292",
    padding: 10,
  },
  placeholder: {
    position: "absolute",
    left: 10,
    top: -10,
    backgroundColor: "white",
    paddingHorizontal: 5,
    color: "#929292",
    zIndex: 1,
  },
  error: {
    color: "red",
    fontFamily: "Noto Sans",
    fontSize: 12,
    marginBottom: 10,
  },
  loadingText: {
    color: "#2C7865",
    fontSize: 12,
    fontStyle: "italic",
    marginBottom: 5,
  },
  coordinatesContainer: {
    backgroundColor: "#f0f0f0",
    padding: 8,
    borderRadius: 5,
    marginBottom: 10,
  },
  coordinatesText: {
    fontSize: 12,
    color: "#666",
    fontFamily: "monospace",
  },
  geocodeButton: {
    width: 300,
    backgroundColor: "#2C7865",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  geocodeButtonPressed: {
    opacity: 0.7,
  },
  geocodeButtonDisabled: {
    backgroundColor: "#ccc",
    opacity: 0.6,
  },
  geocodeButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  mapContainer: {
    width: 300,
    height: 250,
    borderRadius: 10,
    overflow: "hidden",
    marginTop: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#D9D9D9",
    position: "relative",
  },
  mapInstructionText: {
    position: "absolute",
    top: 10,
    left: 10,
    right: 10,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    padding: 8,
    borderRadius: 5,
    fontSize: 12,
    color: "#2C7865",
    fontWeight: "bold",
    zIndex: 1,
    textAlign: "center",
  },
  residuosSection: {
    width: 300,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2C7865",
    marginBottom: 10,
  },
  residuosContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  residuoButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    backgroundColor: "#f0f0f0",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  residuoButtonSelected: {
    backgroundColor: "#2C7865",
    borderColor: "#2C7865",
  },
  residuoText: {
    fontSize: 12,
    color: "#666",
  },
  residuoTextSelected: {
    color: "white",
    fontWeight: "bold",
  },
  map: {
    width: "100%",
    height: 250,
  },
  resultsContainer: {
    maxHeight: 200,
    backgroundColor: "white",
    borderRadius: 10,
    marginTop: 5,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  resultItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  resultText: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
  },
  resultItemWarning: {
    backgroundColor: "#fff3cd",
    borderLeftWidth: 3,
    borderLeftColor: "#ffc107",
  },
  warningText: {
    fontSize: 11,
    color: "#856404",
    marginTop: 4,
    fontStyle: "italic",
  },
  noResultsText: {
    textAlign: "center",
    color: "#666",
    marginTop: 10,
    fontStyle: "italic",
  },
  imageContainer: {
    width: 300,
    marginBottom: 10,
  },
  selectedImageContainer: {
    alignItems: "center",
    gap: 10,
  },
  selectedImage: {
    width: 200,
    height: 150,
    borderRadius: 10,
    resizeMode: "cover",
  },
  changeImageButton: {
    backgroundColor: "#2C7865",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  changeImageButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  selectImageButton: {
    width: "100%",
    height: 120,
    borderWidth: 2,
    borderColor: "#D9D9D9",
    borderStyle: "dashed",
    borderRadius: 10,
    backgroundColor: "#f9f9f9",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  selectImageButtonText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "500",
  },
});
