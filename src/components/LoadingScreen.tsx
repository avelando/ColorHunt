import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { loadingContainerStyles } from '../styles/loadingScreen';

interface LoadingScreenProps {
  message?: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ message }) => {
  return (
    <View style={loadingContainerStyles.container}>
      <ActivityIndicator size="large" color="#007bff" />
      {message && <Text style={loadingContainerStyles.message}>{message}</Text>}
    </View>
  );
};

export default LoadingScreen;
