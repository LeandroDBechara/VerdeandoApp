import { Linking, Platform, View, TouchableOpacity, Image, Modal, Text, StyleSheet } from "react-native";
import { Stack, Tabs } from "expo-router";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useRouter, usePathname } from "expo-router";
import { useState } from "react";
import { useUser } from "@/contexts/UserContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const EMAIL_COLABORAR = "verdeando.dodogames@gmail.com";
const ALIAS_DONACION = "verdeando.donar"; // Reemplazar por el alias real si aplica

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [menuVisible, setMenuVisible] = useState(false);
  const [colaborarModalVisible, setColaborarModalVisible] = useState(false);
  const { logout, user } = useUser();
  const pathname = usePathname();
  const renderHeaderLeft = () => { 
    return (
      pathname === "/" ? (
        null
      ) : (
        <TouchableOpacity 
          onPress={() => router.back()}
          style={{ marginLeft: 16, marginRight: 5 }}
        >
          <FontAwesome6 name="arrow-left" size={20} color="green" />
        </TouchableOpacity>
      )
    );
  }

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
        style={{ marginLeft: 4 }}
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
    </View>
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
            
            height: 90,
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
              borderTopWidth: 1,
              borderTopColor: "lightgray",
              height: insets.bottom+5,
              paddingBottom: 0,
            },
            default: {
              position: "absolute",
              borderTopWidth: 1,
              borderTopColor: "lightgray",
              height: insets.bottom+5,
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
              <FontAwesome6 name="right-from-bracket" size={20} color="red" />
              <Text style={styles.menuText}>Cerrar Sesión</Text>
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
    marginRight: 8,
  },
  colaborarButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#D4AF37',
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(255, 220, 100, 0.6)',
    shadowColor: '#B8860B',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 6,
  },
  colaborarButtonShine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '40%',
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  colaborarButtonText: {
    color: '#3d2c0d',
    fontSize: 12,
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
