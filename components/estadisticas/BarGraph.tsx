import { Intercambio } from "@/contexts/IntercambiosContext";
import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet } from "react-native";
import { BarChart } from "react-native-gifted-charts";
import { LinearGradient } from "expo-linear-gradient";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

interface MonthlyData {
  month: string;
  intercambios: number;
  pesoTotal: number;
}

export default function BarGraph({ intercambios }: { intercambios: Intercambio[] }) {
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<MonthlyData | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    processIntercambiosData();
  }, [intercambios]);

  const processIntercambiosData = () => {
    const currentDate = new Date();
    const months = [];

    for (let i = 4; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthName = date.toLocaleDateString("es-ES", { month: "short" });

      const monthIntercambios = intercambios.filter((intercambio) => {
        if (!intercambio.fecha) return false;
        const intercambioDate = new Date(intercambio.fecha);
        return (
          intercambioDate.getFullYear() === date.getFullYear()
          && intercambioDate.getMonth() === date.getMonth()
        );
      });

      const pesoTotal = monthIntercambios.reduce((total, intercambio) => {
        return total + (intercambio.pesoTotal || 0);
      }, 0);

      months.push({
        month: monthName,
        intercambios: monthIntercambios.length,
        pesoTotal,
      });
    }

    setMonthlyData(months);
  };

  const getBarData = () => {
    return monthlyData.map((data) => ({
      value: data.intercambios,
      label: data.month,
      frontColor: "#3D9A82",
      gradientColor: "#2C7865",
      showGradient: true,
      topLabelComponent: () => (
        <Text style={styles.topLabel}>{data.intercambios}</Text>
      ),
      onPress: () => handleBarPress(data),
    }));
  };

  const handleBarPress = (monthData: MonthlyData) => {
    setSelectedMonth(monthData);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedMonth(null);
  };

  const totalIntercambios = monthlyData.reduce((sum, m) => sum + m.intercambios, 0);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#2C7865", "#1E5248"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <View style={styles.headerIcon}>
          <FontAwesome6 name="chart-column" size={16} color="#FFD700" />
        </View>
        <View style={styles.headerTextBlock}>
          <Text style={styles.title}>Intercambios por mes</Text>
          <Text style={styles.subtitle}>Ultimos 5 meses</Text>
        </View>
      </LinearGradient>

      <View style={styles.chartBody}>
        <View style={styles.summaryRow}>
          <View style={styles.summaryPill}>
            <Text style={styles.summaryValue}>{totalIntercambios}</Text>
            <Text style={styles.summaryLabel}>Total</Text>
          </View>
          <Text style={styles.chartHint}>Toca una barra para ver detalle</Text>
        </View>

        <BarChart
          noOfSections={3}
          data={getBarData()}
          yAxisThickness={0}
          xAxisThickness={1}
          xAxisColor="#D4E8E0"
          adjustToWidth
          barWidth={34}
          spacing={18}
          hideRules={false}
          rulesColor="#EEF6F3"
          yAxisTextStyle={styles.yAxisText}
          xAxisLabelTextStyle={styles.xAxisText}
          initialSpacing={16}
          endSpacing={16}
          barBorderRadius={6}
        />
      </View>

      <Modal animationType="fade" transparent visible={modalVisible} onRequestClose={closeModal}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={closeModal}>
          <TouchableOpacity style={styles.modalContent} activeOpacity={1} onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalHeaderRow}>
              <FontAwesome6 name="calendar" size={18} color="#2C7865" />
              <Text style={styles.modalTitle}>{selectedMonth?.month}</Text>
            </View>
            <View style={styles.modalInfo}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Intercambios</Text>
                <Text style={styles.infoValue}>{selectedMonth?.intercambios}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Peso total</Text>
                <Text style={styles.infoValue}>{selectedMonth?.pesoTotal} g</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 14,
    marginBottom: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#D4E8E0",
    shadowColor: "#1E5248",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 10,
  },
  headerIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTextBlock: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "800",
    color: "#fff",
  },
  subtitle: {
    fontSize: 12,
    color: "rgba(255,255,255,0.8)",
    marginTop: 2,
  },
  chartBody: {
    padding: 14,
    backgroundColor: "#FAFFFE",
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  summaryPill: {
    backgroundColor: "#EEF6F3",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D4E8E0",
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: "900",
    color: "#2C7865",
  },
  summaryLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "#666",
    textTransform: "uppercase",
  },
  chartHint: {
    fontSize: 11,
    color: "#888",
    fontStyle: "italic",
  },
  topLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: "#2C7865",
    textAlign: "center",
    marginBottom: 4,
  },
  yAxisText: {
    fontSize: 11,
    color: "#888",
  },
  xAxisText: {
    fontSize: 11,
    color: "#666",
    fontWeight: "600",
    textTransform: "capitalize",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#FAFFFE",
    borderRadius: 16,
    padding: 24,
    margin: 20,
    minWidth: 280,
    borderWidth: 1,
    borderColor: "#D4E8E0",
    shadowColor: "#1E5248",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  modalHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
    justifyContent: "center",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#2C7865",
    textTransform: "capitalize",
  },
  modalInfo: {
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D4E8E0",
    overflow: "hidden",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#EEF6F3",
  },
  infoLabel: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "800",
    color: "#2C7865",
  },
  closeButton: {
    backgroundColor: "#2C7865",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
});
