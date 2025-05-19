import { Image, Pressable, StatusBar, StyleSheet, Text, TextInput, View } from "react-native";
import { useState } from "react";
import { Link, useRouter } from "expo-router";
import React from "react";
import { BtnLoginGyF } from "@/components/BtnLoginGyF";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Ionicons } from "@expo/vector-icons";

const registerSchema = z
  .object({
    name: z.string().nonempty("El nombre es obligatorio"),
    fullname: z.string().nonempty("El nombre de usuario es obligatorio"),
    email: z.string().nonempty("El correo es obligatorio").email("Correo inválido"),
    password: z.string().nonempty("La contraseña es obligatoria").min(6, "Mínimo 6 caracteres"),
    confirmPassword: z.string().nonempty("La confirmación de contraseña es obligatoria"),
    birthDate: z.string().nonempty("La fecha de nacimiento es obligatoria")
      .regex(/^\d{2}\/\d{2}\/\d{4}$/, "Formato inválido (DD/MM/AAAA)"),
    termsAccepted: z.boolean().refine((val) => val === true, {
      message: "Debes aceptar los términos y condiciones",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contrasenas no coinciden",
    path: ["confirmPassword"],
  });

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      termsAccepted: false,
    },
  });

  const router = useRouter();

  const onSubmit = async (data: {
    name: string;
    fullname: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => {
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
        <Image source={require("@/assets/images/logo.png")} />
        <Text style={styles.title}>Crear cuenta</Text>

        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, onBlur, value } }) => (
            <>
              <View style={styles.inputContainer}>
                <Text style={styles.placeholder}>Nombre</Text>
                <TextInput
                  style={styles.input}
                  placeholder=""
                  keyboardType="default"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              </View>
              {errors.name && <Text style={styles.error}>{errors.name.message}</Text>}
            </>
          )}
        />

        <Controller
          control={control}
          name="fullname"
          render={({ field: { onChange, onBlur, value } }) => (
            <>
              <View style={styles.inputContainer}>
                <Text style={styles.placeholder}>Apellido</Text>
                <TextInput
                  style={styles.input}
                  placeholder=""
                  keyboardType="default"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              </View>
              {errors.fullname && <Text style={styles.error}>{errors.fullname.message}</Text>}
            </>
          )}
        />
        

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
              {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}
            </>
          )}
        />

        <Controller
          control={control}
          name="birthDate"
          render={({ field: { onChange, onBlur, value } }) => (
            <>
              <View style={styles.inputContainer}>
                <Text style={styles.placeholder}>Fecha de nacimiento</Text>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <TextInput
                    style={[styles.input]}
                    placeholder="DD/MM/AAAA"
                    keyboardType="numeric"
                    onBlur={onBlur}
                    onChangeText={(text) => {
                      // Formatear automáticamente la fecha mientras se escribe
                      let formatted = text.replace(/\D/g, '');
                      if (formatted.length > 0) {
                        if (formatted.length > 2) {
                          formatted = formatted.slice(0, 2) + '/' + formatted.slice(2);
                        }
                        if (formatted.length > 5) {
                          formatted = formatted.slice(0, 5) + '/' + formatted.slice(5, 9);
                        }
                      }
                      onChange(formatted);
                    }}
                    value={value}
                    maxLength={10}
                  />
                  <View style={{ position: "absolute", right: 10, top: 16 }}>
                    <Ionicons name="calendar-outline" size={24} color="lightgray" />
                  </View>
                </View>
              </View>
              {errors.birthDate && <Text style={styles.error}>{errors.birthDate.message}</Text>}
            </>
          )}
        />

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <>
              <View style={styles.inputContainer}>
                <Text style={styles.placeholder}>Contraseña</Text>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
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
                    style={{ position: "absolute", right: 10, top: 16 }}
                  >
                    <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={24} color="lightgray" />
                  </Pressable>
                </View>
              </View>

              {errors.password && <Text style={styles.error}>{errors.password.message}</Text>}
            </>
          )}
        />

        <Controller
          control={control}
          name="confirmPassword"
          render={({ field: { onChange, onBlur, value } }) => (
            <>
              <View style={styles.inputContainer}>
                <Text style={styles.placeholder}>Confirmar contraseña</Text>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
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
                    style={{ position: "absolute", right: 10, top: 16 }}
                  >
                    <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={24} color="lightgray" />
                  </Pressable>
                </View>
              </View>

              {errors.confirmPassword && <Text style={styles.error}>{errors.confirmPassword.message}</Text>}
            </>
          )}
        />
        <View style={styles.termsContainer}>
          <Controller
            control={control}
            name="termsAccepted"
            render={({ field: { onChange, value } }) => (
              <Pressable onPress={() => onChange(!value)} style={[styles.checkbox, value && styles.checkboxChecked]}>
                {value && <Ionicons name="checkmark" size={16} color="white" />}
              </Pressable>
            )}
          />
          <Text style={{ fontFamily: "Noto Sans" }}>
            Acepto los{" "}
            <Link
              style={{ textDecorationLine: "underline", fontFamily: "Noto Sans", fontWeight: "bold" }}
              href={"/login"}
            >
              Términos y condiciones
            </Link>
          </Text>
        </View>
        {errors.termsAccepted && <Text style={styles.error}>{errors.termsAccepted.message}</Text>}

        <Pressable
          style={({ pressed }) => [styles.buttonIngresar, pressed && styles.buttonPressed]}
          onPress={handleSubmit(onSubmit)}
        >
          <Text style={styles.buttonIngresarText}>Registrarse</Text>
        </Pressable>
        <Text style={{ fontFamily: "Noto Sans", marginBottom: 25 }}>
          ¿Ya tienes una cuenta?{" "}
          <Link style={styles.link} href={"/login"}>
            Inicia sesión
          </Link>
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
    position: "relative",
    width: 300,
    marginBottom: 10,
  },
  placeholder: {
    position: "absolute",
    left: 10,
    top: -10,
    backgroundColor: "white",
    paddingHorizontal: 5,
    color: "#929292",
    zIndex: 1,
  },
  input: {
    width: "100%",
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
    bottom: 30,
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
    fontFamily: "Noto Sans",
    fontSize: 12,
    marginBottom: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    fontFamily: "Noto Sans",
  },
  termsContainer: {
    flexDirection: "row",
    gap: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: -15,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: "#2C7865",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: "#2C7865",
  },
});
