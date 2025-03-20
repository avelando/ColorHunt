import { StyleSheet } from "react-native";

export const profileStyles = StyleSheet.create({
  updatingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 999,
    justifyContent: "center",
    alignItems: "center",
  },
  headerButton: {
    marginRight: 10,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#007BFF",
    borderRadius: 5,
  },
  headerButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  notAuthenticatedContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  infoText: {
    fontSize: 18,
    marginBottom: 20,
  },
  bottomButtonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  smallButton: {
    width: 140,
    marginHorizontal: 10,
  },
});
