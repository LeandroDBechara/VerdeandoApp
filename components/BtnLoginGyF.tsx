import { Image, Pressable, View } from "react-native";
import { styles } from "@/constants/styles";
import { useEffect } from "react";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import * as Facebook from "expo-auth-session/providers/facebook";

WebBrowser.maybeCompleteAuthSession();
export  function BtnLoginGyF() {
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: "28107125236-a44i9skkavnk850o5tob3s06i9ho7du4.apps.googleusercontent.com",
    androidClientId: "28107125236-nv28u87rggjsak70n5kfdh7tmnarlkh7.apps.googleusercontent.com",
    iosClientId: "28107125236-kv7f25she2vkoc6u3mdpd3am4tijji63.apps.googleusercontent.com",
    
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
