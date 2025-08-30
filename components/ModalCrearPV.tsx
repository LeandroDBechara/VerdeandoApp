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
} from "react-native";
import { z } from "zod";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MapView from "react-native-maps";
import { ubicacion } from "./Mapa";

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
  const [showResults, setShowResults] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [direccion, setDireccion] = useState("");

  const registerSchema = z.object({
    nombre: z.string().nonempty("El nombre es obligatorio"),
    direccion: z.string().nonempty("La dirección es obligatoria"),
    descripcion: z.string().nonempty("La descripción es obligatoria"),
    diasAtencion: z.string().nonempty("Los días de atención son obligatorios"),
    horario: z.string().nonempty("El horario es obligatorio"),
    imagen: z.string().nonempty("La imagen es obligatoria"),
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
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      nombre: "",
      direccion: "",
      descripcion: "",
      diasAtencion: "",
      horario: "",
      imagen: "",
      coordenadas: {
        lat: coordinates?.lat || 0,
        lng: coordinates?.lng || 0,
      },
    },
  });

  const searchAddress = async (query: string) => {
    if (query.length < 3) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }


    setIsLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}&limit=5&countrycodes=ar&addressdetails=1&viewbox=${ubicacion ? 
          `${ubicacion.longitude - 0.1},${ubicacion.latitude - 0.1},${ubicacion.longitude + 0.1},${ubicacion.latitude + 0.1}` : 
          ''}&bounded=1`,
        {
          headers: {
            Accept: "application/json",
            "User-Agent": "VerdeandoApp/1.0",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setSearchResults(data);
        setShowResults(true);
      } else {
        setSearchResults([]);
        setShowResults(false);
      }
    } catch (error) {
      console.error("Error al buscar dirección:", error);
      setSearchResults([]);
      setShowResults(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddressSelect = (result: any) => {
    setDireccion(result.display_name);
    setCoordinates({
      lat: parseFloat(result.lat),
      lng: parseFloat(result.lon),
    });
    setShowResults(false);
    setSearchResults([]);
  };
  // Efecto para obtener coordenadas cuando cambia la dirección
  useEffect(() => {
    if (ModalCreatePV) {
      setDireccion("");
      setSearchResults([]);
      setShowResults(false);
    }
  }, [ModalCreatePV]);

  // Debounce para la búsqueda
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (direccion.trim()) {
        searchAddress(direccion);
      } else {
        setSearchResults([]);
        setShowResults(false);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [direccion]);

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
      console.error("Error al crear punto verde:", error);
      alert("Error al crear el punto verde");
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
                      placeholder=""
                      keyboardType="default"
                      onBlur={onBlur}
                      onChangeText={(text) => {
                        onChange(text);
                        setDireccion(text);
                      }}
                      value={value}
                    />
                    {isLoading && <Text style={styles.loadingText}>Buscando...</Text>}

                    {showResults && searchResults.length > 0 && (
                      <View>
                      <ScrollView style={styles.resultsContainer}>
                        {searchResults.map((result, index) => (
                          <TouchableOpacity
                            key={index}
                            style={styles.resultItem}
                            onPress={() => handleAddressSelect(result)}
                          >
                            <Text style={styles.resultText} numberOfLines={2}>
                              {result.display_name}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                      <MapView
                      style={styles.map}
                      initialRegion={{
                        latitude: ubicacion?.latitude || -26.815939568519156,
                        longitude: ubicacion?.longitude || -65.21566985440371,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                      }}
                    />
                      </View>
                    )}
                    

                    {showResults && searchResults.length === 0 && !isLoading && (
                      <Text style={styles.noResultsText}>No se encontraron resultados</Text>
                    )}
                  </View>
                  {isLoading && <Text style={styles.loadingText}>Obteniendo coordenadas...</Text>}
                  {coordinates && (
                    <View style={styles.coordinatesContainer}>
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
              name="diasAtencion"
              render={({ field: { onChange, onBlur, value } }) => (
                <View>
                  <View style={styles.inputContainer}>
                    <Text style={styles.placeholder}>Días de atención</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Ej: Lunes a Viernes"
                      keyboardType="default"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                    />
                  </View>
                  {errors.diasAtencion && <Text style={styles.error}>{errors.diasAtencion.message}</Text>}
                </View>
              )}
            />

            <Controller
              control={control}
              name="horario"
              render={({ field: { onChange, onBlur, value } }) => (
                <View>
                  <View style={styles.inputContainer}>
                    <Text style={styles.placeholder}>Horario</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Ej: 8:00 - 18:00"
                      keyboardType="default"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                    />
                  </View>
                  {errors.horario && <Text style={styles.error}>{errors.horario.message}</Text>}
                </View>
              )}
            />

            <Controller
              control={control}
              name="imagen"
              render={({ field: { onChange, onBlur, value } }) => (
                <View>
                  <View style={styles.inputContainer}>
                    <Text style={styles.placeholder}>URL de imagen</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="https://ejemplo.com/imagen.jpg"
                      keyboardType="url"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                    />
                  </View>
                  {errors.imagen && <Text style={styles.error}>{errors.imagen.message}</Text>}
                </View>
              )}
            />

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
                setDireccion("");
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
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
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
  noResultsText: {
    textAlign: "center",
    color: "#666",
    marginTop: 10,
    fontStyle: "italic",
  },
});
