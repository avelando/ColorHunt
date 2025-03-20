import React, { useState, useEffect, useRef } from "react";
import { 
  Modal, 
  View, 
  Text, 
  TouchableOpacity, 
  TextInput,
  Dimensions,
  ScrollView
} from "react-native";
import ColorPicker from "react-native-wheel-color-picker";
import { colorStyles } from "../styles/colorPicker";

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
    if (SCREEN_HEIGHT < 700) {
      setForceSquare(true);
    } else {
      setForceSquare(false);
    }
  }, []);

  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <View style={colorStyles.modalOverlay}>
        <View style={colorStyles.modalContent}>
          <ScrollView contentContainerStyle={colorStyles.scrollViewContent}>
            <Text style={colorStyles.modalTitle}>Editar Cor</Text>

            <View style={colorStyles.colorPreviewContainer}>
              <View style={colorStyles.colorBox}>
                <View style={[colorStyles.colorPreview, { backgroundColor: previousColor }]} />
                <Text style={colorStyles.previewText}>Antes</Text>
              </View>
              <View style={colorStyles.colorBox}>
                <View style={[colorStyles.colorPreview, { backgroundColor: selectedColor }]} />
                <Text style={colorStyles.previewText}>Depois</Text>
              </View>
            </View>

            <TextInput
              style={colorStyles.colorInput}
              value={selectedColor}
              onChangeText={(text) => setSelectedColor(text)}
              maxLength={7}
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="#FFFFFF"
              keyboardType="default"
            />

            <View style={colorStyles.colorPickerWrapper}>
              <ColorPicker
                ref={colorPickerRef}
                color={selectedColor}
                onColorChange={setSelectedColor}
                thumbSize={30}
                sliderSize={20}
                row={forceSquare}
              />
            </View>

            <View style={colorStyles.buttonsContainer}>
              <TouchableOpacity style={colorStyles.cancelButton} onPress={onClose}>
                <Text style={colorStyles.buttonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={colorStyles.confirmButton}
                onPress={() => {
                  onColorSelect(selectedColor);
                  onClose();
                }}
              >
                <Text style={colorStyles.buttonText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default ColorPickerModal;
