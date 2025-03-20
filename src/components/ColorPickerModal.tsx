import React, { useState, useEffect, useRef } from "react";
import { 
  Modal, 
  View, 
  Text, 
  TouchableOpacity, 
  TextInput, 
  StyleSheet,
  Dimensions,
  ScrollView
} from "react-native";
import ColorPicker from "react-native-wheel-color-picker";

const SCREEN_HEIGHT = Dimensions.get("window").height;

interface ColorPickerModalProps {
  visible: boolean;
  color: string;
  onClose: () => void;
  onColorSelect: (newColor: string) => void;
}

const ColorPickerModal: React.FC<ColorPickerModalProps> = ({
  visible,
  color,
  onClose,
  onColorSelect,
}) => {
  const [selectedColor, setSelectedColor] = useState(color);
  const [previousColor, setPreviousColor] = useState(color);
  const [forceSquare, setForceSquare] = useState(false);
  const colorPickerRef = useRef(null);

  useEffect(() => {
    setSelectedColor(color);
    setPreviousColor(color);
  }, [color]);

  useEffect(() => {
    // Força o quadrado cromático caso o círculo ultrapasse os limites do modal
    if (SCREEN_HEIGHT < 700) {
      setForceSquare(true);
    } else {
      setForceSquare(false);
    }
  }, []);

  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <ScrollView contentContainerStyle={styles.scrollViewContent}>
            <Text style={styles.modalTitle}>Editar Cor</Text>

            {/* 🔹 Cores antes e depois da edição */}
            <View style={styles.colorPreviewContainer}>
              <View style={styles.colorBox}>
                <View style={[styles.colorPreview, { backgroundColor: previousColor }]} />
                <Text style={styles.previewText}>Antes</Text>
              </View>
              <View style={styles.colorBox}>
                <View style={[styles.colorPreview, { backgroundColor: selectedColor }]} />
                <Text style={styles.previewText}>Depois</Text>
              </View>
            </View>

            {/* 🔹 Campo para digitar a cor manualmente */}
            <TextInput
              style={styles.colorInput}
              value={selectedColor}
              onChangeText={(text) => setSelectedColor(text)}
              maxLength={7}
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="#FFFFFF"
              keyboardType="default"
            />

            {/* 🔹 Seletor de cores totalmente dentro do modal */}
            <View style={styles.colorPickerWrapper}>
              <ColorPicker
                ref={colorPickerRef}
                color={selectedColor}
                onColorChange={setSelectedColor}
                thumbSize={30}
                sliderSize={20}
                row={forceSquare} // 🔹 Força quadrado cromático se a tela for pequena
              />
            </View>

            {/* 🔹 Botões */}
            <View style={styles.buttonsContainer}>
              <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.confirmButton}
                onPress={() => {
                  onColorSelect(selectedColor);
                  onClose();
                }}
              >
                <Text style={styles.buttonText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default ColorPickerModal;

const styles = StyleSheet.create({
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
