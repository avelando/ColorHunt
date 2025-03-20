import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Animated,
  StyleSheet,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
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

  // Opacidade do gradiente
  const gradientOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(gradientOpacity, {
      toValue: 0,
      duration: 3000,
      useNativeDriver: true,
    }).start();
  }, []);

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
      await AsyncStorage.setItem("userToken", data.token);
      await AsyncStorage.setItem("userId", data.userId.toString());
      Alert.alert("Sucesso", "Login realizado!");

      navigation.reset({
        index: 0,
        routes: [{ name: "Tabs" }],
      });
    } catch (error: any) {
      Alert.alert("Erro", error.message || "Credenciais inválidas.");
    }
  };

  return (
    <View style={[globalStyles.container, { backgroundColor: "#6a1b9a" }]}>
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          { opacity: gradientOpacity },
        ]}
      >
        <LinearGradient
          colors={["#7b4397", "#dc2430"]}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>

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
