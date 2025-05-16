import { Image, Pressable, Text, View } from "react-native";
import { styles } from "@/constants/styles";
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
    router.replace("/tabs");
  }

  useEffect(() => {
    if (response?.type === "success") {
      enviarToken(response.authentication?.idToken || "");
    }
  }, [response]);


  return (
    <View style={{ flexDirection: "row", gap: 10 }}>
      <Pressable 
      style={styles.BtnLoginGyF}
      onPress={() => promptAsync().catch((e) => {console.log("Error al inicialr sesion")})}>
        <Image source={require("@/assets/images/google-logo.png")} />
      </Pressable>
      <Pressable style={styles.BtnLoginGyF}>
        <Image source={require("@/assets/images/facebook-logo.png")} />
      </Pressable>
    </View>
  );
}
