import { useFonts } from "expo-font";
import { router, SplashScreen, Stack, usePathname } from "expo-router";
import { useEffect, useState } from "react";
import { Image, Linking, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";
import { UserProvider, useUser } from "@/contexts/UserContext";
import { PuntoVerdeProvider } from "@/contexts/PuntoVerdeContext";
import { IntercambiosProvider } from "@/contexts/IntercambiosContext";
import { EventoProvider } from "@/contexts/EventoContext";
import { RecompensaProvider } from "@/contexts/RecompensaContext";
import { FontAwesome6 } from "@expo/vector-icons";
import { NewsletterProvider } from "@/contexts/NewsletterContext";
import { LeaderboardsProvider } from "@/contexts/LeaderboardsContext";

const EMAIL_COLABORAR = "verdeando.dodogames@gmail.com";
const ALIAS_DONACION = "verdeando.donar"; // Reemplazar por el alias real si aplica

function RootLayoutNav() {
  const insets = useSafeAreaInsets();
  const { user, logout } = useUser();
  const [menuVisible, setMenuVisible] = useState(false);
  const [colaborarModalVisible, setColaborarModalVisible] = useState(false);
  const pathname = usePathname(); 
  

  const renderHeaderLeft = () => (

    <TouchableOpacity 
    onPress={() => router.back()}
    style={{ marginRight: 5 }}
  >
    <FontAwesome6 name="arrow-left" size={20} color="green" />
  </TouchableOpacity>
  )
  

  const renderHeaderRight = () => (
    <View style={styles.headerRight}>
      <TouchableOpacity 
        onPress={() => setColaborarModalVisible(true)}
        style={styles.colaborarButton}
        activeOpacity={0.85}
      >
        <View style={styles.colaborarButtonShine} />
        <Text style={styles.colaborarButtonText}>Colaborá con Nosotros!</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        onPress={() => setMenuVisible(true)}
        style={{ marginLeft: 8 }}
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
    </View>
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
              <FontAwesome6 name="right-from-bracket" size={20} color="red" />
              <Text style={[styles.menuText, { color: 'red' }]}>Cerrar Sesión</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Modal Colaborá con Nosotros */}
      <Modal
        visible={colaborarModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setColaborarModalVisible(false)}
      >
        <TouchableOpacity 
          style={styles.colaborarModalOverlay}
          activeOpacity={1}
          onPress={() => setColaborarModalVisible(false)}
        >
          <TouchableOpacity 
            style={styles.colaborarModalContent} 
            activeOpacity={1} 
            onPress={(e) => e.stopPropagation()}
          >
            <Text style={styles.colaborarModalTitle}>Colaborá con Nosotros</Text>
            <Text style={styles.colaborarModalText}>
              Verdeando es un proyecto que busca conectar a las personas con puntos verdes y promover el reciclaje en tu comunidad.
            </Text>
            <Text style={styles.colaborarModalText}>
              Si tenés un emprendimiento, un comercio, o simplemente querés sumarte a esta iniciativa y colaborar con el proyecto, nos encantaría escucharte.
            </Text>
            <Text style={styles.colaborarModalText}>
              Escribinos a:
            </Text>
            <TouchableOpacity 
              onPress={() => Linking.openURL(`mailto:${EMAIL_COLABORAR}`)}
              style={styles.colaborarEmailButton}
            >
              <FontAwesome6 name="envelope" size={18} color="#2C7865" />
              <Text style={styles.colaborarEmailText}>{EMAIL_COLABORAR}</Text>
            </TouchableOpacity>
            <Text style={[styles.colaborarModalText, { marginTop: 8 }]}>
              Si querés apoyar con una donación, podés transferirnos al siguiente alias para ayudarnos a mantener el proyecto en marcha. ¡Cada aporte suma!
            </Text>
            <View style={styles.colaborarAliasBox}>
              <FontAwesome6 name="hand-holding-heart" size={18} color="#2C7865" />
              <Text style={styles.colaborarAliasText}>{ALIAS_DONACION}</Text>
            </View>
            <TouchableOpacity 
              style={styles.colaborarCerrarButton}
              onPress={() => setColaborarModalVisible(false)}
            >
              <Text style={styles.colaborarCerrarText}>Cerrar</Text>
            </TouchableOpacity>
          </TouchableOpacity>
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
                <NewsletterProvider>
                  <LeaderboardsProvider>
                    <RootLayoutNav />
                  </LeaderboardsProvider>
                </NewsletterProvider>
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
  colaborarModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
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
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 4,
  },
  colaborarButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 4,
    backgroundColor: '#D4AF37',
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(255, 220, 100, 0.6)',
    shadowColor: '#B8860B',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 6,
  },
  colaborarButtonShine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '40%',
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  colaborarButtonText: {
    color: '#3d2c0d',
    fontSize: 13,
    fontWeight: '700',
    textShadowColor: 'rgba(255, 255, 255, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 0,
  },
  colaborarModalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    marginHorizontal: 24,
    maxWidth: 400,
    alignSelf: 'center',
  },
  colaborarModalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2C7865',
    marginBottom: 16,
    textAlign: 'center',
  },
  colaborarModalText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    marginBottom: 12,
    textAlign: 'center',
  },
  colaborarEmailButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#e8f5e9',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginTop: 8,
    marginBottom: 20,
  },
  colaborarEmailText: {
    fontSize: 16,
    color: '#2C7865',
    fontWeight: '600',
  },
  colaborarAliasBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#f5f5f5',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  colaborarAliasText: {
    fontSize: 16,
    color: '#2C7865',
    fontWeight: '700',
  },
  colaborarCerrarButton: {
    backgroundColor: '#2C7865',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  colaborarCerrarText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
