import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useEffect, useState } from "react";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import * as Facebook from "expo-auth-session/providers/facebook";


WebBrowser.maybeCompleteAuthSession();
export  function BtnLoginGyF() {
  const[accessToken, setAccessToken] = useState<string>("");
  const [requestGoogle, responseGoogle, promptAsyncGoogle] = Google.useAuthRequest({
    clientId: process.env.EXPO_PUBLIC_WEB_CLIENT,
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT,
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT,
  });
  const [requestFacebook, responseFacebook, promptAsyncFacebook] = Facebook.useAuthRequest({
    clientId: process.env.EXPO_PUBLIC_FACEBOOK_CLIENT,
  });
  
  useEffect(() => {
    if (responseGoogle?.type === "success") {
      setAccessToken(responseGoogle.authentication?.accessToken || "");
      accessToken && enviarTokenGoogle();
    }
    if (responseFacebook && responseFacebook?.type === "success" && responseFacebook.authentication) {
      setAccessToken(responseFacebook.authentication?.accessToken || "");
      accessToken && enviarTokenFacebook();
    }
  }, [responseGoogle, accessToken, responseFacebook]);

  const enviarTokenGoogle = async () => {
    console.log(accessToken);
    const response = await fetch("https://www.googleapis.com/userinfo/v2/me", {
      headers: {
        "Authorization": `Bearer ${accessToken}`,
      },
    });
    const data = await response.json();
    console.log("datos del usuario google: ", data);
    router.replace("/(tabs)");
  }

  const enviarTokenFacebook = async () => {
    console.log(accessToken);
    const response = await fetch(`https://graph.facebook.com/me?access_token=${accessToken}`);//&fields=id,name,email
    const data = await response.json();
    console.log("datos del usuario facebook: ", data);
    router.replace("/(tabs)");
  }

  return (
    <View style={{ flexDirection: "column", gap: 10 }}>
      <Pressable 
      style={styles.BtnLoginGyF}
      onPress={() => promptAsyncGoogle().catch((e) => {console.log("Error al inicialr sesion")})}>
        <Image style={{marginRight: 15}} source={require("@/assets/images/google-logo.png")} />
        <Text>Iniciar sesión con Google</Text>
      </Pressable>
      <Pressable style={styles.BtnLoginGyF} onPress={() => promptAsyncFacebook().catch((e) => {console.log("Error al inicialr sesion")})}>
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
