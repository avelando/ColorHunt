import React, { useState } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import CustomInput from "../../components/CustomInput";
import { registerUser } from "../../services/userService";
import { registerStyles } from "../../styles/registerStyles";
import { buttonStyles } from "../../styles/button";

const RegisterScreen = ({ navigation }: { navigation: any }) => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    if (!name || !username || !email || !password) {
      Alert.alert("Erro", "Preencha todos os campos!");
      return;
    }

    try {
      await registerUser(name, username, email, password);
      Alert.alert("Sucesso", "Registro realizado com sucesso!");
      navigation.navigate("Login");
    } catch (error: any) {
      Alert.alert("Erro", error.message || "Não foi possível registrar.");
    }
  };

  return (
    <View style={registerStyles.container}>
      <Text style={registerStyles.title}>Registrar</Text>
      <CustomInput
        label="Nome"
        placeholder="Digite seu nome"
        value={name}
        onChangeText={setName}
      />
      <CustomInput
        label="Username"
        placeholder="Digite seu username"
        value={username}
        onChangeText={setUsername}
      />
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
      <TouchableOpacity style={buttonStyles.button} onPress={handleRegister}>
        <Text style={buttonStyles.buttonText}>Registrar</Text>
      </TouchableOpacity>
      <TouchableOpacity style={registerStyles.loginLink} onPress={() => navigation.navigate("Login")}>
        <Text style={registerStyles.loginText}>Já tem uma conta? Faça login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RegisterScreen;
