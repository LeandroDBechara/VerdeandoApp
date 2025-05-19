import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useEffect } from "react";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import * as Facebook from "expo-auth-session/providers/facebook";


WebBrowser.maybeCompleteAuthSession();
export  function BtnLoginGyF() {
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: process.env.EXPO_PUBLIC_WEB_CLIENT,
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT,
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT,
    
  });

  const enviarToken = async (token:string) => {
    console.log(token);
    router.replace("/(tabs)");
  }

  useEffect(() => {
    if (response?.type === "success") {
      enviarToken(response.authentication?.idToken || "");
    }
  }, [response]);


  return (
    <View style={{ flexDirection: "column", gap: 10 }}>
      <Pressable 
      style={styles.BtnLoginGyF}
      onPress={() => promptAsync().catch((e) => {console.log("Error al inicialr sesion")})}>
        <Image style={{marginRight: 15}} source={require("@/assets/images/google-logo.png")} />
        <Text>Iniciar sesión con Google</Text>
      </Pressable>
      <Pressable style={styles.BtnLoginGyF}>
        <Image source={require("@/assets/images/facebook-logo.png")} />
        <Text>Iniciar sesión con Facebook</Text>
      </Pressable>
    </View>
  );
}
export const styles = StyleSheet.create({
  BtnLoginGyF: {
    flexDirection: "row",
    gap: 10,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    borderColor: "#D9D9D9",
    borderWidth: 1,
    width: 300,
    paddingVertical: 11,
  },
});
