import { ScrollView, View, Text } from "react-native";
import Cupon from "@/components/Cupon";
import { useEffect, useState } from "react";
import { useRecompensas } from "@/contexts/RecompensaContext";
import StatsTabs from "@/components/estadisticas/StatsTabs";
import Canje from "@/components/Canje";
import { StyleSheet } from "react-native";

export default function Cuponera() {
    const {recompensas, canjes} = useRecompensas();
    const [activeTab, setActiveTab] = useState("Cupones");
    return (
        <View>
            <StatsTabs activeTab={activeTab} onTabChange={setActiveTab} tabs={["Cupones", "Canjes"]} />
            <ScrollView>
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
    noDataText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
        textAlign: "center",
        flexWrap: "wrap",
    },
});