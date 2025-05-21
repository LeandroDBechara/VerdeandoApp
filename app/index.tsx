import Login from "./login";
import Camera from "@/components/Camera";
import Mapa from "@/components/Mapa";
import { StatusBar, Text, View } from "react-native";
import Constants from "expo-constants";
import Onboarding from "./onboarding";
import React from "react";
import PuntosVerdes from "./(tabs)/puntosverdes";
import BarGraph from "@/components/estadisticas/BarGraph";

export default function Index() {
  return (
    <>  
     <Onboarding />
    </>
  );
}
