import { useFonts } from "expo-font";
import { router, SplashScreen, Stack, usePathname } from "expo-router";
import { useEffect, useState } from "react";
import { Image, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";
import { UserProvider, useUser } from "@/contexts/UserContext";
import { PuntoVerdeProvider } from "@/contexts/PuntoVerdeContext";
import { IntercambiosProvider } from "@/contexts/IntercambiosContext";
import { EventoProvider } from "@/contexts/EventoContext";
import { RecompensaProvider } from "@/contexts/RecompensaContext";
import { FontAwesome6 } from "@expo/vector-icons";

function RootLayoutNav() {
  const insets = useSafeAreaInsets();
  const { user, logout } = useUser();
  const [menuVisible, setMenuVisible] = useState(false);
  const pathname = usePathname(); 
  
  useEffect(() => {
    if (!user) {
      router.replace("/login");
    }
  }, [user]);

  const renderHeaderLeft = () => (

    <TouchableOpacity 
    onPress={() => router.back()}
    style={{ marginRight: 5 }}
  >
    <FontAwesome6 name="arrow-left" size={20} color="green" />
  </TouchableOpacity>
  )
  

  const renderHeaderRight = () => (
    <TouchableOpacity 
      onPress={() => setMenuVisible(true)}
      style={{ marginRight: 16 }}
    >
      <Image
        source={user?.fotoPerfil ? { uri: user.fotoPerfil } : require('../assets/images/perfil.png')} 
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
    router.push('/userconfig');
  };

  const handleCerrarSesion = () => {
    setMenuVisible(false);
    console.log("Cerrando sesión...");
    logout();
  };

  return (
    <View style={{ flex: 1, paddingBottom: insets.bottom }}>   
      <Stack screenOptions={{
        headerLeft: renderHeaderLeft,
        headerRight: renderHeaderRight,
        headerStyle: {
          backgroundColor: 'white'
        },
        headerTitleStyle: {
          color: 'green',
          fontWeight: 'bold',
        },
      }}>  
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="register" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="userconfig" options={{ headerShown: true, title: "Configuración" }} />
        <Stack.Screen name="recuperar" options={{ headerShown: false }} />
      </Stack>
      
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

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <UserProvider>
        <PuntoVerdeProvider>
          <IntercambiosProvider>
            <EventoProvider>
              <RecompensaProvider>
                <RootLayoutNav />
              </RecompensaProvider>
            </EventoProvider>
          </IntercambiosProvider>
        </PuntoVerdeProvider>
      </UserProvider>
    </SafeAreaProvider>
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
