import { View, Text, StyleSheet, Pressable, Modal } from "react-native";
import BasuraTipos from "./BasuraTipos";
import { FontAwesome6 } from "@expo/vector-icons";
import  QRCode  from "react-native-qrcode-svg";
import { Intercambio as IntercambioType } from "@/contexts/IntercambiosContext";
import React, { useState } from "react";

export default function Intercambio({ intercambio }: { intercambio: IntercambioType }) {
    const [modalVisible, setModalVisible] = useState(false);
    return (
        <>
        <Pressable style={styles.container} onPress={() => setModalVisible(true)}>
            <View style={styles.content}>   
                <Text>Id intercambio: {intercambio.id}</Text>
                <Text>Fecha intercambio: {intercambio.fecha}</Text>
            
            <View style={styles.basuraContainer}>
                    {intercambio.detalleIntercambio.map((detalle) => (
                    <View key={detalle.id}>
                    <BasuraTipos key={detalle.residuo.id} residuo={detalle.residuo} selected={false} setSelected={() => {}} />
                    </View>
                ))}
            </View>
            </View>
            <View style={styles.qrContainer}>
                <QRCode value={intercambio.token || ""} size={100} />
            </View>
        </Pressable>
        <Modal visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
            <View style={styles.modalContainer}>
                <QRCode value={intercambio.token || ""} size={300} />
                <Text>Puntos totales: {intercambio.totalPuntos}</Text>
                <Text>Fecha Creacion: {intercambio.fecha}</Text>
                <Text>Fecha limite: {intercambio.fechaLimite}</Text>
                <Text>Fecha realizado: {intercambio.fechaRealizado || "No realizado"}</Text>
                <Text>Estado: {intercambio.estado}</Text>
                <Text>Evento: {intercambio.evento?.titulo}</Text>
                <Text>Punto verde: {intercambio.pesoTotal}</Text>
                <View>
                    {intercambio.detalleIntercambio.map((detalle) => (
                        <View key={detalle.id}>
                             <BasuraTipos key={detalle.residuo.id} residuo={detalle.residuo} selected={false} setSelected={() => {}} />
                            <Text>{detalle.pesoGramos} gramos</Text>
                        </View>
                    ))}
                </View>
            </View>
        </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        backgroundColor: "white",
        borderRadius: 10,
        padding: 10,
        margin: 10,
        borderWidth: 1,
        borderColor: "lightgray",
        shadowColor: "black",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    basuraContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "flex-start",
    },
    content: {
        width: "65%",
    },
    qrContainer: {
        width: "35%",
        alignItems: "center",
        justifyContent: "center",
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});