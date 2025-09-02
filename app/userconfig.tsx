import React, { useState, useEffect } from "react";
import { View, Text, Pressable, TextInput, StyleSheet, ScrollView, Alert } from "react-native";
import { useUser } from "@/contexts/UserContext";
import { usePuntoVerde } from "@/contexts/PuntoVerdeContext";
import { Image } from "expo-image";
import { Controller } from "react-hook-form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import * as ImagePicker from "expo-image-picker";

const userSchema = z.object({
    nombre: z.string().nonempty("El nombre es obligatorio").optional(),
    apellido: z.string().nonempty("El apellido es obligatorio").optional(),
    email: z.string().nonempty("El email es obligatorio").email("Correo inválido").optional(),
    fechaDeNacimiento: z.string().nonempty("La fecha de nacimiento es obligatoria") .optional(),
    direccion: z.string().nonempty("La dirección es obligatoria") .optional(),
    fotoPerfil: z.string().nonempty("La foto de perfil es obligatoria").optional(),
});
const colaboradorSchema = z.object({
    cvu: z.string().nonempty("El CVU es obligatorio"),
    domicilioFiscal: z.string().nonempty("El domicilio fiscal es obligatorio"),
    cuitCuil: z.string().nonempty("El CUIL/CUIT es obligatorio"),
});

const puntoVerdeSchema = z.object({
    nombre: z.string().nonempty("El nombre es obligatorio").optional()  , 
    direccion: z.string().nonempty("La dirección es obligatoria").optional(),
    descripcion: z.string().nonempty("La descripción es obligatoria").optional(),
    diasAtencion: z.string().nonempty("Los días de atención son obligatorios").optional(),
    horario: z.string().nonempty("El horario es obligatorio").optional(),
});

