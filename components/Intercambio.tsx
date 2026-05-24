import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import QRCode from "react-native-qrcode-svg";
import { Intercambio as IntercambioType, getResiduoIcon } from "@/contexts/IntercambiosContext";
import React, { useState } from "react";

function formatearFecha(fecha?: string): string {
  if (!fecha) return "—";
  const d = new Date(fecha);
  if (isNaN(d.getTime())) return fecha;
  return d.toLocaleDateString("es-AR", { day: "2-digit", month: "short", year: "numeric" });
}

function obtenerEstadoStyle(estado?: string) {
  if (estado === "REALIZADO") {
    return { bg: "#E8F5EE", color: "#2C7865", label: "Realizado" };
  }
  if (estado === "PENDIENTE") {
    return { bg: "#FFF8E6", color: "#B8860B", label: "Pendiente" };
  }
  return { bg: "#F0F0F0", color: "#666", label: estado ?? "—" };
}

export default function Intercambio({ intercambio }: { intercambio: IntercambioType }) {
  const [modalVisible, setModalVisible] = useState(false);
  const estadoStyle = obtenerEstadoStyle(intercambio.estado);

  return (
    <>
      <Pressable
        style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
        onPress={() => setModalVisible(true)}
      >
        <View style={styles.cardHeader}>
          <View style={[styles.estadoBadge, { backgroundColor: estadoStyle.bg }]}>
            <Text style={[styles.estadoText, { color: estadoStyle.color }]}>{estadoStyle.label}</Text>
          </View>
          <Text style={styles.fechaText}>{formatearFecha(intercambio.fecha)}</Text>
        </View>

        <View style={styles.cardBody}>
          <View style={styles.cardInfo}>
            <View style={styles.statsRow}>
              <View style={styles.statPill}>
                <FontAwesome6 name="weight-scale" size={12} color="#2C7865" />
                <Text style={styles.statText}>{intercambio.pesoTotal ?? 0} g</Text>
              </View>
              <View style={styles.statPill}>
                <FontAwesome6 name="star" size={12} color="#FFD700" />
                <Text style={styles.statText}>{intercambio.totalPuntos ?? 0} pts</Text>
              </View>
            </View>

            <View style={styles.materialsRow}>
              {intercambio.detalleIntercambio.map((detalle) => (
                <View key={detalle.id ?? detalle.residuo.id} style={styles.materialChip}>
                  <Image
                    source={getResiduoIcon(detalle.residuo.material)}
                    style={styles.materialIcon}
                  />
                  <Text style={styles.materialText} numberOfLines={1}>
                    {detalle.residuo.material}
                  </Text>
                </View>
              ))}
            </View>

            <Text style={styles.verDetalle}>Ver detalle</Text>
          </View>

          <View style={styles.qrBox}>
            <QRCode value={intercambio.token || ""} size={72} />
          </View>
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
              <Text style={styles.modalTitle}>Detalle del intercambio</Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.modalCloseButton}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <FontAwesome6 name="xmark" size={18} color="#fff" />
              </TouchableOpacity>
            </LinearGradient>

            <ScrollView style={styles.modalScroll} contentContainerStyle={styles.modalScrollContent}>
              <View style={[styles.estadoBadgeLarge, { backgroundColor: estadoStyle.bg }]}>
                <Text style={[styles.estadoTextLarge, { color: estadoStyle.color }]}>
                  {estadoStyle.label}
                </Text>
              </View>

              <View style={styles.qrCard}>
                <QRCode value={intercambio.token || ""} size={180} />
                <Text style={styles.qrHint}>Codigo QR del intercambio</Text>
              </View>

              <View style={styles.infoCard}>
                <InfoRow icon="calendar" label="Fecha creacion" value={formatearFecha(intercambio.fecha)} />
                <InfoRow icon="clock" label="Fecha limite" value={formatearFecha(intercambio.fechaLimite)} />
                <InfoRow
                  icon="circle-check"
                  label="Fecha realizado"
                  value={intercambio.fechaRealizado ? formatearFecha(intercambio.fechaRealizado) : "No realizado"}
                />
                <InfoRow icon="star" label="Puntos totales" value={`${intercambio.totalPuntos ?? 0} pts`} highlight />
                <InfoRow icon="weight-scale" label="Peso total" value={`${intercambio.pesoTotal ?? 0} g`} highlight />
                {intercambio.evento?.titulo && (
                  <InfoRow icon="calendar-days" label="Evento" value={intercambio.evento.titulo} />
                )}
              </View>

              <Text style={styles.sectionTitle}>Materiales reciclados</Text>
              <View style={styles.materialsCard}>
                {intercambio.detalleIntercambio.map((detalle) => (
                  <View key={detalle.id ?? detalle.residuo.id} style={styles.materialRow}>
                    <View style={styles.materialRowLeft}>
                      <Image
                        source={getResiduoIcon(detalle.residuo.material)}
                        style={styles.materialRowIcon}
                      />
                      <Text style={styles.materialRowName}>{detalle.residuo.material}</Text>
                    </View>
                    <Text style={styles.materialRowWeight}>{detalle.pesoGramos} g</Text>
                  </View>
                ))}
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
  },
  estadoText: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.3,
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
  cardInfo: {
    flex: 1,
    gap: 10,
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
  materialsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  materialChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#EEF6F3",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    maxWidth: "100%",
  },
  materialIcon: {
    width: 16,
    height: 16,
    resizeMode: "contain",
  },
  materialText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#333",
    flexShrink: 1,
  },
  verDetalle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#2C7865",
    marginTop: 2,
  },
  qrBox: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#D4E8E0",
    borderRadius: 12,
    padding: 8,
    alignItems: "center",
    justifyContent: "center",
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
  },
  estadoTextLarge: {
    fontSize: 13,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  qrCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#D4E8E0",
    alignItems: "center",
    paddingVertical: 20,
    marginBottom: 16,
  },
  qrHint: {
    marginTop: 12,
    fontSize: 12,
    color: "#888",
    fontWeight: "500",
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
    maxWidth: "50%",
  },
  infoValueHighlight: {
    color: "#2C7865",
    fontSize: 15,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#2C7865",
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  materialsCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#D4E8E0",
    overflow: "hidden",
    marginBottom: 8,
  },
  materialRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EEF6F3",
  },
  materialRowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  materialRowIcon: {
    width: 22,
    height: 22,
    resizeMode: "contain",
  },
  materialRowName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    flex: 1,
  },
  materialRowWeight: {
    fontSize: 14,
    fontWeight: "800",
    color: "#2C7865",
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
