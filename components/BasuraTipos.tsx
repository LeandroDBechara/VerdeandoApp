import { FontAwesome6 } from "@expo/vector-icons";
import { Pressable, Text, StyleSheet } from "react-native";
    
export default function BasuraTipos ({ icon, text }: { icon: string, text: string }) {
    return (
        <Pressable style={styles.interestingButton}>
            <FontAwesome6 name={icon} size={24} color="lightgreen" />
            <Text>{text}</Text>
        </Pressable>    
    );
}

const styles = StyleSheet.create({
    interestingButton: {
        flexDirection: "row",
        backgroundColor: "white",
        justifyContent: "center",
        alignItems: "center",
        gap: 5,
        borderRadius: 25,
        paddingHorizontal: 10,
        paddingVertical: 5,
        shadowColor: "black",
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
});