import Login from "./login";
import Camera from "@/components/Camera";
import Mapa from "@/components/Mapa";
import { Text, View } from "react-native";
import Constants from "expo-constants";
import Estadisticas from "./tabs/estadisticas";
import Onboarding from "./onboarding";

export default function Index() {
  return (
    <>  
      <Login />
    </>
  );
}
