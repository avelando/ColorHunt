import React from "react";
import { SafeAreaView, ScrollView, RefreshControl, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ScreenContainerProps } from "../interfaces/ScreenContainerProps";
import { screenContainerStyles } from "../styles/screenContainer";

const ScreenContainer: React.FC<ScreenContainerProps> = ({
  children,
  refreshing = false,
  onRefresh,
  containerStyle,
  scrollable = true,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView
      style={[screenContainerStyles.safeArea, { paddingTop: insets.top }, containerStyle]}
    >
      <View style={[screenContainerStyles.container, { flex: 1 }]}>
        {scrollable ? (
          <ScrollView
            contentContainerStyle={screenContainerStyles.contentContainer}
            refreshControl={
              onRefresh ? (
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              ) : undefined
            }
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

export default ScreenContainer;
