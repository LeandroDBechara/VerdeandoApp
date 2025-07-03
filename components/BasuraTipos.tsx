import { Residuo } from "@/contexts/IntercambiosContext";
import { FontAwesome6 } from "@expo/vector-icons";
import { Pressable, Text, StyleSheet, ImageSourcePropType, Image } from "react-native";
    
export default function BasuraTipos ({ residuo, selected, setSelected }: { residuo: Residuo, selected: boolean, setSelected: (selected: boolean) => void }) {
    return (
        <Pressable onPress={() => setSelected(!selected)} style={[styles.interestingButton, { backgroundColor: selected ? "lightgreen" : "white" }]}>
            <Image source={residuo.icon} style={{ width: 24, height: 24, resizeMode: "contain" }} />
            <Text>{residuo.material}</Text>
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