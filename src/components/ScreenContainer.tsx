import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, ViewStyle, RefreshControl, StyleProp, View } from 'react-native';

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
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.container, containerStyle]}>
        {scrollable ? (
          <ScrollView
            contentContainerStyle={styles.contentContainer}
            refreshControl={onRefresh ? <RefreshControl refreshing={refreshing} onRefresh={onRefresh} /> : undefined}
          >
            {children}
          </ScrollView>
        ) : (
          children
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
  },
});

export default ScreenContainer;
