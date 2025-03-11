import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface MiniTabViewProps {
  activeTab: "followers" | "following";
  onTabPress: (tab: "followers" | "following") => void;
}

const MiniTabView: React.FC<MiniTabViewProps> = ({ activeTab, onTabPress }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.tab, activeTab === "followers" && styles.activeTab]}
        onPress={() => onTabPress("followers")}
      >
        <Text style={[styles.tabText, activeTab === "followers" && styles.activeTabText]}>
          Seguidores
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab, activeTab === "following" && styles.activeTab]}
        onPress={() => onTabPress("following")}
      >
        <Text style={[styles.tabText, activeTab === "following" && styles.activeTabText]}>
          Seguindo
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginHorizontal: 10,
    marginVertical: 10,
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
  },
  activeTab: {
    backgroundColor: "#007BFF",
  },
  tabText: {
    fontSize: 16,
    color: "#007BFF",
  },
  activeTabText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default MiniTabView;