export default function UserConfig() {
    const { user, updateUser, updateColaborador } = useUser();
    const { puntosVerdes, actualizarPuntoVerde, eliminarPuntoVerde, isLoading } = usePuntoVerde();
    const [isEditingUser, setIsEditingUser] = useState(false);
    const [showColaborador, setShowColaborador] = useState(false);
    const [puntosVerdesColaborador, setPuntosVerdesColaborador] = useState<any[]>([]);
    const [editingPuntoVerde, setEditingPuntoVerde] = useState<string | null>(null);

    const {
        control,
        handleSubmit,
        formState: { errors },
        setError,
        setValue,
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

    const {
        control: controlPuntoVerde,
        handleSubmit: handleSubmitPuntoVerde,
        formState: { errors: errorsPuntoVerde },
        setValue: setValuePuntoVerde,
        reset: resetPuntoVerde,
    } = useForm({
        resolver: zodResolver(puntoVerdeSchema),
    });

    const onSubmit = async (data: {
        nombre: string | undefined;
        apellido: string | undefined;
        email: string | undefined;
        fechaDeNacimiento: string | undefined;
        direccion: string | undefined;
        fotoPerfil: string | undefined;
    }) => {
        try {
            const userData = {
                nombre: data.nombre || undefined,
                apellido: data.apellido || undefined,
                email: data.email || undefined,
                fechaDeNacimiento: data.fechaDeNacimiento || undefined,
                direccion: data.direccion || undefined,
                fotoPerfil: data.fotoPerfil || undefined,
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
                setValue("fotoPerfil", image);
            }
        } catch (error) {
            console.log(error);
        }
    }

    // Filtrar puntos verdes del colaborador actual
    useEffect(() => {
        if (user?.colaboradorId && puntosVerdes.length > 0) {
            const puntosDelColaborador = puntosVerdes.filter(
                punto => punto.colaboradorId === user.colaboradorId
            );
            setPuntosVerdesColaborador(puntosDelColaborador);
        }
    }, [user?.colaboradorId, puntosVerdes]);

    const iniciarEdicionPuntoVerde = (puntoVerde: any) => {
        setEditingPuntoVerde(puntoVerde.id);
        setValuePuntoVerde("nombre", puntoVerde.nombre || "");
        setValuePuntoVerde("direccion", puntoVerde.direccion || "");
        setValuePuntoVerde("descripcion", puntoVerde.descripcion || "");
        setValuePuntoVerde("diasAtencion", puntoVerde.diasAtencion || "");
        setValuePuntoVerde("horario", puntoVerde.horario || "");
    };

    const cancelarEdicionPuntoVerde = () => {
        setEditingPuntoVerde(null);
        resetPuntoVerde();
    };

    const onSubmitPuntoVerde = async (data: any) => {
        if (!editingPuntoVerde) return;
        
        try {
            await actualizarPuntoVerde(editingPuntoVerde, data);
            Alert.alert("Éxito", "Punto verde actualizado correctamente");
            setEditingPuntoVerde(null);
            resetPuntoVerde();
        } catch (error) {
            Alert.alert("Error", "No se pudo actualizar el punto verde");
        }
    };

    const eliminarPuntoVerdeHandler = (id: string) => {
        Alert.alert(
            "Confirmar eliminación",
            "¿Estás seguro de que quieres eliminar este punto verde?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Eliminar",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await eliminarPuntoVerde(id);
                            Alert.alert("Éxito", "Punto verde eliminado correctamente");
                        } catch (error) {
                            Alert.alert("Error", "No se pudo eliminar el punto verde");
                        }
                    }
                }
            ]
        );
    };

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
                    <Pressable style={styles.imageButton} onPress={() => {uploadImage()}}><Text style={{color: "white"}}>Editar foto de perfil</Text></Pressable>
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
        
                        <Pressable onPress={handleSubmit(onSubmit as any)} style={styles.button}>
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

                        <View style={styles.barra}></View>
                        <Text style={styles.sectionTitle}>Mis Puntos Verdes</Text>
                        
                        {isLoading ? (
                            <Text>Cargando puntos verdes...</Text>
                        ) : puntosVerdesColaborador.length === 0 ? (
                            <Text style={styles.noDataText}>No tienes puntos verdes registrados</Text>
                        ) : (
                            <View style={styles.tableContainer}>
                                {puntosVerdesColaborador.map((punto) => (
                                    <View key={punto.id} style={styles.puntoVerdeRow}>
                                        {editingPuntoVerde === punto.id ? (
                                            // Formulario de edición
                                            <View style={styles.editForm}>
                                                <Controller
                                                    control={controlPuntoVerde}
                                                    name="nombre"
                                                    render={({ field: { onChange, onBlur, value } }) => (
                                                        <View style={styles.inputContainer}>
                                                            <Text>Nombre: </Text>
                                                            <TextInput
                                                                style={styles.input}
                                                                value={value}
                                                                onBlur={onBlur}
                                                                onChangeText={onChange}
                                                            />
                                                        </View>
                                                    )}
                                                />
                                                {errorsPuntoVerde.nombre && <Text style={styles.error}>{errorsPuntoVerde.nombre.message}</Text>}
                                                
                                                <Controller
                                                    control={controlPuntoVerde}
                                                    name="direccion"
                                                    render={({ field: { onChange, onBlur, value } }) => (
                                                        <View style={styles.inputContainer}>
                                                            <Text>Dirección: </Text>
                                                            <TextInput
                                                                style={styles.input}
                                                                value={value}
                                                                onBlur={onBlur}
                                                                onChangeText={onChange}
                                                            />
                                                        </View>
                                                    )}
                                                />
                                                {errorsPuntoVerde.direccion && <Text style={styles.error}>{errorsPuntoVerde.direccion.message}</Text>}
                                                
                                                <Controller
                                                    control={controlPuntoVerde}
                                                    name="descripcion"
                                                    render={({ field: { onChange, onBlur, value } }) => (
                                                        <View style={styles.inputContainer}>
                                                            <Text>Descripción: </Text>
                                                            <TextInput
                                                                style={styles.input}
                                                                value={value}
                                                                onBlur={onBlur}
                                                                onChangeText={onChange}
                                                                multiline
                                                            />
                                                        </View>
                                                    )}
                                                />
                                                {errorsPuntoVerde.descripcion && <Text style={styles.error}>{errorsPuntoVerde.descripcion.message}</Text>}
                                                
                                                <Controller
                                                    control={controlPuntoVerde}
                                                    name="diasAtencion"
                                                    render={({ field: { onChange, onBlur, value } }) => (
                                                        <View style={styles.inputContainer}>
                                                            <Text>Días: </Text>
                                                            <TextInput
                                                                style={styles.input}
                                                                value={value}
                                                                onBlur={onBlur}
                                                                onChangeText={onChange}
                                                                placeholder="Ej: Lunes a Viernes"
                                                            />
                                                        </View>
                                                    )}
                                                />
                                                {errorsPuntoVerde.diasAtencion && <Text style={styles.error}>{errorsPuntoVerde.diasAtencion.message}</Text>}
                                                
                                                <Controller
                                                    control={controlPuntoVerde}
                                                    name="horario"
                                                    render={({ field: { onChange, onBlur, value } }) => (
                                                        <View style={styles.inputContainer}>
                                                            <Text>Horario: </Text>
                                                            <TextInput
                                                                style={styles.input}
                                                                value={value}
                                                                onBlur={onBlur}
                                                                onChangeText={onChange}
                                                                placeholder="Ej: 9:00 - 18:00"
                                                            />
                                                        </View>
                                                    )}
                                                />
                                                {errorsPuntoVerde.horario && <Text style={styles.error}>{errorsPuntoVerde.horario.message}</Text>}
                                                
                                                <View style={styles.editActions}>
                                                    <Pressable onPress={handleSubmitPuntoVerde(onSubmitPuntoVerde)} style={styles.saveButton}>
                                                        <Text style={styles.buttonText}>Guardar</Text>
                                                    </Pressable>
                                                    <Pressable onPress={cancelarEdicionPuntoVerde} style={styles.cancelButton}>
                                                        <Text style={styles.cancelButtonText}>Cancelar</Text>
                                                    </Pressable>
                                                </View>
                                            </View>
                                        ) : (
                                            // Vista de solo lectura
                                            <View style={styles.puntoVerdeInfo}>
                                                <View style={styles.puntoVerdeHeader}>
                                                    <Text style={styles.puntoVerdeNombre}>{punto.nombre}</Text>
                                                    <View style={styles.puntoVerdeActions}>
                                                        <Pressable 
                                                            onPress={() => iniciarEdicionPuntoVerde(punto)}
                                                            style={styles.editPuntoVerdeButton}
                                                        >
                                                            <Text style={styles.editPuntoVerdeButtonText}>Editar</Text>
                                                        </Pressable>
                                                        <Pressable 
                                                            onPress={() => eliminarPuntoVerdeHandler(punto.id)}
                                                            style={styles.deletePuntoVerdeButton}
                                                        >
                                                            <Text style={styles.deletePuntoVerdeButtonText}>Eliminar</Text>
                                                        </Pressable>
                                                    </View>
                                                </View>
                                                <View style={styles.puntoVerdeDetails}>
                                                    <Text style={styles.puntoVerdeLabel}>Dirección: <Text style={styles.puntoVerdeValue}>{punto.direccion}</Text></Text>
                                                    <Text style={styles.puntoVerdeLabel}>Descripción: <Text style={styles.puntoVerdeValue}>{punto.descripcion}</Text></Text>
                                                    <Text style={styles.puntoVerdeLabel}>Días: <Text style={styles.puntoVerdeValue}>{punto.diasAtencion}</Text></Text>
                                                    <Text style={styles.puntoVerdeLabel}>Horario: <Text style={styles.puntoVerdeValue}>{punto.horario}</Text></Text>
                                                </View>
                                            </View>
                                        )}
                                    </View>
                                ))}
                            </View>
                        )}
                        
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
    imageButton: {
        backgroundColor: "green",
        padding: 10,
        borderRadius: 5,
        width: "50%",
        alignSelf: "flex-start",
        justifyContent: "center",
        alignItems: "center",
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
    barra: {
        height: 1,
        backgroundColor: "gray",
        marginVertical: 10,
    },
    tableContainer: {
        padding: 10,
        borderWidth: 1,
        borderColor: "gray",
        borderRadius: 5,
    },
    noDataText: {
        textAlign: "center",
        color: "gray",
        fontStyle: "italic",
        marginVertical: 20,
    },
    puntoVerdeRow: {
        borderWidth: 1,
        borderColor: "#e0e0e0",
        borderRadius: 8,
        marginBottom: 15,
        padding: 15,
        backgroundColor: "#f9f9f9",
    },
    editForm: {
        gap: 10,
    },
    editActions: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 15,
    },
    saveButton: {
        backgroundColor: "green",
        padding: 10,
        borderRadius: 5,
        flex: 1,
        marginRight: 10,
        alignItems: "center",
    },
    cancelButton: {
        backgroundColor: "gray",
        padding: 10,
        borderRadius: 5,
        flex: 1,
        alignItems: "center",
    },
    cancelButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
    puntoVerdeInfo: {
        gap: 10,
    },
    puntoVerdeHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
    },
    puntoVerdeNombre: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#2c5aa0",
        flex: 1,
    },
    puntoVerdeActions: {
        flexDirection: "row",
        gap: 10,
    },
    editPuntoVerdeButton: {
        backgroundColor: "#2c5aa0",
        padding: 8,
        borderRadius: 5,
        minWidth: 60,
        alignItems: "center",
    },
    editPuntoVerdeButtonText: {
        color: "white",
        fontSize: 12,
        fontWeight: "bold",
    },
    deletePuntoVerdeButton: {
        backgroundColor: "#d32f2f",
        padding: 8,
        borderRadius: 5,
        minWidth: 60,
        alignItems: "center",
    },
    deletePuntoVerdeButtonText: {
        color: "white",
        fontSize: 12,
        fontWeight: "bold",
    },
    puntoVerdeDetails: {
        gap: 5,
    },
    puntoVerdeLabel: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#333",
    },
    puntoVerdeValue: {
        fontWeight: "normal",
        color: "#666",
    },
});