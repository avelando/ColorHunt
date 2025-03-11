// src/components/ScreenContainer.tsx
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, ViewStyle, RefreshControl, StyleProp } from 'react-native';

interface ScreenContainerProps {
  children: React.ReactNode;
  refreshing?: boolean;
  onRefresh?: () => void;
  containerStyle?: StyleProp<ViewStyle>;
  scrollable?: boolean;
}

const ScreenContainer: React.FC<ScreenContainerProps> = ({
  children,
  refreshing = false,
  onRefresh,
  containerStyle,
  scrollable = true,
}) => {
  return (
    <SafeAreaView style={[styles.safeArea, containerStyle]}>
      {scrollable ? (
        <ScrollView
          contentContainerStyle={styles.contentContainer}
          refreshControl={onRefresh ? <RefreshControl refreshing={refreshing} onRefresh={onRefresh} /> : undefined}
        >
          {children}
        </ScrollView>
      ) : (
        // Se já temos um componente rolável (ex.: FlatList), não envolve em ScrollView.
        children
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  contentContainer: {
    flexGrow: 1,
  },
});

export default ScreenContainer;
