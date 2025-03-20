import { StyleSheet } from "react-native";

export const paletteCardStyles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    marginBottom: 15,
    borderRadius: 8,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    height: 120,
  },
  imageContainer: {
    width: 120,
    height: "100%",
  },
  photo: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  cardContent: {
    flex: 1,
    padding: 10,
    justifyContent: "space-between",
    position: "relative",
  },
  privacyStatus: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "rgba(255,255,255,0.7)",
    borderRadius: 12,
    padding: 2,
    zIndex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 5,
  },
  username: {
    fontSize: 14,
    color: "#555",
    marginTop: 4,
  },
  paletteRow: {
    flexDirection: "row",
    marginTop: 10,
  },
  colorBox: {
    width: 30,
    height: 30,
    borderRadius: 4,
    marginRight: 5,
  },
  noColorsText: {
    fontSize: 12,
    color: "#888",
    marginTop: 10,
  },
  
});