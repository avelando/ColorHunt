import { StyleSheet } from "react-native";

export const tabStyles = StyleSheet.create({
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