import { useState } from "react";
import { Button, Image, Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { PuntoVerde } from "@/contexts/PuntoVerdeContext";
import { Ionicons } from '@expo/vector-icons';

export default function ModalDetallePuntoVerde({modalPVVisible, setModalPVVisible}: {modalPVVisible: [boolean, PuntoVerde | null], setModalPVVisible: (visible: [boolean, PuntoVerde | null]) => void}) {
    
    return (
        <Modal visible={modalPVVisible[0]} animationType="slide" transparent={true} onRequestClose={() => setModalPVVisible([false, null])}> 
            <View style={styles.modalBackground}>
                <View style={styles.container}>
                    <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                <Text style={styles.title}>{modalPVVisible[1]?.nombre}</Text>
                <Text style={styles.descripcion}>{modalPVVisible[1]?.descripcion}</Text>
                <Text style={styles.direccion}><Ionicons name="location" size={20} color="#2C7865"  /> {modalPVVisible[1]?.direccion}</Text>
                <Text style={styles.diasHorarioAtencion}><Ionicons name="calendar" size={20} color="#2C7865" /> {modalPVVisible[1]?.diasHorarioAtencion}</Text>
                <Image source={{ uri: modalPVVisible[1]?.imagen }} style={styles.image} resizeMode="cover" /> 
                <Text style={styles.residuosAceptados}>{modalPVVisible[1]?.residuosAceptados?.join(", ")}</Text>
                </ScrollView>
                 <Pressable style={styles.button} onPress={() => setModalPVVisible([false, null])}>
                    <Text style={styles.buttonText}>Cerrar</Text>
                </Pressable>
                
                </View>
            </View>
      </Modal>
    )
 }
 const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "flex-end",
        alignItems: "center",
    },
    
    container: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 15,
    margin: 20,
    width: "90%",
    height: "70%",
    },

    scrollContainer: {
        width: "90%",
        alignSelf: "center",
    },

    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#2C7865",
        marginBottom: 20,
        textAlign: "center",
        alignSelf: "center",
    },

    direccion: {
        fontSize: 16,
        color: "#2C7865",
        marginBottom: 20,
        textAlign: "left",
    },
    
    descripcion: {
        fontSize: 16,
        color: "#2C7865",
        marginBottom: 20,
        textAlign: "left",
    },
    
    diasHorarioAtencion: {
        fontSize: 16,
        color: "#2C7865",
        marginBottom: 20,
        textAlign: "left",
    },
    
    horarioAtencion: {
        fontSize: 16,
        color: "#2C7865",
        marginBottom: 20,
        textAlign: "left",
    },

    image: {
        width: "100%",
        height: 200,
        borderRadius: 10,
        alignSelf: "center",
    },

    residuosAceptados: {
        fontSize: 16,
        color: "#2C7865",
        marginBottom: 20,
        textAlign: "center",
        marginTop: 20,
    },
    
    button: {
        backgroundColor: "#2C7865",
        color: "white",
        padding: 10,
        borderRadius: 10,
        marginTop: 10,
        alignSelf: "center",
    },

    buttonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
        textAlign: "center",
    },
 });