import { Image, Pressable, StatusBar, Text, TextInput, View } from "react-native";
import { styles } from "../constants/styles";
import { useState } from "react";
import { useFonts } from "expo-font";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";
import { Link } from "expo-router";
import React from "react";
import { BtnLoginGyF } from "@/components/BtnLoginGyF";

export default function register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [fontsLoaded] = useFonts({
    PressStart: require("../assets/fonts/PressStart2P-Regular.ttf"),
    Roboto: require("../assets/fonts/Roboto-Regular.ttf"),
  });
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <View style={styles.container}>
        <Text style={styles.verdeando}>Verdeando</Text>
        <Text style={{ fontFamily: "Roboto" }}>Colab</Text>
        <Text>Iniciar sesión</Text>
        <Text>
          ¿Aún no tienes una cuenta? <Link href={"/"}>Registrate</Link>
        </Text>
        <BtnLoginGyF />
        <View style={styles.separator} />
        <TextInput style={styles.input} placeholder="Nombre" value={name} onChangeText={(text) => setName(text)} />

        <TextInput
          style={styles.input}
          placeholder="Apellido"
          value={lastName}
          onChangeText={(text) => setLastName(text)}
        />

        <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={(text) => setEmail(text)} />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={(text) => setPassword(text)}
          secureTextEntry
        />
        <Text style={{ marginBottom: 10 }}>¿Has olvidado la contraseña?</Text>
        <Pressable
          style={({ pressed }) => [
            styles.buttonText,
            pressed && styles.buttonPressed, // Aplica el estilo cuando se presiona
          ]}
          onPress={() => {}}
        >
          <Text style={{ color: "white" }}>Ingresar</Text>
        </Pressable>
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%",
          padding: 10,
          position: "absolute",
          bottom: 0,
        }}
      >
        <Text>Verdeando 1.0.0</Text>
        <Text>Dodo Games</Text>
      </View>
    </View>
  );
}
