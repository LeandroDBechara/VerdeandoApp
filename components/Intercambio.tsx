import { View, Text, StyleSheet } from "react-native";
import BasuraTipos from "./BasuraTipos";
import { FontAwesome6 } from "@expo/vector-icons";

export default function Intercambio({ id, fecha, basura }: { id: string, fecha: string, basura: { key: string, icon: string, text: string }[] }) {
    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text>Id intercambio: {id}</Text>
                <Text>Fecha intercambio: {fecha}</Text>
            
            <View style={styles.basuraContainer}>
                {basura.map((item) => (
                    <View key={item.key}>
                    <BasuraTipos icon={item.icon} text={item.text} />
                    </View>
                ))}
            </View>
            </View>
            <View style={styles.qrContainer}>
                <FontAwesome6 name="spinner" size={24} color="lightgreen" />
            </View>
        </View>
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
        width: "80%",
    },
    qrContainer: {
        width: "20%",
    },
});