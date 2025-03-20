import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { tabStyles } from "../styles/tabStyles";

interface MiniTabViewProps {
  activeTab: "followers" | "following";
  onTabPress: (tab: "followers" | "following") => void;
}

const MiniTabView: React.FC<MiniTabViewProps> = ({ activeTab, onTabPress }) => {
  return (
    <View style={tabStyles.container}>
      <TouchableOpacity
        activeOpacity={1}
        style={[tabStyles.tab, activeTab === "followers" && tabStyles.activeTab]}
        onPress={() => onTabPress("followers")}
      >
        <Text style={[tabStyles.tabText, activeTab === "followers" && tabStyles.activeTabText]}>
          Seguidores
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={1}
        style={[tabStyles.tab, activeTab === "following" && tabStyles.activeTab]}
        onPress={() => onTabPress("following")}
      >
        <Text style={[tabStyles.tabText, activeTab === "following" && tabStyles.activeTabText]}>
          Seguindo
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default MiniTabView;
