import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Pressable,
  Dimensions,
} from "react-native";

const MODAL_MAX_HEIGHT = Dimensions.get("window").height * 0.85;
import { Evento as EventoType } from "@/contexts/EventoContext";
import { PuntoVerde, usePuntoVerde } from "@/contexts/PuntoVerdeContext";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useEffect, useMemo, useState } from "react";

type PuntoVerdeRef = string | { id?: string; nombre?: string };

function obtenerNombrePuntoVerde(item: PuntoVerdeRef, puntosVerdes: PuntoVerde[]): string {
  if (typeof item === "object" && item !== null) {
    if (item.nombre) return item.nombre;
    if (item.id) {
      const porId = puntosVerdes.find((pv) => pv.id === item.id);
      if (porId?.nombre) return porId.nombre;
    }
    return item.id ?? "Punto verde";
  }

  const porId = puntosVerdes.find((pv) => pv.id === item);
  if (porId?.nombre) return porId.nombre;

  const porNombre = puntosVerdes.find(
    (pv) => pv.nombre?.trim().toLowerCase() === item.trim().toLowerCase()
  );
  if (porNombre?.nombre) return porNombre.nombre;

  return item;
}

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
  const { titulo, descripcion, imagen, fechaInicio, fechaFin, codigo, puntosVerdesPermitidos } = evento;
  const fechaInicioFormateada = formatearFechaEuropea(fechaInicio);
  const fechaFinFormateada = formatearFechaEuropea(fechaFin);
  const [modalVisible, setModalVisible] = useState(false);
  const { puntosVerdes, cargarPuntosVerdes } = usePuntoVerde();

  useEffect(() => {
    if (puntosVerdesPermitidos?.length) {
      cargarPuntosVerdes();
    }
  }, [puntosVerdesPermitidos?.length]);

  useEffect(() => {
    if (modalVisible) {
      cargarPuntosVerdes();
    }
  }, [modalVisible]);

  const nombresPuntosVerdes = useMemo(() => {
    if (!puntosVerdesPermitidos?.length) return [];
    return (puntosVerdesPermitidos as PuntoVerdeRef[])
      .filter((item) => {
        if (typeof item === "string") return item.trim() !== "";
        return Boolean(item?.id?.trim() || item?.nombre?.trim());
      })
      .map((item, index) => ({
        key: `${typeof item === "string" ? item : item.id ?? index}-${index}`,
        nombre: obtenerNombrePuntoVerde(item, puntosVerdes),
      }));
  }, [puntosVerdesPermitidos, puntosVerdes]);

  return (
    <View style={{ marginBottom: 10 }}>
      <TouchableOpacity onPress={() => setModalVisible(true)} activeOpacity={0.9}>
        <View style={styles.container}>
          <Image source={{ uri: imagen }} style={styles.image} resizeMode="contain" />
          <View style={styles.infoContainer}>
            <Text style={styles.title}>{titulo}</Text>
          </View>
        </View>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable
            style={styles.modalBackdrop}
            onPress={() => setModalVisible(false)}
          />
          <View style={styles.modalCard}>
            <ScrollView
              style={styles.modalScroll}
              showsVerticalScrollIndicator
              bounces
              nestedScrollEnabled
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={styles.modalScrollContent}
            >
              <Image source={{ uri: imagen }} style={styles.modalImage} resizeMode="contain" />

              <Text style={styles.modalTitle}>{titulo}</Text>

              <View style={styles.section}>
                <Text style={styles.sectionLabel}>Detalles del evento</Text>
                <View style={styles.descriptionBox}>
                  <Text style={styles.modalDescription}>{descripcion}</Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <View style={styles.infoIconWrap}>
                  <FontAwesome6 name="calendar-days" size={18} color="#2C7865" />
                </View>
                <View style={styles.infoTextWrap}>
                  <Text style={styles.infoLabel}>Duración</Text>
                  <Text style={styles.infoValue}>
                    {fechaInicioFormateada} — {fechaFinFormateada}
                  </Text>
                </View>
              </View>

              {codigo ? (
                <View style={styles.infoRow}>
                  <View style={styles.infoIconWrap}>
                    <FontAwesome6 name="ticket" size={18} color="#2C7865" />
                  </View>
                  <View style={styles.infoTextWrap}>
                    <Text style={styles.infoLabel}>Código del evento</Text>
                    <Text style={styles.codigoValue}>{codigo}</Text>
                  </View>
                </View>
              ) : null}

              <View style={styles.section}>
                <Text style={styles.sectionLabel}>Puntos verdes habilitados</Text>
                {nombresPuntosVerdes.length > 0 ? (
                  <View style={styles.pvList}>
                    {nombresPuntosVerdes.map(({ key, nombre }) => (
                      <View key={key} style={styles.pvListItem}>
                        <FontAwesome6 name="leaf" size={14} color="#2C7865" />
                        <Text style={styles.pvListItemText}>{nombre}</Text>
                      </View>
                    ))}
                  </View>
                ) : (
                  <Text style={styles.pvEmptyText}>
                    No se encontraron puntos verdes habilitados para este evento
                  </Text>
                )}
              </View>

              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setModalVisible(false)}
                activeOpacity={0.85}
              >
                <Text style={styles.modalCloseButtonText}>Cerrar</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
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
    height: 160,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: "#f5f5f5",
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
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    width: "100%",
    maxWidth: 400,
    maxHeight: MODAL_MAX_HEIGHT,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 1,
  },
  modalScroll: {
    maxHeight: MODAL_MAX_HEIGHT,
  },
  modalScrollContent: {
    padding: 20,
    paddingBottom: 24,
  },
  modalImage: {
    width: "100%",
    height: 180,
    borderRadius: 12,
    backgroundColor: "#f5f5f5",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2C7865",
    textAlign: "center",
    marginBottom: 16,
  },
  section: {
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#2C7865",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  descriptionBox: {
    backgroundColor: "#f0f7f4",
    borderRadius: 10,
    padding: 14,
    borderLeftWidth: 4,
    borderLeftColor: "#2C7865",
  },
  modalDescription: {
    fontSize: 15,
    color: "#333",
    lineHeight: 22,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    padding: 14,
    marginBottom: 16,
    gap: 12,
  },
  infoIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#e8f5e9",
    alignItems: "center",
    justifyContent: "center",
  },
  infoTextWrap: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666",
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    lineHeight: 20,
  },
  codigoValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2C7865",
    letterSpacing: 1,
  },
  pvList: {
    backgroundColor: "#f0f7f4",
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: "#c8e6c9",
    gap: 10,
  },
  pvListItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  pvListItemText: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    color: "#2C7865",
  },
  pvEmptyText: {
    fontSize: 14,
    color: "#666",
    fontStyle: "italic",
    lineHeight: 20,
    paddingHorizontal: 4,
  },
  modalCloseButton: {
    backgroundColor: "#2C7865",
    marginTop: 8,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  modalCloseButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
