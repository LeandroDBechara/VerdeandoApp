import StatsTabs from "@/components/estadisticas/StatsTabs";
import InfoTips from "@/components/infotips";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { tagColor } from "@/constants/TagColors";
import InfoTipsRate from "@/components/infoTipsRate";
import { Articulo, useNewsletter } from "@/contexts/NewsletterContext";

export default function Comunidad() {
    const { articulos } = useNewsletter();
    // Sacar los tags únicos dinámicamente
    const tagsDisponibles = Array.from(new Set(articulos.map(t => t.tag)));
    const [tagActivo, setTagActivo] = useState("");
    // Filtrar infotips según el tag seleccionado
    const infotipsFiltrados = tagActivo === "" ? articulos : articulos.filter(t => t.tag === tagActivo);

    return (
        <View>
            <Text style={styles.titleRate}>Más relevantes</Text>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.scrollView}
                contentContainerStyle={{ paddingHorizontal: 10 }}
                decelerationRate="fast"
                snapToInterval={272}
                snapToAlignment="start"
            >
                {articulos
                  .sort((a: Articulo, b: Articulo) => (b.relevancia || 0) - (a.relevancia || 0))
                  .slice(0, 4)
                  .map((articulo: Articulo) => (
                    <InfoTipsRate key={articulo.id} infotip={articulo} />
                ))}
            </ScrollView>
            {/* Scroll horizontal de tags */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginVertical: 10}}>
                {tagsDisponibles.map((tag) => (
                    <TouchableOpacity
                        key={tag}
                        style={[
                            styles.tagBtn,
                            { borderColor: tagColor(tag) },
                            tagActivo === tag && { backgroundColor: tagColor(tag) }
                        ]}
                        onPress={() => setTagActivo(tag)}
                    >
                        <Text
                            style={[
                                styles.tagBtnText,
                                { color: tagColor(tag) },
                                tagActivo === tag && { color: 'white' }
                            ]}
                        >
                            {tag}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
            <ScrollView>
                <View style={styles.container}>
                    {infotipsFiltrados.map((infotip: any) => (
                        <InfoTips key={infotip.id} infotip={infotip} />
                    ))}
                </View>
            </ScrollView>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        padding: 10,
        gap: 10,
    },
    tagBtn: {
        backgroundColor: '#eee',
        borderRadius: 20,
        paddingHorizontal: 20,
        paddingVertical: 8,
        marginHorizontal: 6,
        borderWidth: 1,
        borderColor: '#2C7865',
    },
    tagBtnActivo: {
        backgroundColor: '#2C7865',
    },
    tagBtnText: {
        color: '#2C7865',
        fontWeight: 'bold',
    },
    tagBtnTextActivo: {
        color: 'white',
    },
    scrollView: {
        marginVertical: 10,
        paddingVertical: 10,
        backgroundColor: "#FFFBF4",
        borderRadius: 10,
        marginHorizontal: 1,
        borderWidth: 1,
        borderColor: "#FFFBF4",
    },
    titleRate: {
        fontWeight: "bold",
        color: "#2C7865",
        fontSize: 20,
        textAlign: "left",
        paddingHorizontal: 15,
        paddingTop: 10,
    },
});