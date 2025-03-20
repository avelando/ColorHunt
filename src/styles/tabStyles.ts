import { StyleSheet } from "react-native";

export const tabStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginHorizontal: 10,
    marginVertical: 0,
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
    backgroundColor: "#6a1b9a",
  },
  tabText: {
    fontSize: 16,
    color: "#6a1b9a",
  },
  activeTabText: {
    color: "#fff",
    fontWeight: "bold",
  },
});