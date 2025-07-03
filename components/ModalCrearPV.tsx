import React, { useState } from "react";
import { usePuntoVerde } from "@/contexts/PuntoVerdeContext";
import { useIntercambios, Residuo } from "@/contexts/IntercambiosContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { View, Text, Modal, TextInput, Button, StyleSheet, Pressable, ScrollView, TouchableOpacity } from "react-native";
import { z } from "zod";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

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
  const [coordinates, setCoordinates] = useState<{lat: number, lng: number} | null>(null);

  const registerSchema = z.object({
    nombre: z.string().nonempty("El nombre es obligatorio"),
    direccion: z.string().nonempty("La dirección es obligatoria"),
    descripcion: z.string().nonempty("La descripción es obligatoria"),
    diasAtencion: z.string().nonempty("Los días de atención son obligatorios"),
    horario: z.string().nonempty("El horario es obligatorio"),
    imagen: z.string().nonempty("La imagen es obligatoria"),
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
    },
  });

  const watchedDireccion = watch("direccion");

  // Función para obtener coordenadas de la dirección
  const getCoordinatesFromAddress = async (address: string) => {
    if (!address.trim()) {
      setCoordinates(null);
      return;
    }

    setIsLoading(true);
    try {
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
        setCoordinates({
          lat: parseFloat(location.lat),
          lng: parseFloat(location.lon)
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
            setCoordinates({
              lat: parseFloat(location.lat),
              lng: parseFloat(location.lon)
            });
            return;
          }
        }
      }
      
      // Si todo falla, usar coordenadas por defecto de Tucumán
      console.log('Usando coordenadas por defecto para:', address);
      setCoordinates({
        lat: -26.815939568519156,
        lng: -65.21566985440371
      });
      
    } catch (error) {
      console.error('Error al obtener coordenadas:', error);
      setCoordinates(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Efecto para obtener coordenadas cuando cambia la dirección
  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (watchedDireccion.trim()) {
        getCoordinatesFromAddress(watchedDireccion);
      } else {
        setCoordinates(null);
      }
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [watchedDireccion]);

  const toggleResiduo = (material: string) => {
    setSelectedResiduos(prev => 
      prev.includes(material) 
        ? prev.filter(r => r !== material)
        : [...prev, material]
    );
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
      console.error('Error al crear punto verde:', error);
      alert('Error al crear el punto verde');
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
                onChangeText={onChange}
                value={value}
              />
            </View>
                  {isLoading && <Text style={styles.loadingText}>Obteniendo coordenadas...</Text>}
                  {coordinates && (
                    <View style={styles.coordinatesContainer}>
                      <Text style={styles.coordinatesText}>
                        Lat: {coordinates.lat.toFixed(6)}
                      </Text>
                      <Text style={styles.coordinatesText}>
                        Lng: {coordinates.lng.toFixed(6)}
                      </Text>
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
                      selectedResiduos.includes(residuo.material || '') && styles.residuoButtonSelected
                    ]}
                    onPress={() => toggleResiduo(residuo.material || '')}
                  >
                    <Text style={[
                      styles.residuoText,
                      selectedResiduos.includes(residuo.material || '') && styles.residuoTextSelected
                    ]}>
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContainer: {
    maxHeight: '90%',
    width: '100%',
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
});
