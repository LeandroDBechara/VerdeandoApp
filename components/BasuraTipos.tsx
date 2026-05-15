import { Residuo, getResiduoIcon } from "@/contexts/IntercambiosContext";
import { Pressable, Text, StyleSheet, Image } from "react-native";
    
export default function BasuraTipos ({ residuo, selected, setSelected }: { residuo: Residuo, selected: boolean, setSelected: () => void }) {
    const icon = getResiduoIcon(residuo.material);
    return (
        <Pressable onPress={setSelected} style={[styles.interestingButton, { backgroundColor: selected ? "lightgreen" : "white" }]}>
            <Image source={icon} style={{ width: 24, height: 24, resizeMode: "contain" }} />
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