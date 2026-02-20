import { Image, Linking, Pressable, StyleSheet, Text, View } from "react-native";
import { FontAwesome6, FontAwesome} from "@expo/vector-icons";
import { tagColor } from "@/constants/TagColors";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const FAVORITES_KEY = "favorite_news";

export default function InfoTips({ infotip }: { infotip: any }) {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    checkIfFavorite();
  }, [infotip.id]);

  const checkIfFavorite = async () => {
    try {
      const favorites = await AsyncStorage.getItem(FAVORITES_KEY);
      if (favorites) {
        const favoritesArray = JSON.parse(favorites);
        setIsFavorite(favoritesArray.includes(infotip.id));
      }
    } catch (error) {
      console.error("Error al verificar favoritos:", error);
    }
  };

  const toggleFavorite = async (e: any) => {
    e.stopPropagation();
    try {
      const favorites = await AsyncStorage.getItem(FAVORITES_KEY);
      let favoritesArray = favorites ? JSON.parse(favorites) : [];
      
      if (isFavorite) {
        favoritesArray = favoritesArray.filter((id: any) => id !== infotip.id);
      } else {
        favoritesArray.push(infotip.id);
      }
      
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favoritesArray));
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error("Error al guardar favoritos:", error);
    }
  };

  return (
    <Pressable onPress={() => Linking.openURL(infotip.url)} style={styles.container}>
      <View style={styles.header}>
        <View style={[styles.tag, { backgroundColor: tagColor(infotip.tag) }]}> 
          <FontAwesome6 name="tag" size={14} color="white" />
          <Text style={styles.tagText}>{infotip.tag}</Text>
        </View>
        <Pressable onPress={toggleFavorite} style={styles.favoriteButton}>
          <FontAwesome 
            name={isFavorite ? "heart" : "heart-o"} 
            size={20}
            style={{transform: [{rotate: "30deg"}]}}
            color={isFavorite ? "#E91E63" : "#999"} 
          />
        </Pressable>
      </View>
      
      <Image source={{ uri: infotip.imagen }} style={styles.image} resizeMode="cover" />
      
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
          {infotip.titulo}
        </Text>
        <Text style={styles.description} numberOfLines={3} ellipsizeMode="tail">
          {infotip.descripcion}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 15,
    width: "48%",
    minHeight: 250,
    padding: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    backgroundColor: "white",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    flex: 1,
    marginRight: 8,
  },
  tagText: {
    color: "white",
    fontSize: 11,
    fontWeight: "600",
  },
  favoriteButton: {
    padding: 6,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.05)",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: 120,
    borderRadius: 10,
    marginBottom: 10,
  },
  content: {
    flex: 1,
  },
  title: {
    fontWeight: "bold",
    color: "#212121",
    fontSize: 14,
    marginBottom: 6,
    lineHeight: 18,
  },
  description: {
    fontSize: 11,
    color: "#666",
    lineHeight: 16,
    flexShrink: 1,
  },
});
