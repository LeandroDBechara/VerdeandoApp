import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Pressable,
} from "react-native";
import { Evento as EventoType } from "@/contexts/EventoContext";
import { PuntoVerde, usePuntoVerde } from "@/contexts/PuntoVerdeContext";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { LinearGradient } from "expo-linear-gradient";
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
  if (!fecha) return "—";

  const fechaObj = new Date(fecha);
  if (isNaN(fechaObj.getTime())) return "—";

  return fechaObj.toLocaleDateString("es-AR", { day: "2-digit", month: "short", year: "numeric" });
};

function InfoRow({
  icon,
  label,
  value,
  highlight = false,
}: {
  icon: React.ComponentProps<typeof FontAwesome6>["name"];
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoRowLeft}>
        <FontAwesome6 name={icon} size={14} color="#2C7865" />
        <Text style={styles.infoLabel}>{label}</Text>
      </View>
      <Text style={[styles.infoValue, highlight && styles.infoValueHighlight]} numberOfLines={3}>
        {value}
      </Text>
    </View>
  );
}

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
    <>
      <Pressable
        style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
        onPress={() => setModalVisible(true)}
      >
        <View style={styles.cardHeader}>
          <View style={styles.estadoBadge}>
            <Text style={styles.estadoText}>Evento</Text>
          </View>
          <Text style={styles.fechaText}>
            {fechaInicioFormateada} — {fechaFinFormateada}
          </Text>
        </View>

        {imagen ? (
          <Image source={{ uri: imagen }} style={styles.cardImage} resizeMode="cover" />
        ) : (
          <View style={styles.cardImagePlaceholder}>
            <FontAwesome6 name="calendar-days" size={32} color="#2C7865" />
          </View>
        )}

        <View style={styles.cardBody}>
          <Text style={styles.cardTitle} numberOfLines={2}>
            {titulo}
          </Text>
          {descripcion ? (
            <Text style={styles.cardDescription} numberOfLines={2}>
              {descripcion}
            </Text>
          ) : null}
          <Text style={styles.verDetalle}>Ver detalle</Text>
        </View>
      </Pressable>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <LinearGradient
              colors={["#2C7865", "#1E5248"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.modalHeader}
            >
              <Text style={styles.modalTitle} numberOfLines={2}>
                {titulo}
              </Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.modalCloseButton}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <FontAwesome6 name="xmark" size={18} color="#fff" />
              </TouchableOpacity>
            </LinearGradient>

            <ScrollView style={styles.modalScroll} contentContainerStyle={styles.modalScrollContent}>
              <View style={styles.estadoBadgeLarge}>
                <Text style={styles.estadoTextLarge}>Evento activo</Text>
              </View>

              <View style={styles.imageCard}>
                {imagen ? (
                  <Image source={{ uri: imagen }} style={styles.modalImage} resizeMode="contain" />
                ) : (
                  <View style={styles.imagePlaceholder}>
                    <FontAwesome6 name="calendar-days" size={48} color="#2C7865" />
                  </View>
                )}
              </View>

              {descripcion ? (
                <Text style={styles.descripcion}>{descripcion}</Text>
              ) : null}

              <View style={styles.infoCard}>
                <InfoRow
                  icon="calendar"
                  label="Fecha inicio"
                  value={fechaInicioFormateada}
                />
                <InfoRow
                  icon="calendar-check"
                  label="Fecha fin"
                  value={fechaFinFormateada}
                />
                {codigo ? (
                  <InfoRow icon="ticket" label="Codigo del evento" value={codigo} highlight />
                ) : null}
              </View>

              <Text style={styles.sectionTitle}>Puntos verdes habilitados</Text>
              <View style={styles.pvCard}>
                {nombresPuntosVerdes.length > 0 ? (
                  nombresPuntosVerdes.map(({ key, nombre }) => (
                    <View key={key} style={styles.pvRow}>
                      <View style={styles.pvRowLeft}>
                        <FontAwesome6 name="location-dot" size={14} color="#2C7865" />
                        <Text style={styles.pvRowName}>{nombre}</Text>
                      </View>
                    </View>
                  ))
                ) : (
                  <Text style={styles.pvEmptyText}>
                    No se encontraron puntos verdes habilitados para este evento
                  </Text>
                )}
              </View>
            </ScrollView>

            <TouchableOpacity style={styles.modalFooterButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.modalFooterButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    marginHorizontal: 4,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#D4E8E0",
    shadowColor: "#1E5248",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    overflow: "hidden",
  },
  cardPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.99 }],
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: "#F0FAF7",
    borderBottomWidth: 1,
    borderBottomColor: "#E8F2EE",
    gap: 8,
  },
  estadoBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: "#E8F5EE",
  },
  estadoText: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.3,
    color: "#2C7865",
  },
  fechaText: {
    fontSize: 12,
    color: "#666",
    fontWeight: "600",
    flexShrink: 1,
    textAlign: "right",
  },
  cardImage: {
    width: "100%",
    height: 140,
    backgroundColor: "#F0FAF7",
  },
  cardImagePlaceholder: {
    width: "100%",
    height: 140,
    backgroundColor: "#EEF6F3",
    alignItems: "center",
    justifyContent: "center",
  },
  cardBody: {
    padding: 14,
    gap: 6,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#333",
    lineHeight: 22,
  },
  cardDescription: {
    fontSize: 13,
    color: "#666",
    lineHeight: 18,
  },
  verDetalle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#2C7865",
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },
  modalSheet: {
    backgroundColor: "#FAFFFE",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "92%",
    overflow: "hidden",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#fff",
    flex: 1,
  },
  modalCloseButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  modalScroll: {
    flexGrow: 0,
  },
  modalScrollContent: {
    padding: 16,
    paddingBottom: 8,
  },
  estadoBadgeLarge: {
    alignSelf: "flex-start",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 14,
    marginBottom: 16,
    backgroundColor: "#E8F5EE",
  },
  estadoTextLarge: {
    fontSize: 13,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    color: "#2C7865",
  },
  imageCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#D4E8E0",
    alignItems: "center",
    paddingVertical: 16,
    marginBottom: 16,
    overflow: "hidden",
  },
  modalImage: {
    width: "100%",
    height: 180,
  },
  imagePlaceholder: {
    height: 180,
    alignItems: "center",
    justifyContent: "center",
  },
  descripcion: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#D4E8E0",
    paddingHorizontal: 14,
    marginBottom: 16,
    overflow: "hidden",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EEF6F3",
    gap: 12,
  },
  infoRowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#333",
    textAlign: "right",
    flexShrink: 1,
    maxWidth: "55%",
  },
  infoValueHighlight: {
    color: "#2C7865",
    fontSize: 15,
    letterSpacing: 0.5,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#2C7865",
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  pvCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#D4E8E0",
    overflow: "hidden",
    marginBottom: 8,
    padding: 4,
  },
  pvRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EEF6F3",
  },
  pvRowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  pvRowName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    flex: 1,
  },
  pvEmptyText: {
    fontSize: 14,
    color: "#666",
    fontStyle: "italic",
    lineHeight: 20,
    padding: 14,
  },
  modalFooterButton: {
    backgroundColor: "#2C7865",
    marginHorizontal: 16,
    marginBottom: 24,
    marginTop: 8,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  modalFooterButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
