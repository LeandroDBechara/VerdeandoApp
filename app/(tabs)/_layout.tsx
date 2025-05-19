import { Platform, View } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Tabs } from "expo-router";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

const Drawer = createDrawerNavigator();

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "green",
        tabBarInactiveTintColor: "lightgray",
        tabBarActiveBackgroundColor: "lightgreen",

        tabBarStyle: Platform.select({
          ios: {
            position: "absolute",
          },
          default: {
            position: "absolute",
            borderTopWidth: 1,
            borderTopColor: "lightgray",
          }
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <FontAwesome6 name="house" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="puntosverdes"
        options={{
          title: "Puntos Verdes",
          tabBarIcon: ({ color }) => <FontAwesome6 name="location-dot" size={24} color={color} />,
          tabBarLabel: "Puntos Verdes",
        }}
      />
      <Tabs.Screen
        name="intercambio"
        options={{
          title: "Intercambio",
          tabBarIcon: ({ color }) => <FontAwesome6 name="arrows-rotate" size={24} color={color} />,
          tabBarLabel: "Intercambio",
        }}
      />
            <Tabs.Screen
        name="cuponera"
        options={{
          title: "Cuponera",
          tabBarIcon: ({ color }) => <FontAwesome6 name="tag" size={24} color={color} />,
          tabBarLabel: "Cuponera",
        }}
      />
            <Tabs.Screen
        name="comunidad"
        options={{
          title: "Comunidad",
          tabBarIcon: ({ color }) => <FontAwesome6 name="user-group" size={24} color={color} />,
          tabBarLabel: "Comunidad",
        }}
      />
    </Tabs>
  );
}
