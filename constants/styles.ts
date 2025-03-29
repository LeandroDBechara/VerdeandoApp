import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  separator: {
    height: 1, // Altura de la línea
    width: "100%", // Ancho de la línea
    backgroundColor: "gray", // Color de la línea
    marginVertical: 10, // Espaciado arriba y abajo de la línea
  },
  input: {
    width: 338,
    height: 56,
    borderRadius: 16,
    backgroundColor: "#E5E5E5",
    color: "#929292",
    padding: 10,
    marginBottom: 10,
  },
  buttonText: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: 338,
    height: 56,
    borderRadius: 16,
    backgroundColor: "#11B11B",
    color: "white",
  },
  buttonPressed: {
    opacity: 0.5,
  },
  verdeando: {
    fontFamily: "PressStart",
    fontSize: 40,
    color: "#11B11B",
    marginBottom: 10,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    padding: 10,
    position: "absolute",
    bottom: 0,
  },
  link: {
    color: "#11B11B",
  },
  body: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  BtnLoginGyF: {
    width: 160,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    borderColor: "#D9D9D9",
    borderWidth: 1,
  },
  error: {
    color: "red",
  },
});
