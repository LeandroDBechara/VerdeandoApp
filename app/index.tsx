import Login from "./login";
import Camerascreen from "@/components/Camera";
import Mapa from "@/components/Mapa";
import { StatusBar, Text, View } from "react-native";
import Constants from "expo-constants";
import Onboarding from "./onboarding";
import React from "react";
import PuntosVerdes from "./(tabs)/puntosverdes";
import BarGraph from "@/components/estadisticas/BarGraph";
import Cuponera from "./(tabs)/cuponera";
import Home from "./(tabs)/index";
import { EventoProvider } from "@/contexts/EventoContext";
import { UserProvider } from "@/contexts/UserContext";

export default function Index() {
  return (
    <UserProvider>  
     <Login />
    </UserProvider>
  );
}
