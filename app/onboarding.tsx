// Onboarding.tsx
import React, { useRef } from 'react';
import { View, Text, FlatList, Image, Dimensions, StyleSheet } from 'react-native';

const { width } = Dimensions.get('window');

const slides = [
  {
    key: '1',
    title: 'Descubrí dónde llevar tus residuos ♻️',
    description: 'Activá tu ubicación y encontrá puntos verdes cerca de tu casa. ¡Tu barrio te necesita!',
    image: require('../assets/images/onboard/omboard-img1.png'), // Reemplazá con tu imagen
  },
  {
    key: '2',
    title: '¡Escaneá, entregá y ganá EcoPoints!',
    description: 'Mostrale tu QR al recuperador cuando entregás tus residuos. Sumás EcoPoints por cada bolsa que llevás. ¡Así de simple!',
    image: require('../assets/images/onboard/omboard-img2.png'), // Reemplazá con tu imagen
  }
];

export default function Onboarding() {
  const flatListRef = useRef(null);

  return (
    <FlatList
      ref={flatListRef}
      data={slides}
      keyExtractor={item => item.key}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      renderItem={({ item }) => (
        <View style={styles.slide}>
          <Image source={item.image} style={styles.image} resizeMode="contain" />
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  slide: {
    width,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  image: {
    width: '100%',
    height: '60%',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    textAlign: 'center',
    color: '#2E7D32',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
  }
});
