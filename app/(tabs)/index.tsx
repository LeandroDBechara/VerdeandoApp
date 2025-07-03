import Evento from "@/components/Evento";
import { useEffect } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { EventoProvider, useEventos } from "@/contexts/EventoContext";
import { Evento as EventoType } from "@/contexts/EventoContext";
import { useUser } from "@/contexts/UserContext";
import { useIntercambios } from "@/contexts/IntercambiosContext";
export default function Home() {

    const {eventos}=useEventos();
    const {user}=useUser();
    const {getResiduosReciclados}=useIntercambios();
    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
            <Image source={require("@/assets/images/chica-planta.png")} style={styles.headerImage} resizeMode="contain" />
            <View style={styles.header}>
                <Text style={styles.headerText}>Puntos: {user?.puntos}</Text>
                <Text style={styles.headerText}>Residuos reciclados: {getResiduosReciclados()} kg</Text>
                <Text style={styles.headerText}>Este mensaje fachero saldra de una lista: Eres el reciclaneito 😎</Text>
                
            </View>
            </View>
            <Text style={styles.headerText}>Eventos</Text>
            <ScrollView style={styles.scrollView}>
            {eventos.map((evento:EventoType)=>(
                <Evento key={evento.id} evento={evento} />
            ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    headerContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 10,
        width: "60%",
    },
    header: {
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        
    },
    headerImage: {
        width: 150,
        height: 200,
    },
    headerText: {
        fontSize: 20,
        fontWeight: "bold",
        color: "green",
        textAlign: "left",
    },
    scrollView: {
  
        padding: 10,
        marginBottom: 60,
    },
});