import InfoTips from "@/components/infotips";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useNewsletter } from "@/contexts/NewsletterContext";
import StatsTabs from "@/components/estadisticas/StatsTabs";
import { useState } from "react";

export default function Comunidad() {
    const { articulos } = useNewsletter();
    const [activeTab, setActiveTab] = useState("Noticias");
    return (
        <View style={styles.mainContainer}>
            <StatsTabs activeTab={activeTab} onTabChange={setActiveTab} tabs={["Noticias", "Mis noticias"]} />
            {activeTab === "Noticias" && (<>
            <Text style={styles.title}>Noticias Ambientales</Text>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.container}>
                    {articulos.length > 0 ? (
                        articulos.map((articulo: any, index: number) => (
                            <InfoTips key={articulo.id} infotip={articulo} />
                        ))
                    ) : (
                        <Text style={styles.noDataText}>No hay noticias disponibles</Text>
                    )}
                </View>
            </ScrollView>   
            </>)}
            {activeTab === "Mis noticias" && (<>
            <Text style={styles.title}>Mis noticias</Text>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.container}>
                    {articulos.length > 0 ? (
                        articulos.map((articulo: any, index: number) => (
                            <InfoTips key={articulo.id} infotip={articulo} />
                        ))
                    ) : (
                        <Text style={styles.noDataText}>No hay noticias disponibles</Text>
                    )}
                </View>
            </ScrollView>
            </>)}
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontWeight: "bold",
        color: "#2C7865",
        fontSize: 24,
        textAlign: "left",
        paddingHorizontal: 15,
        paddingTop: 15,
        paddingBottom: 10,
    },
    scrollContent: {
        paddingBottom: 20,
    },
    container: {
        flex: 1,
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        padding: 10,
        gap: 10,
    },
    noDataText: {
        textAlign: 'center',
        color: '#888',
        fontSize: 16,
        marginTop: 20,
        width: '100%',
    },
});