import { StyleSheet } from "react-native";

export const colorStyles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: 320,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    maxHeight: "90%",
  },
  scrollViewContent: {
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  colorPreviewContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    marginBottom: 15,
  },
  colorBox: {
    alignItems: "center",
  },
  previewText: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 5,
    color: "#333",
  },
  colorPreview: {
    width: 50,
    height: 50,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  colorInput: {
    width: "80%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    textAlign: "center",
    marginBottom: 10,
  },
  colorPickerWrapper: {
    width: "100%",
    alignItems: "center",
    marginVertical: 10,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#dc3545",
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center",
    marginRight: 5,
  },
  confirmButton: {
    flex: 1,
    backgroundColor: "#28a745",
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center",
    marginLeft: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});