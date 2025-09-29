import { Pressable, StyleSheet, TextInput, View } from "react-native";
import BasuraTipos from "./BasuraTipos";
import { Residuo } from "@/contexts/IntercambiosContext";
import { useState, useEffect } from "react";

interface ResiduoIntercambioProps {
  residuo: Residuo;
  onDataChange: (residuoId: string, selected: boolean, peso: string) => void;
}


export default function ResiduoIntercambio({ residuo, onDataChange }: ResiduoIntercambioProps) {
    const [selected, setSelected] = useState(false);
    const [peso, setPeso] = useState("");

    useEffect(() => {
        onDataChange(residuo.id || "", selected, peso);
    }, [selected, peso, residuo.id]);

    return (
        <View style={styles.container}>
            <BasuraTipos residuo={residuo} selected={selected} setSelected={() => setSelected(!selected)} />
            <TextInput
                style={styles.input}
                placeholder="Peso"
                keyboardType="numeric"
                onChangeText={setPeso}
                value={peso}
            />
        </View>
    );
}   

const styles = StyleSheet.create({
    container: {

        gap: 10,
    },
    input: {
        width: '100%',
        height: 40,
        borderRadius: 8,
        backgroundColor: "white",
        borderColor: "#D9D9D9",
        borderWidth: 1,
        color: "#929292",
        padding: 10,
      },
});