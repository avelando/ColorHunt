import React, { useState } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomInput from "../../components/CustomInput";
import { loginUser } from "../../services/userService";
import { buttonStyles } from "../../styles/button";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../types/RockStackParamList.types";
import { useNavigation } from "@react-navigation/native";
import { globalStyles } from "../../styles/global";

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, "Login">;

const LoginScreen = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Erro", "Preencha todos os campos!");
      return;
    }
  
    try {
      const data = await loginUser(email, password);
  
      if (!data.token || !data.userId) {
        throw new Error("Dados inválidos recebidos do servidor.");
      }
  
      console.log("🔍 Salvando token e ID do usuário...");
      await AsyncStorage.setItem("userToken", data.token);
      await AsyncStorage.setItem("userId", data.userId.toString());

      Alert.alert("Sucesso", "Login realizado!");
      
      navigation.reset({
        index: 0,
        routes: [{ name: "Tabs" }],
      });
    } catch (error: any) {
      console.error("❌ Erro ao logar:", error.message);
      Alert.alert("Erro", error.message || "Credenciais inválidas.");
    }
  };

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Login</Text>
      <CustomInput
        label="Email"
        placeholder="Digite seu email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <CustomInput
        label="Senha"
        placeholder="Digite sua senha"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={buttonStyles.button} onPress={handleLogin}>
        <Text style={buttonStyles.buttonText}>Entrar</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={globalStyles.registerLink}
        onPress={() => navigation.navigate("Register")}
      >
        <Text style={globalStyles.registerText}>Não tem uma conta? Cadastre-se</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;
