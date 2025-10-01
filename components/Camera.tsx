import { useEffect, useRef, useState } from "react";
import { Button, Image, StatusBar, StyleSheet, Text, View, ActivityIndicator } from "react-native";
import { CameraView, CameraType, useCameraPermissions, FlashMode, Camera } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import CameraBtn from "@/components/CameraBtn";
import { useUser } from "@/contexts/UserContext";
import { useIntercambios } from "@/contexts/IntercambiosContext";
import { router } from "expo-router";
export default function CameraScreen() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [image, setImage] = useState(null);
  const [flash, setFlash] = useState<FlashMode>("off");
  const [isLoading, setIsLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const cameraRef = useRef(null);
  const { user } = useUser();
  const {confirmarIntercambio} = useIntercambios();
  
  useEffect(() => {
    (async () => {
      const libraryStatus = await MediaLibrary.requestPermissionsAsync();
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
    })();
  }, []);

  if (!permission) {
    // Camera permissions are still loading.
    return <Text>Requesting permissions...</Text>;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button
          onPress={() => {
            requestPermission(), MediaLibrary.requestPermissionsAsync();
          }}
          title="grant permission"
        />
      </View>
    );
  }
  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const data = await (cameraRef.current as any).takePictureAsync();
        console.log(data.uri);
        setImage(data.uri);
      } catch (error) {
        console.log(error);
      }
    }
  };
  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  const saveImage = async () => {
    if (image) {
      try {
        await MediaLibrary.createAssetAsync(image);
        alert("Image saved successfully");
        setImage(null);
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent={true} backgroundColor={"black"} />
      {!image ? (
        <View style={styles.cameraContainer}>
          <CameraView style={styles.camera} facing={facing} flash={flash} ref={cameraRef} autofocus="on" onBarcodeScanned={async ({data})=>{
    
            if (user?.rol === "COLABORADOR"){
              try {
                setIsLoading(true);
                await confirmarIntercambio(data);
                console.log("data",data); 
                setResponseMessage("Intercambio confirmado exitosamente");
                setTimeout(() => {
                  router.replace("/(tabs)/intercambios");
                }, 2000);
              } catch (error) {
                setResponseMessage("Error al confirmar el intercambio");
              } finally {
                setIsLoading(false);
                router.replace("/(tabs)/intercambios");
              }
            }
            
          }} />
          
          {isLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="white" />
              <Text style={styles.loadingText}>Procesando...</Text>
            </View>
          )}
          {responseMessage && (
            <View style={styles.messageContainer}>
              <Text style={styles.messageText}>{responseMessage}</Text>
            </View>
          )}
          <View style={styles.topcamera}>
            <CameraBtn onPress={() => router.back()} icon="xmark" color="white" />
            <View style={styles.topRightButtons}>
              <CameraBtn onPress={toggleCameraFacing} icon="camera-rotate" color="white" />
              <CameraBtn
                color={flash === "on" ? "white" : "gray"}
                onPress={() => setFlash(flash === "off" ? "on" : "off")}
                icon="bolt"
              />
            </View>
          </View>
        </View>
      ) : (
        <Image source={{ uri: image }} style={styles.camera} />
      )}
      <View style={{ backgroundColor: "transparent" }}>
        {image ? (
          <View style={styles.imagenbtn}>
            <CameraBtn onPress={() => setImage(null)} icon="rotate-left" title="re-take" color="white" />
            <CameraBtn onPress={saveImage} icon="check" title="Guardar" color="white" />
          </View>
        ) : (
          <View style={styles.bottomcamera}>
            <CameraBtn onPress={takePicture} icon="camera" color="white" />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "black",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  cameraContainer: {
    flex: 1,
    position: 'relative',
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  topcamera: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 30,
    zIndex: 1,
  },
  topRightButtons: {
    flexDirection: "row",
    gap: 10,
  },
  bottomcamera: {
    flexDirection: "row",
    justifyContent: "center",
    paddingLeft: 30,
    paddingRight: 30,
    paddingBottom: 20,
  },
  imagenbtn: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 30,
    paddingRight: 30,
    paddingBottom: 20,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  loadingText: {
    color: 'white',
    marginTop: 10,
    fontSize: 16,
  },
  messageContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  messageText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    padding: 20,
  },
});
