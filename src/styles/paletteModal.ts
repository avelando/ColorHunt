import { StyleSheet } from "react-native";

export const paletteModalStyles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.67)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 10,
    overflow: "hidden",
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  image: {
    width: "85%",
    height: 180,
    borderRadius: 8,
    marginBottom: 10,
    marginTop: 10,
  },
  paletteTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  creator: {
    fontSize: 14,
    color: "#555",
  },
  colorContainer: {
    alignItems: "center",
    marginHorizontal: 5,
    marginTop: 15,
  },
  colorBox: {
    width: 40,
    height: 40,
    borderRadius: 5,
  },
  colorHex: {
    marginTop: 5,
    fontSize: 10,
    color: "#333",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
  },
  header: {
    width: "100%",
    backgroundColor: "#6a1b9a",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
});