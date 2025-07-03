import { ScrollView, View } from "react-native";
import Cupon from "@/components/Cupon";
import { useEffect, useState } from "react";
import { useRecompensas } from "@/contexts/RecompensaContext";
import StatsTabs from "@/components/estadisticas/StatsTabs";
import Canje from "@/components/Canje";

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
                    </View>
                )}
                {activeTab === "Canjes" && (
                    <View>
                        {canjes.map((canje)=>(
                            <Canje key={canje.id} canje={canje} />
                        ))}
                    </View>
                )}
            </ScrollView>
        </View>
    );
}