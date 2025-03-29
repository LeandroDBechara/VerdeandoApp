import { Pressable, Text, TextInput, View } from "react-native";
import { styles } from "../constants/styles";
import { Link, useRouter } from "expo-router";
import React from "react";
import { BtnLoginGyF } from "@/components/BtnLoginGyF";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const loginSchema = yup.object().shape({
  email: yup.string().email("Correo inválido").required("El correo es obligatorio"),
  password: yup.string().min(6, "Mínimo 6 caracteres").required("La contraseña es obligatoria"),
});

export default function Index() {
  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const router = useRouter();

  const onSubmit = async (data: { email: string; password: string }) => {
    try {
      const response = await fetch("https://example.com/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Error en la autenticación");
      }

      console.log("Login exitoso:", result);
      router.dismissAll();
      router.push("/(tabs)");
    } catch (error) {
      setError("root", { type: "manual", message: "Usuario o contraseña incorrectos" });
    }
  };

  return (
    <View style={styles.body}>
      <View style={styles.container}>
        <Text style={styles.verdeando}>Verdeando</Text>
        <Text style={{ fontFamily: "Roboto" }}>Colab</Text>
        <Text>Iniciar sesión</Text>
        <Text>
          ¿Aún no tienes una cuenta?
          <Link style={styles.link} href={"/register"}>
            Registrate
          </Link>
        </Text>
        <BtnLoginGyF />
        <View style={styles.separator} />

        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <>
              <TextInput
                style={styles.input}
                placeholder="Email"
                keyboardType="email-address"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
              {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}
            </>
          )}
        />

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <>
              <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
              {errors.password && <Text style={styles.error}>{errors.password.message}</Text>}
            </>
          )}
        />
        {errors.root && <Text style={styles.error}>{errors.root.message}</Text>}
        <Text style={{ marginBottom: 10 }}>¿Has olvidado la contraseña?</Text>

        <Pressable
          style={({ pressed }) => [styles.buttonText, pressed && styles.buttonPressed]}
          onPress={handleSubmit(onSubmit)}
        >
          <Text style={{ color: "white" }}>Ingresar</Text>
        </Pressable>
      </View>

      <View style={styles.footer}>
        <Text>Verdeando 1.0.0</Text>
        <Text>Dodo Games</Text>
      </View>
    </View>
  );
}
