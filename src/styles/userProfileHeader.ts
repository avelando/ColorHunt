import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  profileHeader: {
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 1,
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    backgroundColor: "#f1f1f1",
    zIndex: -1000,
  },
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: 60,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 10,
    color: "#333",
  },
  username: {
    fontSize: 16,
    color: "#666",
    marginBottom: 10,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 15,
    width: "100%",
  },
  statBox: {
    alignItems: "center",
    padding: 10,
    backgroundColor: "#f1f3f5",
    borderRadius: 10,
    width: "30%",
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#6a1b9a",
  },
  statLabel: {
    fontSize: 14,
    color: "#666",
  },
  followButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginTop: 15,
    alignItems: "center",
    elevation: 3,
  },
  followButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  unfollowButton: {
    backgroundColor: "#FF4D4D",
  },
});