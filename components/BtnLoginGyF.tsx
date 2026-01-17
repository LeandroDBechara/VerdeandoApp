import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useEffect, useCallback } from "react";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import * as Facebook from "expo-auth-session/providers/facebook";
import { makeRedirectUri } from "expo-auth-session";
import Constants from "expo-constants";

WebBrowser.maybeCompleteAuthSession();

export function BtnLoginGyF() {
  // Obtener el scheme del app.json
  const schemeValue = Constants.expoConfig?.scheme;
  const scheme = typeof schemeValue === "string" 
    ? schemeValue 
    : Array.isArray(schemeValue) 
    ? schemeValue[0] 
    : "fb674819048296621";
  
  // Configuración de Google Auth
  const googleWebClientId = process.env.EXPO_PUBLIC_WEB_CLIENT;
  const googleAndroidClientId = process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT;
  const googleIosClientId = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT;
  
  const [requestGoogle, responseGoogle, promptAsyncGoogle] = Google.useAuthRequest({
    webClientId: googleWebClientId,
    androidClientId: googleAndroidClientId,
    iosClientId: googleIosClientId,
    scopes: ["openid", "profile", "email"],
    redirectUri: makeRedirectUri({
      scheme: scheme,
    }),
  });

  // Configuración de Facebook Auth
  const facebookAndroidClientId = process.env.EXPO_PUBLIC_FACEBOOK_ANDROID_CLIENT;
  const facebookIosClientId = process.env.EXPO_PUBLIC_FACEBOOK_IOS_CLIENT;
  const hasFacebookConfig = !!(facebookAndroidClientId || facebookIosClientId);
  
  // Configuración condicional de Facebook
  const facebookConfig = hasFacebookConfig
    ? {
        ...(facebookAndroidClientId && { androidClientId: facebookAndroidClientId }),
        ...(facebookIosClientId && { iosClientId: facebookIosClientId }),
        redirectUri: makeRedirectUri({
          scheme: scheme,
        }),
      }
    : {
        androidClientId: "0000000000000000",
        iosClientId: "0000000000000000",
        redirectUri: makeRedirectUri({
          scheme: scheme,
        }),
      };
  
  const [requestFacebook, responseFacebook, promptAsyncFacebook] = Facebook.useAuthRequest(facebookConfig);

  const enviarTokenGoogle = useCallback(async (token: string) => {
    try {
      console.log("Token de Google:", token);
      const response = await fetch("https://www.googleapis.com/userinfo/v2/me", {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error(`Error al obtener datos de Google: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Datos del usuario Google:", data);
      router.replace("/(tabs)");
    } catch (error) {
      console.error("Error al enviar token de Google:", error);
    }
  }, []);

  const enviarTokenFacebook = useCallback(async (token: string) => {
    try {
      console.log("Token de Facebook:", token);
      const response = await fetch(`https://graph.facebook.com/me?access_token=${token}&fields=id,name,email`);
      
      if (!response.ok) {
        throw new Error(`Error al obtener datos de Facebook: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Datos del usuario Facebook:", data);
      router.replace("/(tabs)");
    } catch (error) {
      console.error("Error al enviar token de Facebook:", error);
    }
  }, []);

  // Manejar respuesta de Google
  useEffect(() => {
    if (responseGoogle?.type === "success" && responseGoogle.authentication?.accessToken) {
      const token = responseGoogle.authentication.accessToken;
      enviarTokenGoogle(token);
    } else if (responseGoogle?.type === "error") {
      console.error("Error en autenticación de Google:", responseGoogle.error);
    }
  }, [responseGoogle, enviarTokenGoogle]);

  // Manejar respuesta de Facebook
  useEffect(() => {
    if (responseFacebook?.type === "success" && responseFacebook.authentication?.accessToken) {
      const token = responseFacebook.authentication.accessToken;
      enviarTokenFacebook(token);
    } else if (responseFacebook?.type === "error") {
      console.error("Error en autenticación de Facebook:", responseFacebook.error);
    }
  }, [responseFacebook, enviarTokenFacebook]);

  // Verificar si hay configuración válida para mostrar los botones
  const hasGoogleConfig = !!(googleWebClientId || googleAndroidClientId || googleIosClientId);

  return (
    <View style={{ flexDirection: "column", gap: 10 }}>
      {hasGoogleConfig && (
        <Pressable 
          style={styles.BtnLoginGyF}
          onPress={() => {
            promptAsyncGoogle().catch((e) => {
              console.error("Error al iniciar sesión con Google:", e);
            });
          }}
        >
          <Image style={{marginRight: 15}} source={require("@/assets/images/google-logo.png")} />
          <Text>Iniciar sesión con Google</Text>
        </Pressable>
      )}
      {hasFacebookConfig && (
        <Pressable 
          style={styles.BtnLoginGyF} 
          onPress={() => {
            promptAsyncFacebook().catch((e) => {
              console.error("Error al iniciar sesión con Facebook:", e);
            });
          }}
        >
          <Image source={require("@/assets/images/facebook-logo.png")} />
          <Text>Iniciar sesión con Facebook</Text>
        </Pressable>
      )}
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
