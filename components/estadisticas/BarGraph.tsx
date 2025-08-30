import { Intercambio } from "@/contexts/IntercambiosContext";
import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet } from "react-native";
import { BarChart } from "react-native-gifted-charts";

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
        
        // Generar los últimos 5 meses
        for (let i = 4; i >= 0; i--) {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
            const monthName = date.toLocaleDateString('es-ES', { month: 'short' });
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            
            // Filtrar intercambios del mes
            const monthIntercambios = intercambios.filter(intercambio => {
                if (!intercambio.fecha) return false;
                const intercambioDate = new Date(intercambio.fecha);
                return intercambioDate.getFullYear() === date.getFullYear() && 
                       intercambioDate.getMonth() === date.getMonth();
            });
            
            const pesoTotal = monthIntercambios.reduce((total, intercambio) => {
                return total + (intercambio.pesoTotal || 0);
            }, 0);
            
            months.push({
                month: monthName,
                intercambios: monthIntercambios.length,
                pesoTotal: pesoTotal
            });
        }
        
        setMonthlyData(months);
    };

    const getBarData = () => {
        return monthlyData.map((data, index) => ({
            value: data.intercambios,
            label: data.month,
            frontColor: "#90D26D",
            topLabelComponent: () => (
                <Text style={styles.topLabel}>{data.intercambios}</Text>
            ),
            onPress: () => handleBarPress(data)
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

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Intercambios por Mes</Text>
            <Text style={styles.subtitle}>Últimos 5 meses</Text>
            
            <BarChart
                noOfSections={3}
                frontColor="#90D26D"
                data={getBarData()}
                yAxisThickness={0}
                xAxisThickness={0}
                adjustToWidth={true}
                barWidth={38}
                spacing={20}
                hideRules={false}
                yAxisTextStyle={styles.yAxisText}
                xAxisLabelTextStyle={styles.xAxisText}
                initialSpacing={20}
                endSpacing={20}
            />

            {/* Modal para mostrar detalles del mes */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={closeModal}
            >
                <TouchableOpacity 
                    style={styles.modalOverlay} 
                    activeOpacity={1} 
                    onPress={closeModal}
                >
                    <View style={styles.modalContent}>
                        <TouchableOpacity activeOpacity={1}>
                            <Text style={styles.modalTitle}>
                                {selectedMonth?.month}
                            </Text>
                            <View style={styles.modalInfo}>
                                <View style={styles.infoRow}>
                                    <Text style={styles.infoLabel}>Intercambios:</Text>
                                    <Text style={styles.infoValue}>
                                        {selectedMonth?.intercambios}
                                    </Text>
                                </View>
                                <View style={styles.infoRow}>
                                    <Text style={styles.infoLabel}>Peso Total:</Text>
                                    <Text style={styles.infoValue}>
                                        {selectedMonth?.pesoTotal} kg
                                    </Text>
                                </View>
                            </View>
                            <TouchableOpacity 
                                style={styles.closeButton} 
                                onPress={closeModal}
                            >
                                <Text style={styles.closeButtonText}>Cerrar</Text>
                            </TouchableOpacity>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
        backgroundColor: 'white',
        borderRadius: 12,
        marginTop: 5,
        marginBottom: 5,
        marginLeft: 10,
        marginRight: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 5,
        color: '#0a7ea4',
    },
    subtitle: {
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 10,
        color: '#666',
    },
    topLabel: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#0a7ea4',
        textAlign: 'center',
    },
    yAxisText: {
        fontSize: 12,
        color: '#666',
    },
    xAxisText: {
        fontSize: 12,
        color: '#666',
        fontWeight: '500',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 24,
        margin: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 5,
        minWidth: 280,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        color: '#0a7ea4',
        textTransform: 'capitalize',
    },
    modalInfo: {
        marginBottom: 24,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    infoLabel: {
        fontSize: 16,
        color: '#666',
        fontWeight: '500',
    },
    infoValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#0a7ea4',
    },
    closeButton: {
        backgroundColor: '#0a7ea4',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        alignItems: 'center',
    },
    closeButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
});