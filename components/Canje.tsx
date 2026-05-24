import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Modal,
  Pressable,
  ScrollView,
} from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Canje as CanjeType } from "@/contexts/RecompensaContext";
import { useState } from "react";

function formatearFecha(fecha?: string): string {
  if (!fecha) return "—";
  const d = new Date(fecha);
  if (isNaN(d.getTime())) return fecha;
  return d.toLocaleDateString("es-AR", { day: "2-digit", month: "short", year: "numeric" });
}

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
      <Text style={[styles.infoValue, highlight && styles.infoValueHighlight]} numberOfLines={2}>
        {value}
      </Text>
    </View>
  );
}

export default function Canje({ canje }: { canje: CanjeType }) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const recompensa = canje.recompensa;

  return (
    <>
      <Pressable
        style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
        onPress={() => setIsModalVisible(true)}
      >
        <View style={styles.cardHeader}>
          <View style={styles.estadoBadge}>
            <Text style={styles.estadoText}>Canjeado</Text>
          </View>
          <Text style={styles.fechaText}>{formatearFecha(canje.fechaDeCanjeo)}</Text>
        </View>

        <View style={styles.cardBody}>
          <View style={styles.imageBox}>
            {recompensa?.foto ? (
              <Image source={{ uri: recompensa.foto }} style={styles.imagen} resizeMode="contain" />
            ) : (
              <FontAwesome6 name="ticket" size={28} color="#2C7865" />
            )}
          </View>

          <View style={styles.cardInfo}>
            <Text style={styles.nombre} numberOfLines={2}>
              {recompensa?.titulo ?? "Recompensa"}
            </Text>

            <View style={styles.statsRow}>
              <View style={styles.statPill}>
                <FontAwesome6 name="star" size={12} color="#FFD700" />
                <Text style={styles.statText}>{recompensa?.puntos ?? 0} pts</Text>
              </View>
            </View>

            <Text style={styles.verDetalle}>Ver detalle</Text>
          </View>
        </View>
      </Pressable>

      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setIsModalVisible(false)}
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
                {recompensa?.titulo ?? "Detalle del canje"}
              </Text>
              <TouchableOpacity
                onPress={() => setIsModalVisible(false)}
                style={styles.modalCloseButton}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <FontAwesome6 name="xmark" size={18} color="#fff" />
              </TouchableOpacity>
            </LinearGradient>

            <ScrollView style={styles.modalScroll} contentContainerStyle={styles.modalScrollContent}>
              <View style={styles.estadoBadgeLarge}>
                <Text style={styles.estadoTextLarge}>Canjeado</Text>
              </View>

              <View style={styles.imageCard}>
                {recompensa?.foto ? (
                  <Image source={{ uri: recompensa.foto }} style={styles.modalImage} resizeMode="contain" />
                ) : (
                  <View style={styles.imagePlaceholder}>
                    <FontAwesome6 name="ticket" size={48} color="#2C7865" />
                  </View>
                )}
              </View>

              {recompensa?.descripcion ? (
                <Text style={styles.descripcion}>{recompensa.descripcion}</Text>
              ) : null}

              <View style={styles.infoCard}>
                <InfoRow
                  icon="calendar-check"
                  label="Fecha de canje"
                  value={formatearFecha(canje.fechaDeCanjeo)}
                  highlight
                />
                <InfoRow
                  icon="star"
                  label="Puntos utilizados"
                  value={`${recompensa?.puntos ?? 0} pts`}
                  highlight
                />
              </View>
            </ScrollView>

            <TouchableOpacity style={styles.modalFooterButton} onPress={() => setIsModalVisible(false)}>
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
    fontSize: 13,
    color: "#666",
    fontWeight: "600",
  },
  cardBody: {
    flexDirection: "row",
    padding: 14,
    gap: 12,
  },
  imageBox: {
    width: 72,
    height: 72,
    borderRadius: 12,
    backgroundColor: "#FAFFFE",
    borderWidth: 1,
    borderColor: "#D4E8E0",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  imagen: {
    width: 64,
    height: 64,
  },
  cardInfo: {
    flex: 1,
    gap: 8,
  },
  nombre: {
    fontSize: 15,
    fontWeight: "800",
    color: "#333",
    lineHeight: 20,
  },
  statsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  statPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#FAFFFE",
    borderWidth: 1,
    borderColor: "#D4E8E0",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  statText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#2C7865",
  },
  verDetalle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#2C7865",
    marginTop: 2,
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
    maxWidth: "50%",
  },
  infoValueHighlight: {
    color: "#2C7865",
    fontSize: 15,
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
