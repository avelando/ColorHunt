import React, { useEffect } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useFonts, Pacifico_400Regular } from "@expo-google-fonts/pacifico";
import { splashStyles } from "../styles/splashScreen";

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [fontsLoaded] = useFonts({
    Pacifico: Pacifico_400Regular,
  });

  useEffect(() => {
    if (fontsLoaded) {
      const timer = setTimeout(() => {
        onFinish();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return (
      <View style={splashStyles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <LinearGradient colors={["#7b4397", "#dc2430"]} style={splashStyles.container}>
      <Text style={splashStyles.title}>ColorHunt</Text>
      <ActivityIndicator size="large" color="#fff" style={splashStyles.indicator} />
    </LinearGradient>
  );
};

export default SplashScreen;
