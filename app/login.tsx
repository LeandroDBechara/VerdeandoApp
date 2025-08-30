import { Pressable, Text, TextInput, View, Image, StyleSheet } from "react-native";
import { Link, useRouter } from "expo-router";
import { BtnLoginGyF } from "@/components/BtnLoginGyF";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {z} from "zod";
import React, { useState, useEffect } from "react";
import { Ionicons } from '@expo/vector-icons';
import { useUser } from "@/contexts/UserContext";

const loginSchema = z.object({
    email: z.string().nonempty("El correo es obligatorio").email("Correo inválido"),
    password: z.string().nonempty("La contraseña es obligatoria").min(6, "Mínimo 6 caracteres"),
  });

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const { login, user } = useUser();
    const router = useRouter();

    useEffect(() => {
      if (user) {
        router.replace("/(tabs)");
      }
    }, [user]);

    const {
        control,
        handleSubmit,
        formState: { errors },
        setError,
      } = useForm({
        resolver: zodResolver(loginSchema),
      });

  const onSubmit = async (data: { email: string; password: string }) => {
    try {
      await login(data);
      router.replace("/(tabs)");
    } catch (error) {
      setError("root", { type: "manual", message: "Usuario o contraseña incorrectos" });
    }
  };

  return (
    <View style={styles.body}>
      <View style={styles.container}>
        <Image source={require("@/assets/images/logoVerdeando.png")} resizeMode="contain" style={{ width: 240, height: 50 }} />
        <Text style={styles.title}>Iniciar sesión</Text> 
        
        <BtnLoginGyF />
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
                />
              </View>
            </>
          )}
        />

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <>
              <View style={styles.inputContainer}>
                <Text style={styles.placeholder}>Password</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <TextInput
                    style={[styles.input]}
                    placeholder=""
                    secureTextEntry={!showPassword}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                  <Pressable
                    onPress={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: 10, top: 16 }}
                  >
                    <Ionicons
                      name={showPassword ? "eye-off-outline" : "eye-outline"}
                      size={24}
                      color="lightgray"
                    />
                  </Pressable>
                </View>
              </View>
              
            </>
          )}
        />
        </View>
        {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}
        {errors.password && <Text style={styles.error}>{errors.password.message}</Text>}
        {errors.root && <Text style={styles.error}>{errors.root.message}</Text>}

        <Pressable
          style={({ pressed }) => [styles.buttonIngresar, pressed && styles.buttonPressed]}
          onPress={handleSubmit(onSubmit)}
        >
          <Text style={styles.buttonIngresarText}>Ingresar</Text>
        </Pressable>
        <Text style={{  marginTop: -5 }}> <Link style={styles.link} href="/recuperar">¿Olvidaste la contraseña?</Link></Text>
        <Text style={{ marginBottom: 20 }}>
          ¿Aún no tienes una cuenta? <Link style={styles.link} href={"/register"}>Registrate aquí</Link>
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