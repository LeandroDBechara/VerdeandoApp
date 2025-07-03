// Onboarding.tsx
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import { View, Text, FlatList, Image, Dimensions, StyleSheet, Pressable, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';

const { width } = Dimensions.get('window');
const router = useRouter();

const slides = [
  {
    key: '1',
    title: 'Descubrí dónde llevar tus residuos ♻️',
    description: 'Activá tu ubicación y encontrá puntos verdes cerca de tu casa. ¡Tu barrio te necesita!',
    image: require('../assets/images/onboard/omboard-img1.png'), // Reemplazá con tu imagen
    button: false,

  },
  {
    key: '2',
    title: '¡Escaneá, entregá y ganá EcoPoints!',
    description: 'Mostrale tu QR al recuperador cuando entregás tus residuos. Sumás EcoPoints por cada bolsa que llevás. ¡Así de simple!',
    image: require('../assets/images/onboard/omboard-img2.png'), // Reemplazá con tu imagen
    button: false,
    
  },
  {
    key: '3',
    title: 'Premios por hacer las cosas bien 💚',
    description: 'Elegí tu premio, mostrá el cupón y disfrutá. ¡Reciclar tiene sus recompensas!',
    image: require('../assets/images/onboard/omboard-img3.png'), // Reemplazá con tu imagen
    button: true,
    
  }
];

export default function Onboarding() {
  const flatListRef = useRef(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentSlideIndex(slideIndex);
  };

  return (
    <FlatList
      ref={flatListRef}
      data={slides}
      keyExtractor={item => item.key}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      onScroll={handleScroll}
      onMomentumScrollEnd={handleScroll}
      renderItem={({ item }) => (
        <View style={styles.slide}>
          <View style={styles.container}>
          <Text style={styles.title}>{item.title}</Text>
          <Image source={item.image} style={styles.image} />
          </View>
          <View style={styles.slidecontainer}>
            <Text style={styles.description}>{item.description}</Text>
            <View style={styles.dotslider}>
              {Array.from({ length: 3 }).map((_, index) => (
                <View 
                  key={index} 
                  style={[
                    styles.dot,
                    currentSlideIndex === index && styles.activeDot
                  ]} 
                />
              ))}
            </View>
            {item.button && (
              <Pressable style={styles.button} onPress={() => router.push('/(tabs)/puntosverdes')}>
                <Text style={styles.buttonText}>¡Estoy listo para reciclar!</Text>
              </Pressable>
            )}
          </View>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  slide: {
    width,
    paddingTop: 80,
    backgroundColor: '#F6E9D4',
  },
  image: {
    width,
    height: '100%',
    top: -50,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'left',
    color: '#2E7D32',
    padding: 20,
  },
  description: {
    fontSize: 16,
    textAlign: 'left',
    marginTop: 10,
    padding: 20,
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    width,
    height: '65%',
  },
  slidecontainer: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: 'white',
    borderRadius: 10,
    width,
    height: '35%',
  },
  button: {
    backgroundColor: '#2E7D32',
    paddingHorizontal: 22,
    paddingVertical: 11,
    borderRadius: 20,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dotslider: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#2C7865',
    marginHorizontal: 5,

  },
  activeDot: {
    backgroundColor: '#90D26D',
  },
});
