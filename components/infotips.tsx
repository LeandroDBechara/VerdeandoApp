import { Image, Linking, Pressable, StyleSheet, Text, View } from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";
import { tagColor } from "@/constants/TagColors";

export default function InfoTips({ infotip, index }: { infotip: any, index?: number }) {
  const isEven = index !== undefined && index % 2 === 0;
  const backgroundColor = isEven ? "white" : "#E8F5E9"; // white or light green

  return (
    <Pressable onPress={() => Linking.openURL(infotip.url)} style={[styles.container, { backgroundColor }]}>
      <View style={[styles.tag, { backgroundColor: tagColor(infotip.tag) }]}>
        <FontAwesome6 name="tag" size={18} color="white" />
         <Text style={{ color: "white" }}>{infotip.tag}</Text>
         </View>
      <Image source={{ uri: infotip.image }} style={styles.image} resizeMode="contain" />
      <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">{infotip.titulo}</Text>
      <Text style={styles.description} numberOfLines={3} ellipsizeMode="tail">{infotip.descripcion}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 15,
    width: "48%",
    height: 250,
    padding: 8,
    overflow: "hidden",
  },
  title: {
    fontWeight: "bold",
    color: "black",
    paddingBottom: 8,
  },
  description: {
    fontSize: 12,
    color: "black",
    flexShrink: 1,
  },
  image: {
    marginTop: 10,
    marginBottom: 10,
    width: 148,
    height: 100,
    borderRadius: 10,
  },
  url: {
    fontSize: 16,
    color: "blue",
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
  imagen2:{
    width: 300,
    height: 148,
    backgroundColor: "linear-gradient(163deg, rgba(56,235,226,1) 0%, rgba(134,221,245,1) 50%)",
  },
  card:{
    width: "50%",
  height: 325,
  backgroundColor: "#e8e8e8",
  borderRadius: 15,
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  position: "relative",
  color: "#212121",
  borderWidth: 2,
  borderColor: "#ab4b38",

  }
});
