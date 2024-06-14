import React from "react";
import { Pressable, Text, StyleSheet } from "react-native";
import colors from "../../../../theme";
import { SimpleLineIcons } from "@expo/vector-icons";

function FollowButton({ isFollowing, handlePress }) {
  return (
    <Pressable
      style={isFollowing ? styles.followingButton : styles.followButton}
      onPress={handlePress}
    >
      {isFollowing ? (
        <>
          <Text style={styles.followingText}>Following</Text>
          <SimpleLineIcons name="user-following" size={20} color="white" />
        </>
      ) : (
        <>
          <Text style={styles.followText}>Follow</Text>
          <SimpleLineIcons
            name="user-follow"
            size={20}
            color={colors.dark.accent}
          />
        </>
      )}
    </Pressable>
  );
}

export default FollowButton;

const styles = StyleSheet.create({
  followingButton: {
    width: "40%",
    height: 50,
    borderRadius: 10,
    backgroundColor: colors.dark.accent,
    justifyContent: "space-evenly",
    alignItems: "center",
    flexDirection: "row",
  },

  followButton: {
    width: "40%",
    height: 50,
    borderRadius: 10,
    borderColor: colors.dark.accent,
    borderWidth: 4,
    justifyContent: "space-evenly",
    alignItems: "center",
    flexDirection: "row",
  },

  followingText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },

  followText: {
    color: colors.dark.accent,
    fontSize: 20,
    fontWeight: "bold",
  },
});
