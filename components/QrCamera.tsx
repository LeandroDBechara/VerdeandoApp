import React, { useState, useRef, useEffect } from 'react';
import { CameraView, CameraType, useCameraPermissions, Camera } from "expo-camera";
import { View, Text, StatusBar, StyleSheet, Alert, TouchableOpacity, ActivityIndicator } from "react-native";
import { useIntercambios } from '@/contexts/IntercambiosContext';
import { useUser } from '@/contexts/UserContext';
import { router } from 'expo-router';

export default function QrCamera() {
    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const { confirmarIntercambio } = useIntercambios();
    const { user } = useUser();
    const cameraRef = useRef<CameraView>(null);

    // Verificar si el usuario es colaborador
    const esColaborador = user?.rol === 'COLABORADOR' ? true : false;

  

    useEffect(() => {
        if (!esColaborador) {
            Alert.alert(
                "Acceso Restringido",
                "Solo los colaboradores pueden confirmar intercambios mediante códigos QR.",
                [
                    {
                        text: "Entendido",
                        onPress: () => router.back()
                    }
                ]
            );
        }
    }, [esColaborador]);

    const handleBarCodeScanned = async ({ type, data }: { type: string; data: string }) => {
        if (scanned || isProcessing) return;
        
        setScanned(true);
        setIsProcessing(true);

        try {
            // Validar que el código QR contenga un token válido
            if (!data || data.trim().length === 0) {
                throw new Error("Código QR inválido");
            }

            console.log("Código QR escaneado:", data);
            
            // Confirmar el intercambio usando el token del QR
            await confirmarIntercambio(data);
            
            Alert.alert(
                "¡Intercambio Confirmado!",
                "El intercambio ha sido confirmado exitosamente.",
                [
                    {
                        text: "Continuar",
                        onPress: () => {
                            setScanned(false);
                            setIsProcessing(false);
                            router.back();
                        }
                    }
                ]
            );
            
        } catch (error) {
            console.error("Error al confirmar intercambio:", error);
            
            const errorMessage = error instanceof Error ? error.message : "Error desconocido";
            
            Alert.alert(
                "Error al Confirmar",
                errorMessage,
                [
                    {
                        text: "Reintentar",
                        onPress: () => {
                            setScanned(false);
                            setIsProcessing(false);
                        }
                    },
                    {
                        text: "Cancelar",
                        onPress: () => router.back(),
                        style: "cancel"
                    }
                ]
            );
        }
    };

    const resetScanner = () => {
        setScanned(false);
        setIsProcessing(false);
    };

    if (!permission) {
        return (
            <View style={styles.container}>
                <Text style={styles.message}>Cargando permisos de cámara...</Text>
            </View>
        );
    }

    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <Text style={styles.message}>Necesitamos acceso a la cámara para escanear códigos QR</Text>
                <TouchableOpacity style={styles.button} onPress={requestPermission}>
                    <Text style={styles.buttonText}>Conceder Permisos</Text>
                </TouchableOpacity>
            </View>
        );
    }

    if (!esColaborador) {
        return (
            <View style={styles.container}>
                <Text style={styles.message}>Solo los colaboradores pueden usar esta función</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar translucent={true} backgroundColor={"black"} />
            <View style={styles.cameraContainer}>
                <CameraView
                    ref={cameraRef}
                    style={styles.camera}
                    facing={"back"}
                    onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                    barcodeScannerSettings={{
                        barcodeTypes: ["qr"],
                    }}
                />
                
                {/* Overlay con instrucciones */}
                <View style={styles.overlay}>
                    <View style={styles.instructionContainer}>
                        <Text style={styles.instructionText}>
                            Apunta la cámara al código QR del intercambio
                        </Text>
                    </View>
                    
                    {/* Marco de escaneo */}
                    <View style={styles.scanFrame} />
                    
                    {isProcessing && (
                        <View style={styles.processingContainer}>
                            <ActivityIndicator size="large" color="#4CAF50" />
                            <Text style={styles.processingText}>Procesando...</Text>
                        </View>
                    )}
                </View>
                
                {/* Botones de acción */}
                <View style={styles.buttonContainer}>
                    <TouchableOpacity 
                        style={[styles.actionButton, styles.resetButton]} 
                        onPress={resetScanner}
                        disabled={isProcessing}
                    >
                        <Text style={styles.actionButtonText}>Escanear Otro</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                        style={[styles.actionButton, styles.cancelButton]} 
                        onPress={() => router.back()}
                        disabled={isProcessing}
                    >
                        <Text style={styles.actionButtonText}>Cancelar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "black",
    },
    cameraContainer: {
        flex: 1,
        position: "relative",
        width: "100%",
    },
    camera: {
        flex: 1,
    },
    overlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: "center",
        alignItems: "center",
    },
    instructionContainer: {
        position: "absolute",
        top: 100,
        left: 20,
        right: 20,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        padding: 15,
        borderRadius: 10,
    },
    instructionText: {
        color: "white",
        fontSize: 16,
        textAlign: "center",
        fontWeight: "500",
    },
    scanFrame: {
        width: 250,
        height: 250,
        borderWidth: 2,
        borderColor: "#4CAF50",
        backgroundColor: "transparent",
        borderRadius: 10,
    },
    processingContainer: {
        position: "absolute",
        bottom: 200,
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 20,
        borderRadius: 10,
    },
    processingText: {
        color: "white",
        fontSize: 16,
        marginTop: 10,
        fontWeight: "500",
    },
    buttonContainer: {
        position: "absolute",
        bottom: 50,
        left: 20,
        right: 20,
        flexDirection: "row",
        justifyContent: "space-around",
    },
    actionButton: {
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 25,
        minWidth: 120,
        alignItems: "center",
    },
    resetButton: {
        backgroundColor: "#4CAF50",
    },
    cancelButton: {
        backgroundColor: "#f44336",
    },
    actionButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "600",
    },
    message: {
        color: "white",
        fontSize: 18,
        textAlign: "center",
        marginBottom: 20,
    },
    button: {
        backgroundColor: "#4CAF50",
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 25,
    },
    buttonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "600",
    },
});
