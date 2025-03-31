import { Image, Pressable, StatusBar, Text, TextInput, View } from "react-native";
import { styles } from "../constants/styles";
import { useState } from "react";
import { useFonts } from "expo-font";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";
import { Link, useRouter } from "expo-router";
import React from "react";
import { BtnLoginGyF } from "@/components/BtnLoginGyF";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const registerSchema = z.object({
  fullname: z.string().nonempty("El nombre es obligatorio"),
  username: z.string().nonempty("El nombre de usuario es obligatorio"),
  email: z.string().nonempty("El correo es obligatorio").email("Correo inválido"),
  password: z.string().nonempty("La contraseña es obligatoria").min(6, "Mínimo 6 caracteres"),
  confirmPassword: z.string().nonempty("La confirmación de contraseña es obligatoria").min(6, "Mínimo 6 caracteres")
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Las contrasenas no coinciden",
    path: ["confirmPassword"],
  })

export default function Register() {
  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const router = useRouter();

  const onSubmit = async (data: { fullname: string; username: string; email: string; password: string; confirmPassword: string }) => {
    try {
      const response = await fetch("https://example.com/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || "Error en el registro");
      }
      
      console.log("Registro exitoso:", result);
      router.dismissAll();
      router.push("/(tabs)");
    } catch (error) {
      setError("email", { type: "manual", message: "Error en el registro" });
    }
  };

  return (
    <View style={styles.body}>
      <View style={styles.container}>
        <Text style={styles.verdeando}>Verdeando</Text>
        <Text style={{ fontFamily: "Roboto" }}>Colab</Text>
        <Text>Registrate</Text>
        <Text>
          ¿Ya tienes una cuenta?
          <Link style={styles.link} href={"/"}>
            Inicia sesión
          </Link>
        </Text>
        <BtnLoginGyF />
        <View style={styles.separator} />

        <Controller
          control={control}
          name="fullname"
          render={({ field: { onChange, onBlur, value } }) => (
            <>
              <TextInput
                style={styles.input}
                placeholder="Fullname"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
              {errors.fullname && <Text style={styles.error}>{errors.fullname.message}</Text>}
            </>
          )}
        />

        <Controller
          control={control}
          name="username"
          render={({ field: { onChange, onBlur, value } }) => (
            <>
              <TextInput
                style={styles.input}
                placeholder="Username"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
              {errors.username && <Text style={styles.error}>{errors.username.message}</Text>}
            </>
          )}
        />

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
        
        <Controller
          control={control}
          name="confirmPassword"
          render={({ field: { onChange, onBlur, value } }) => (
            <>
              <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                secureTextEntry
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
              {errors.confirmPassword && <Text style={styles.error}>{errors.confirmPassword.message}</Text>}
            </>
          )}
        />

        {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}
        {errors.password && <Text style={styles.error}>{errors.password.message}</Text>}
        <Text style={{ marginBottom: 10 }}>¿Has olvidado la contraseña?</Text>

        <Pressable
          style={({ pressed }) => [styles.buttonText, pressed && styles.buttonPressed]}
          onPress={handleSubmit(onSubmit)}
        >
          <Text style={{ color: "white" }}>Registrarse</Text>
        </Pressable>
      </View>

      <View style={styles.footer}>
        <Text>Verdeando 1.0.0</Text>
        <Text>Dodo Games</Text>
      </View>
    </View>
  );
}
