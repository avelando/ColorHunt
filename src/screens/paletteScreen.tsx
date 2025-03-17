// src/screens/PaletteScreen.tsx
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Image, 
  Alert, 
  ScrollView, 
  StyleSheet 
} from 'react-native';
import { createPaletteWithImage } from '../services/paletteService';

interface PaletteScreenProps {
  route: any;
  navigation: any;
}

const PaletteScreen: React.FC<PaletteScreenProps> = ({ route, navigation }) => {
  const paletteIdParam = route.params?.paletteId || null;
  const photoUriParam = route.params?.photoUri || null;

  const [paletteName, setPaletteName] = useState('Minha Paleta');
  const [isPublic, setIsPublic] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSavePalette = async () => {
    console.log("==== INÍCIO handleSavePalette ====");
    console.log("📋 photoUri recebido:", photoUriParam);
    console.log("📋 Título informado:", paletteName);
    console.log("📋 Status (isPublic) informado:", isPublic ? 'true' : 'false');

    if (!photoUriParam) {
      Alert.alert('Erro', 'Nenhuma imagem foi selecionada');
      return;
    }
    if (!paletteName) {
      Alert.alert('Atenção', 'Informe o nome da paleta.');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        imageUri: photoUriParam,
        title: paletteName,
        isPublic: isPublic ? 'true' : 'false',
      };
      console.log("📡 Enviando createPaletteWithImage com payload:", payload);

      const newPalette = await createPaletteWithImage(photoUriParam, paletteName, isPublic);
      console.log("📝 Paleta criada com sucesso:", newPalette);
      
      Alert.alert('Sucesso', 'Paleta criada com sucesso!');
      navigation.goBack();
    } catch (error: any) {
      console.error('❌ Erro ao criar paleta com imagem:', error);
      Alert.alert('Erro', 'Não foi possível salvar a paleta.');
    } finally {
      setLoading(false);
      console.log("==== FIM handleSavePalette ====");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.headerText}>
        {paletteIdParam ? 'Editar Paleta' : 'Criar Nova Paleta'}
      </Text>

      {photoUriParam ? (
        <Image
          source={{ uri: photoUriParam }}
          style={styles.photo}
          onLoad={() => console.log("✅ Imagem carregada com sucesso:", photoUriParam)}
          onError={(err) => console.error("❌ Erro ao carregar a imagem:", err.nativeEvent.error)}
        />
      ) : (
        <Text style={styles.warningText}>Nenhuma imagem selecionada.</Text>
      )}

      <TextInput
        placeholder="Nome da Paleta"
        value={paletteName}
        onChangeText={(text) => {
          console.log("✏️ Alteração no título:", text);
          setPaletteName(text);
        }}
        style={styles.input}
      />

      <View style={styles.toggleContainer}>
        <Text style={styles.toggleLabel}>Paleta Pública</Text>
        <TouchableOpacity
          onPress={() => {
            console.log("🔄 Alternando status de isPublic de", isPublic, "para", !isPublic);
            setIsPublic(!isPublic);
          }}
          style={styles.toggleButton}
        >
          <View style={[styles.toggleIndicator, { backgroundColor: isPublic ? 'green' : 'gray' }]} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSavePalette} disabled={loading}>
        <Text style={styles.saveButtonText}>
          {paletteIdParam ? 'Atualizar Paleta' : 'Criar Paleta'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f8f9fa',
    flexGrow: 1,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  photo: {
    width: '100%',
    height: 250,
    borderRadius: 10,
    marginBottom: 20,
  },
  warningText: {
    textAlign: 'center',
    color: 'red',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
    backgroundColor: '#fff',
    color: '#495057',
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  toggleLabel: {
    fontSize: 16,
    color: '#333',
  },
  toggleButton: {
    marginLeft: 10,
  },
  toggleIndicator: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#adb5bd',
  },
  saveButton: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default PaletteScreen;
