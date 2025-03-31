import { useEffect, useRef, useState } from 'react';
import { Button, Image, StatusBar, StyleSheet, Text, View } from 'react-native';
import { CameraView, CameraType, useCameraPermissions,FlashMode,Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import CameraBtn from './CameraBtn';


export default function Camerascreen() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [image, setImage] = useState(null);
  const [flash, setFlash] = useState<FlashMode>('off');
  const cameraRef= useRef(null);

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
        <Button onPress={() => {requestPermission(), MediaLibrary.requestPermissionsAsync()}} title="grant permission" />
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
  }
  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  const saveImage = async () => {
    if (image) {
      try {
        await MediaLibrary.createAssetAsync(image);
        alert('Image saved successfully');
        setImage(null);
      }catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent={true} backgroundColor={"black"}/>
        {!image ?
      <CameraView style={styles.camera} facing={facing} flash={flash} ref={cameraRef} autofocus='on' >
        <View style={styles.topcamera}>
        <CameraBtn onPress={toggleCameraFacing} icon="camera-rotate" color="white" />
        <CameraBtn color={flash === 'on' ? 'white' : 'gray'} onPress={() => setFlash(flash === 'off' ? 'on' : 'off')} icon="bolt" />
        </View>
      </CameraView>
      : <Image source={{uri:image}} style={styles.camera} />
        }
        <View style={{backgroundColor:'transparent'}}>
        {image ?
        <View style={styles.imagenbtn}>

        <CameraBtn onPress={() => setImage(null)} icon="rotate-left" title="re-take" color="white" />
        <CameraBtn onPress={saveImage} icon="check" title="Guardar" color="white" />
        </View> 
          : <View style={styles.bottomcamera}>
        <CameraBtn  onPress={takePicture} icon="camera" color="white" />
        </View>
}
        </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'black',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  topcamera: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 30,
  },
  bottomcamera: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingLeft: 30,
    paddingRight: 30,
    paddingBottom: 20,
  },
  imagenbtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 30,
    paddingRight: 30,
    paddingBottom: 20,
  }
});