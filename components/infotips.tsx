import {
  Image,
  Linking,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { FontAwesome6, FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { tagColor } from "@/constants/TagColors";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUser } from "@/contexts/UserContext";
import { useNewsletter } from "@/contexts/NewsletterContext";
import type { Articulo } from "@/contexts/NewsletterContext";

const FAVORITES_KEY = "favorite_news";

function formatearFecha(fecha?: Date | string): string {
  if (!fecha) return "—";
  const d = new Date(fecha);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("es-AR", { day: "2-digit", month: "short", year: "numeric" });
}

export default function InfoTips({ infotip }: { infotip: Articulo }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const { agregarFavorito, eliminarFavorito } = useNewsletter();
  const { user } = useUser();

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

  const toggleFavorite = async () => {
    try {
      const favorites = await AsyncStorage.getItem(FAVORITES_KEY);
      let favoritesArray = favorites ? JSON.parse(favorites) : [];

      if (isFavorite) {
        favoritesArray = favoritesArray.filter((id: string) => id !== infotip.id);
        await eliminarFavorito(user?.id || "", infotip.id);
      } else {
        favoritesArray.push(infotip.id);
        await agregarFavorito(user?.id || "", infotip);
      }

      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favoritesArray));
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error("Error al guardar favoritos:", error);
    }
  };

  const abrirNoticia = () => {
    if (infotip.url) {
      Linking.openURL(infotip.url);
    }
  };

  const tagBg = tagColor(infotip.tag);

  return (
    <>
      <Pressable
        style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
        onPress={() => setModalVisible(true)}
      >
        <View style={styles.cardHeader}>
          <View style={[styles.tagBadge, { backgroundColor: tagBg }]}>
            <FontAwesome6 name="tag" size={11} color="#fff" />
            <Text style={styles.tagText} numberOfLines={1}>
              {infotip.tag}
            </Text>
          </View>
          <Pressable
            onPress={(e) => {
              e.stopPropagation();
              toggleFavorite();
            }}
            style={styles.favoriteButton}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <FontAwesome
              name={isFavorite ? "heart" : "heart-o"}
              size={18}
              color={isFavorite ? "#E91E63" : "#999"}
            />
          </Pressable>
        </View>

        {infotip.imagen ? (
          <Image source={{ uri: infotip.imagen }} style={styles.cardImage} resizeMode="cover" />
        ) : (
          <View style={styles.cardImagePlaceholder}>
            <FontAwesome6 name="newspaper" size={32} color="#2C7865" />
          </View>
        )}

        <View style={styles.cardBody}>
          <Text style={styles.cardTitle} numberOfLines={2}>
            {infotip.titulo}
          </Text>
          <Text style={styles.cardDescription} numberOfLines={2}>
            {infotip.descripcion}
          </Text>
          <Text style={styles.verDetalle}>Ver detalle</Text>
        </View>
      </Pressable>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <LinearGradient
              colors={["#2C7865", "#1E5248"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.modalHeader}
            >
              <Text style={styles.modalTitle} numberOfLines={2}>
                {infotip.titulo}
              </Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.modalCloseButton}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <FontAwesome6 name="xmark" size={18} color="#fff" />
              </TouchableOpacity>
            </LinearGradient>

            <ScrollView style={styles.modalScroll} contentContainerStyle={styles.modalScrollContent}>
              <View style={styles.modalTagRow}>
                <View style={[styles.tagBadgeLarge, { backgroundColor: tagBg }]}>
                  <FontAwesome6 name="tag" size={12} color="#fff" />
                  <Text style={styles.tagTextLarge}>{infotip.tag}</Text>
                </View>
                <Pressable onPress={toggleFavorite} style={styles.favoriteButtonLarge}>
                  <FontAwesome
                    name={isFavorite ? "heart" : "heart-o"}
                    size={22}
                    color={isFavorite ? "#E91E63" : "#999"}
                  />
                  <Text style={styles.favoriteLabel}>
                    {isFavorite ? "En favoritos" : "Agregar a favoritos"}
                  </Text>
                </Pressable>
              </View>

              <View style={styles.imageCard}>
                {infotip.imagen ? (
                  <Image source={{ uri: infotip.imagen }} style={styles.modalImage} resizeMode="cover" />
                ) : (
                  <View style={styles.imagePlaceholder}>
                    <FontAwesome6 name="newspaper" size={48} color="#2C7865" />
                  </View>
                )}
              </View>

              <Text style={styles.descripcion}>{infotip.descripcion}</Text>

              <View style={styles.infoCard}>
                <View style={styles.infoRow}>
                  <View style={styles.infoRowLeft}>
                    <FontAwesome6 name="calendar" size={14} color="#2C7865" />
                    <Text style={styles.infoLabel}>Publicado</Text>
                  </View>
                  <Text style={styles.infoValue}>{formatearFecha(infotip.fechaCreacion)}</Text>
                </View>
              </View>
            </ScrollView>

            <TouchableOpacity
              style={styles.modalFooterButton}
              onPress={() => {
                setModalVisible(false);
                abrirNoticia();
              }}
            >
              <FontAwesome6 name="arrow-up-right-from-square" size={16} color="#fff" />
              <Text style={styles.modalFooterButtonText}>Leer noticia completa</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    marginHorizontal: 4,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#D4E8E0",
    shadowColor: "#1E5248",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    overflow: "hidden",
  },
  cardPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.99 }],
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: "#F0FAF7",
    borderBottomWidth: 1,
    borderBottomColor: "#E8F2EE",
    gap: 8,
  },
  tagBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    flexShrink: 1,
  },
  tagText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.3,
    flexShrink: 1,
  },
  favoriteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#D4E8E0",
    alignItems: "center",
    justifyContent: "center",
  },
  cardImage: {
    width: "100%",
    height: 140,
    backgroundColor: "#F0FAF7",
  },
  cardImagePlaceholder: {
    width: "100%",
    height: 140,
    backgroundColor: "#EEF6F3",
    alignItems: "center",
    justifyContent: "center",
  },
  cardBody: {
    padding: 14,
    gap: 6,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#333",
    lineHeight: 22,
  },
  cardDescription: {
    fontSize: 13,
    color: "#666",
    lineHeight: 18,
  },
  verDetalle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#2C7865",
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },
  modalSheet: {
    backgroundColor: "#FAFFFE",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "92%",
    overflow: "hidden",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#fff",
    flex: 1,
  },
  modalCloseButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  modalScroll: {
    flexGrow: 0,
  },
  modalScrollContent: {
    padding: 16,
    paddingBottom: 8,
  },
  modalTagRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
    gap: 12,
  },
  tagBadgeLarge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    flexShrink: 1,
  },
  tagTextLarge: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.4,
    flexShrink: 1,
  },
  favoriteButtonLarge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#D4E8E0",
  },
  favoriteLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666",
  },
  imageCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#D4E8E0",
    overflow: "hidden",
    marginBottom: 16,
  },
  modalImage: {
    width: "100%",
    height: 200,
  },
  imagePlaceholder: {
    height: 200,
    alignItems: "center",
    justifyContent: "center",
  },
  descripcion: {
    fontSize: 15,
    color: "#444",
    lineHeight: 22,
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#D4E8E0",
    paddingHorizontal: 14,
    overflow: "hidden",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EEF6F3",
    gap: 12,
  },
  infoRowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#333",
  },
  infoValueHighlight: {
    fontSize: 15,
    fontWeight: "800",
    color: "#2C7865",
  },
  modalFooterButton: {
    backgroundColor: "#2C7865",
    marginHorizontal: 16,
    marginBottom: 24,
    marginTop: 8,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  modalFooterButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
