import React, { useState } from "react";
import { View, Text, Pressable, TextInput, StyleSheet, ScrollView } from "react-native";
import { useUser } from "@/contexts/UserContext";
import { Image } from "expo-image";
import { Controller } from "react-hook-form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import * as ImagePicker from "expo-image-picker";

const userSchema = z.object({
    nombre: z.string().nonempty("El nombre es obligatorio"),
    apellido: z.string().nonempty("El apellido es obligatorio"),
    email: z.string().nonempty("El email es obligatorio").email("Correo inválido"),
    password: z.string().nonempty("La contraseña es obligatoria").min(6, "Mínimo 6 caracteres"),
    fechaDeNacimiento: z.string().nonempty("La fecha de nacimiento es obligatoria"),
    direccion: z.string().nonempty("La dirección es obligatoria"),
});
const colaboradorSchema = z.object({
    cvu: z.string().nonempty("El CVU es obligatorio"),
    domicilioFiscal: z.string().nonempty("El domicilio fiscal es obligatorio"),
    cuitCuil: z.string().nonempty("El CUIL/CUIT es obligatorio"),
});

export default function UserConfig() {
    const { user, updateUser, updateColaborador } = useUser();
    const [isEditingUser, setIsEditingUser] = useState(false);
    const [showColaborador, setShowColaborador] = useState(false);

    const {
        control,
        handleSubmit,
        formState: { errors },
        setError,
      } = useForm({
        resolver: zodResolver(userSchema),
      });

      const {
        control: controlColaborador,
        handleSubmit: handleSubmitColaborador,
        formState: { errors: errorsColaborador },
        setError: setErrorColaborador,
      } = useForm({
        resolver: zodResolver(colaboradorSchema),
      });

    const onSubmit = async (data: {
        nombre: string;
        apellido: string;
        email: string;
        password: string;
        fechaDeNacimiento: string;
        direccion: string;
    }) => {
        try {
            const userData = {
                nombre: data.nombre,
                apellido: data.apellido,
                email: data.email,
                password: data.password,
                fechaDeNacimiento: data.fechaDeNacimiento,
                direccion: data.direccion,
            }
            await updateUser(userData);
            console.log("Usuario actualizado");
            setIsEditingUser(false);
        } catch (error) {
            setError("root", { type: "manual", message: "Error en la actualización" });
        }
    }

    const onSubmitColaborador = async (data: {
        cvu: string;
        domicilioFiscal: string;
        cuitCuil: string;
    }) => {
        try {
            const colaboradorData = {
                cvu: data.cvu,
                domicilioFiscal: data.domicilioFiscal,
                cuitCuil: data.cuitCuil,
            }
            await updateColaborador(colaboradorData);
            console.log("Colaborador actualizado");
            setShowColaborador(false);
        } catch (error) {
            setErrorColaborador("root", { type: "manual", message: "Error en la actualización" });
        }
    }

    const uploadImage = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ["images"],
                allowsEditing: true,
                aspect: [1, 1],
            });
            if (!result.canceled) {
                const image = result.assets[0].uri;
                console.log(image);
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <ScrollView contentContainerStyle={styles.container} >
            <View style={styles.userContainer}>
                <View style={styles.headerContainer}>
                    <Text style={styles.sectionTitle}>Datos de Usuario</Text>
                    <Pressable 
                        onPress={() => setIsEditingUser(!isEditingUser)}
                        style={styles.editButton}
                    >
                        <Text style={styles.editButtonText}>
                            {isEditingUser ? "Cancelar" : "Editar"}
                        </Text>
                    </Pressable>
                </View>
                
                <Image source={ user?.fotoPerfil ? {uri: user?.fotoPerfil} : require("@/assets/images/perfil.png")} style={styles.image} />
                {isEditingUser && (
                    <Pressable onPress={() => {uploadImage()}}><Text>Editar foto de perfil</Text></Pressable>
                )}
                
                {isEditingUser ? (
                    <>
                        <Controller
                            control={control}
                            name="nombre"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <View style={styles.inputContainer}>
                                    <Text>Nombre: </Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder={user?.nombre}
                                        keyboardType="default"
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                    />
                                </View>
                            )}
                        />
                        {errors.nombre && <Text style={styles.error}>{errors.nombre.message}</Text>}
                        
                        <Controller
                            control={control}
                            name="apellido"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <View style={styles.inputContainer}>
                                    <Text>Apellido: </Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder={user?.apellido}
                                        keyboardType="default"
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                    />
                                </View> 
                            )}
                        />
                        {errors.apellido && <Text style={styles.error}>{errors.apellido.message}</Text>}
                         <Controller
                            control={control}
                            name="email"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <View style={styles.inputContainer}>
                                    <Text>Email: </Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder={user?.email}
                                        keyboardType="email-address"
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                    />
                                </View>
                            )}
                        />
                        {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}
                        <Controller
                            control={control}
                            name="direccion"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <View style={styles.inputContainer}>
                                    <Text>Dirección: </Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder={user?.direccion}
                                        keyboardType="default"
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                    />
                                </View>
                            )}
                        />
                        {errors.direccion && <Text style={styles.error}>{errors.direccion.message}</Text>}
                        
                        
                            <Controller
                            control={control}
                            name="fechaDeNacimiento"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <View style={styles.inputContainer}>
                                    <Text>Fecha de Nacimiento: </Text>
                                    <TextInput
                                        style={[styles.input, {width: "50%"}]}
                                        placeholder={user?.fechaDeNacimiento?.split("T")[0]}
                                        keyboardType="numeric"
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                    />
                                </View>
                            )}
                        />
                        {errors.fechaDeNacimiento && <Text style={styles.error}>{errors.fechaDeNacimiento.message}</Text>}
                        
                        <Controller
                            control={control}
                            name="password"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <View style={styles.inputContainer}>
                                    <Text>Contraseña: </Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="********"
                                        keyboardType="visible-password"
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                    />
                                </View>
                            )}
                        />
                        {errors.password && <Text style={styles.error}>{errors.password.message}</Text>}
                        <Pressable onPress={handleSubmit(onSubmit)} style={styles.button}>
                            <Text style={styles.buttonText}>Guardar</Text>
                        </Pressable>
                        {errors.root && <Text style={styles.error}>{errors.root.message}</Text>}
                    </>
                ) : (
                    <View style={styles.readOnlyContainer}>
                        <View style={styles.readOnlyRow}>
                            <Text style={styles.readOnlyLabel}>Nombre:</Text>
                            <Text style={styles.readOnlyValue}>{user?.nombre}</Text>
                        </View>
                        <View style={styles.readOnlyRow}>
                            <Text style={styles.readOnlyLabel}>Apellido:</Text>
                            <Text style={styles.readOnlyValue}>{user?.apellido}</Text>
                        </View>
                        <View style={styles.readOnlyRow}>
                            <Text style={styles.readOnlyLabel}>Email:</Text>
                            <Text style={styles.readOnlyValue}>{user?.email}</Text>
                        </View>
                        <View style={styles.readOnlyRow}>
                            <Text style={styles.readOnlyLabel}>Dirección:</Text>
                            <Text style={styles.readOnlyValue}>{user?.direccion || ""}</Text>
                        </View>
                        <View style={styles.readOnlyRow}>
                            <Text style={styles.readOnlyLabel}>Fecha de Nacimiento:</Text>
                            <Text style={styles.readOnlyValue}>{user?.fechaDeNacimiento?.split("T")[0]}</Text>
                        </View>
                        <View style={styles.readOnlyRow}>
                            <Text style={styles.readOnlyLabel}>Contraseña:</Text>
                            <Text style={styles.readOnlyValue}>********</Text>
                        </View>
                    </View>
                )}
            </View>

            <View style={styles.colaboradorContainer}>
                <View style={styles.headerContainer}>
                    <Text style={styles.sectionTitle}>Datos de Colaborador</Text>
                    <Pressable 
                        onPress={() => setShowColaborador(!showColaborador)}
                        style={styles.editButton}
                    >
                        <Text style={styles.editButtonText}>
                            {showColaborador ? "Ocultar" : "Editar"}
                        </Text>
                    </Pressable>
                </View>
                
                {showColaborador && (
                    <>
                        <Controller
                            control={controlColaborador}
                            name="cvu"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <View style={styles.inputContainer}>
                                    <Text>CVU: </Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder={user?.colaborador?.cvu || ""}
                                        keyboardType="default"
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                    />
                                </View>
                            )}
                        />
                        {errorsColaborador.cvu && <Text style={styles.error}>{errorsColaborador.cvu.message}</Text>}
                        <Controller
                            control={controlColaborador}
                            name="domicilioFiscal"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <View style={styles.inputContainer}>
                                    <Text>Domicilio: </Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder={user?.colaborador?.domicilioFiscal || ""}
                                        keyboardType="default"
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                    />
                                </View>
                            )}
                        />
                        {errorsColaborador.domicilioFiscal && <Text style={styles.error}>{errorsColaborador.domicilioFiscal.message}</Text>}
                        <Controller
                            control={controlColaborador}
                            name="cuitCuil"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <View style={styles.inputContainer}>
                                    <Text>Cuil/Cuit: </Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder={user?.colaborador?.cuitCuil || ""}
                                        keyboardType="default"
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                    />
                                </View>
                            )}
                        />
                        {errorsColaborador.cuitCuil && <Text style={styles.error}>{errorsColaborador.cuitCuil.message}</Text>}
                        <Pressable onPress={handleSubmitColaborador(onSubmitColaborador)} style={styles.button}>
                            <Text style={styles.buttonText}>Guardar</Text>
                        </Pressable>
                        {errorsColaborador.root && <Text style={styles.error}>{errorsColaborador.root.message}</Text>}
                    </>
                )}
            </View>
        </ScrollView>
    );
}
const styles = StyleSheet.create({
    container: {
        gap: 20,
        padding: 20,
    },
    userContainer: {
        gap: 20,
        padding: 20,
            
    },
    colaboradorContainer: {
        gap: 10,
        padding: 20,
        
    },
    input: {
        borderWidth: 1,
        borderColor: "gray",    
        padding: 10,
        borderRadius: 5,
        width: "70%",
        flexWrap: "wrap",
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    button: {
        backgroundColor: "green",
        padding: 10,
        borderRadius: 5,
        width: "30%",
        alignSelf: "flex-end",
        justifyContent: "center",
        alignItems: "center",
    },
    error: {
        color: "red",
        fontSize: 12,
    },
    label: {
        fontSize: 16,
        fontWeight: "bold",      
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 10,
        flexWrap: "wrap",
    },
    headerContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
    },
    editButton: {
        padding: 5,
        borderWidth: 1,
        borderColor: "gray",
        borderRadius: 5,
    },
    editButtonText: {
        fontSize: 14,
        fontWeight: "bold",
    },
    readOnlyContainer: {
        padding: 10,
    },
    readOnlyRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 5,
    },
    readOnlyLabel: {
        fontWeight: "bold",
    },
    readOnlyValue: {
        flexWrap: "wrap",
    },
    buttonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },

});