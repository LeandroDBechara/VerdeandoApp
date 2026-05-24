import { Image, StyleSheet, View } from "react-native";

type HeaderLogoProps = {
  compact?: boolean;
};

export default function HeaderLogo({ compact = false }: HeaderLogoProps) {
  return (
    <View style={styles.container}>
      <Image
        source={require("@/assets/images/logoVerdeando.png")}
        style={[styles.logo, compact && styles.logoCompact]}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
  },
  logo: {
    width: 88,
    height: 20,
  },
  logoCompact: {
    width: 100,
    height: 22,
  },
});
