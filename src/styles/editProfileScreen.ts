import { StyleSheet } from "react-native";

export const editStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  photoContainer: {
    alignSelf: "center",
    marginBottom: 20,
  },
  photo: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 2,
    borderColor: "#007BFF",
  },
  changePhotoOverlay: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#007BFF",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  fixedSaveButton: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },  
  saveButtonTopRight: {
    position: "absolute",
    top: 20,
    right: 20,
    backgroundColor: "#007BFF",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    alignItems: "center",
    zIndex: 999,
  },  
  inputContainer: {
    width: "100%",
    marginBottom: 20,
  },
  inputWrapper: {
    position: "relative",
    width: "100%",
    marginBottom: 15,
  },
  input: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 12,
    paddingRight: 40,
    borderRadius: 5,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  inputIcon: {
    position: "absolute",
    right: 10,
    top: "50%",
    transform: [{ translateY: -10 }],
  },  
  inputIconPencil: {
    position: "absolute",
    right: 10,
    top: "50%",
    transform: [{ translateY: -10 }],
  },
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 20,
  },
  saveButtonBottom: {
    flex: 1,
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  deleteButtonBottom: {
    flex: 1,
    backgroundColor: "#FF4D4D",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginLeft: 10,
  },
  saveButtonTop: {
    flex: 1,
    backgroundColor: "#007BFF",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    alignItems: "center",
  },
  deleteButtonTop: {
    flex: 1,
    backgroundColor: "#FF4D4D",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    alignItems: "center",
    marginLeft: 10,
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  deleteButton: {
    width: "48%",
    backgroundColor: "#FF4D4D",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  saveButton: {
    width: "48%",
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
});