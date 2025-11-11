import { Image, Linking, Pressable, StyleSheet, Text, View } from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";
import { tagColor } from "@/constants/TagColors";

export default function InfoTipsRate({ infotip }: { infotip: any }) {
  return (
    <Pressable onPress={() => Linking.openURL(infotip.url)} style={styles.container}>
      <View style={[styles.tag, { backgroundColor: tagColor(infotip.tag) }]}>
        <FontAwesome6 name="tag" size={18} color="white" />
         <Text style={{ color: "white" }}>{infotip.tag}</Text>
         </View>
      <Image source={{ uri: infotip.image }} style={styles.image} resizeMode="cover" />
      <Text style={styles.title} numberOfLines={2}>{infotip.titulo}</Text>
      <Text style={styles.description} numberOfLines={2} ellipsizeMode="tail">{infotip.descripcion}</Text>
    </Pressable>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 16,
    width: 260,
    height: 190,
    padding: 12,
    marginRight: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  title: {
    fontWeight: "bold",
    color: "black",
    paddingTop: 6,
    paddingBottom: 4,
    fontSize: 14,
  },
  description: {
    fontSize: 12,
    color: "#444",
    flexShrink: 1,
  },
  image: {
    marginTop: 6,
    marginBottom: 6,
    width: "100%",
    height: 100,
    borderRadius: 12,
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-end",
    justifyContent: "space-evenly",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    width: "80%",
  },
});