import { Pressable, Text, TextInput, View, Image, StyleSheet, Alert } from "react-native";
import { Link, useRouter } from "expo-router";
import { BtnLoginGyF } from "@/components/BtnLoginGyF";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {z} from "zod";
import React, { useState } from "react";
import { Ionicons } from '@expo/vector-icons';

const recoverySchema = z.object({
    email: z.string().nonempty("El correo es obligatorio").email("Correo inválido"),
});

export default function Recuperar() {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const {
        control,
        handleSubmit,
        formState: { errors },
        setError,
        reset,
      } = useForm({
        resolver: zodResolver(recoverySchema),
      });

  const onSubmit = async (data: { email: string }) => {
    setIsLoading(true);
    try {
      const response = await fetch('https://verdeandoback.onrender.com/auth/recovery-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: data.email }),
      });

      if (response.ok) {
        Alert.alert(
          "Correo enviado",
          "Se ha enviado un correo con las instrucciones para cambiar tu contraseña.",
          [
            {
              text: "OK",
              onPress: () => {
                reset();
                router.back();
              }
            }
          ]
        );
      } else {
        const errorData = await response.json();
        setError("root", { 
          type: "manual", 
          message: errorData.message || "Error al enviar el correo de recuperación" 
        });
      }
    } catch (error) {
      setError("root", { 
        type: "manual", 
        message: "Error de conexión. Intenta nuevamente." 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.body}>
      <View style={styles.container}>
        <Image source={require("@/assets/images/logoVerdeando.png")} resizeMode="contain" style={{ width: 240, height: 50 }} />
        <Text style={styles.title}>Recuperar contraseña</Text>  
        <View>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <>
                <View style={styles.inputContainer}>
                  <Text style={styles.placeholder}>Email</Text>
                  <TextInput
                    style={styles.input}
                    placeholder=""
                    keyboardType="email-address"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    editable={!isLoading}
                  />
                </View>
              </>
            )}
          />
        </View>
        
        {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}
        {errors.root && <Text style={styles.error}>{errors.root.message}</Text>}

        <Pressable
          style={({ pressed }) => [
            styles.buttonIngresar, 
            pressed && styles.buttonPressed,
            isLoading && styles.buttonDisabled
          ]}
          onPress={handleSubmit(onSubmit)}
          disabled={isLoading}
        >
          <Text style={styles.buttonIngresarText}>
            {isLoading ? "Enviando..." : "Enviar correo"}
          </Text>
        </Pressable>
        
        <Text style={{ marginBottom: 20 }}>
          <Link style={styles.link} href={"/login"}>Volver al inicio de sesión</Link>
        </Text>
      </View>

      <View style={styles.footer}>
        <Text>Verdeando 1.0.0</Text>
        <Text>Dodo Games</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  inputContainer: {
    position: 'relative',
    width: 300,
    marginBottom: 10,
  },
  placeholder: {
    position: 'absolute',
    left: 10,
    top: -10,
    backgroundColor: 'white',
    paddingHorizontal: 5,
    color: '#929292',
    zIndex: 1,
  },
  input: {
    width: '100%',
    height: 56,
    borderRadius: 8,
    backgroundColor: "white",
    borderColor: "#D9D9D9",
    borderWidth: 1,
    color: "#929292",
    padding: 10,
  },
  buttonIngresar: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: 300,
    borderRadius: 20,
    backgroundColor: "#2C7865",
    paddingVertical: 11,
  },
  buttonIngresarText: {
    color: "#D9EDBF",
    fontSize: 20,
    fontWeight: "medium",
    fontFamily: "Noto Sans",
  },
  buttonPressed: {
    opacity: 0.5,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    padding: 10,
  },
  link: {
    color: "#11B11B",
    textDecorationLine: "underline",
  },
  body: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "white",
  },
  error: {
    color: "red",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    fontFamily: "Noto Sans",
  },
});
