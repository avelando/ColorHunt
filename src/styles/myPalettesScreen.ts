import { StyleSheet } from "react-native";

export const myPaletteScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  addButton: {
    position: "absolute",
    bottom: 30,
    right: 30,
    backgroundColor: "#6200ee",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "bold",
  },
  loadingText: {
    textAlign: "center",
    marginTop: 20,
  },
  fabContainer: {
    position: "absolute",
    bottom: 5,
    right: 10,
    alignItems: "center",
  },
  fabButton: {
    backgroundColor: "#6a1b9a",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  fabButtonText: {
    fontSize: 30,
    color: "#fff",
  },
  fabOptionsContainer: {
    marginBottom: 10,
    alignItems: "center",
  },
  fabOptionButton: {
    backgroundColor: "#6a1b9a",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 5,
    elevation: 4,
  },  
});
