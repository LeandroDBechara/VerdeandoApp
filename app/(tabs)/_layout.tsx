import { Platform, View, TouchableOpacity, Image, Modal, Text, StyleSheet } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Stack, Tabs } from "expo-router";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useRouter } from "expo-router";
import { useState } from "react";
import { useUser } from "@/contexts/UserContext";

const Drawer = createDrawerNavigator();

export default function TabLayout() {
  const router = useRouter();
  const [menuVisible, setMenuVisible] = useState(false);
  const { logout, user } = useUser();
  const renderHeaderLeft = () => (
    <TouchableOpacity 
      onPress={() => router.back()}
      style={{ marginLeft: 16, marginRight: 5 }}
    >
      <FontAwesome6 name="arrow-left" size={20} color="green" />
    </TouchableOpacity>
  );

  const renderHeaderRight = () => (
    <TouchableOpacity 
      onPress={() => setMenuVisible(true)}
      style={{ marginRight: 16 }}
    >
      <Image
        source={user?.fotoPerfil ? { uri: user.fotoPerfil } : require('../../assets/images/perfil.png')} 
        style={{
          width: 32,
          height: 32,
          borderRadius: 16,
        }}
      />
    </TouchableOpacity>
  );

  const handleConfiguracion = () => {
    setMenuVisible(false);
    // Navegar a la pantalla de configuración
    router.push('/userconfig');
  };

  const handleCerrarSesion = () => {
    setMenuVisible(false);
    // Aquí puedes agregar la lógica para cerrar sesión
    console.log("Cerrando sesión...");
    // Navegar a la pantalla de login
    logout();
  };

  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          headerShown: true,
          tabBarActiveTintColor: "green",
          tabBarInactiveTintColor: "lightgray",
          tabBarActiveBackgroundColor: "lightgreen",
          headerLeft: renderHeaderLeft,
          headerRight: renderHeaderRight,
          headerStyle: {
            backgroundColor: 'white',
            height: 92,
          },
          headerTitleStyle: {
            color: 'green',
            fontWeight: 'bold',
          },
          tabBarLabelStyle:{
            fontSize: 9.9,
            fontWeight: "bold",
          },
          tabBarStyle: Platform.select({
            ios: {
              position: "absolute",
            },
            default: {
              position: "absolute",
              borderTopWidth: 1,
              borderTopColor: "lightgray",
              height: 60,
              paddingBottom: 0,
            },
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
          name="intercambios"
          options={{
            title: "Intercambios",
            tabBarIcon: ({ color }) => <FontAwesome6 name="arrows-rotate" size={24} color={color} />,
            tabBarLabel: "Intercambios",
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

      {/* Modal del menú */}
      <Modal
        visible={menuVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setMenuVisible(false)}
        >
          <View style={styles.menuContainer}>
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={handleConfiguracion}
            >
              <FontAwesome6 name="gear" size={20} color="green" />
              <Text style={styles.menuText}>Configuración</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={handleCerrarSesion}
            >
              <FontAwesome6 name="sign-out-alt" size={20} color="red" />
              <Text style={[styles.menuText, { color: 'red' }]}>Cerrar Sesión</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 100,
    paddingRight: 16,
  },
  menuContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 8,
    minWidth: 150,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  menuText: {
    marginLeft: 12,
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
});
