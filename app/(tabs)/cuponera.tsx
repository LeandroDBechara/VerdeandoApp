import { ScrollView, View, Text } from "react-native";
import Cupon from "@/components/Cupon";
import { useState } from "react";
import { useRecompensas } from "@/contexts/RecompensaContext";
import { useUser } from "@/contexts/UserContext";
import StatsTabs from "@/components/estadisticas/StatsTabs";
import Canje from "@/components/Canje";
import { StyleSheet } from "react-native";

export default function Cuponera() {
    const { recompensas, canjes } = useRecompensas();
    const { user } = useUser();
    const [activeTab, setActiveTab] = useState("Cupones");
    return (
        <View style={styles.container}>
            <Text style={styles.pointsText}>Puntos: {user?.puntos ?? 0}</Text>
            <StatsTabs activeTab={activeTab} onTabChange={setActiveTab} tabs={["Cupones", "Canjes"]} />
            <ScrollView style={styles.scrollView}>
                {activeTab === "Cupones" && (
                    <View>
                        {recompensas.map((recompensa)=>(
                            <Cupon key={recompensa.id} recompensa={recompensa} />
                        ))}
                        {recompensas.length === 0 && (
                            <Text style={styles.noDataText}>Estamos trabajando en agregar las mejores recompensas para ti </Text>
                        )}
                    </View>
                )}
                {activeTab === "Canjes" && (
                    <View>
                        {canjes.map((canje)=>(
                            <Canje key={canje.id} canje={canje} />
                        ))}
                        {canjes.length === 0 && (
                            <Text style={styles.noDataText}>No has canjeado ninguna recompensa aún, sigue participando en eventos y ganarás puntos para canjear </Text>
                        )}
                    </View>
                )}
            </ScrollView>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    scrollView: {
        padding:10,
        marginBottom: 50,
    },
    pointsText: {
        fontSize: 20,
        fontWeight: "bold",
        color: "green",
        paddingHorizontal: 15,
        paddingTop: 12,
        paddingBottom: 4,
    },
    noDataText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
        textAlign: "center",
        flexWrap: "wrap",
    },
});