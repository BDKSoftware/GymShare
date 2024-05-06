import React from "react";
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import colors from "../../../theme";
import { FontAwesome5 } from "@expo/vector-icons";

function Explore() {
  const navigation = useNavigation();
  const theme = useSelector((state) => state.theme.value);
  const dispatch = useDispatch();

  function handleFriendPress() {
    navigation.navigate("FindFriends");
  }

  return (
    <SafeAreaView
      style={theme === "light" ? styles.lightContainer : styles.darkContainer}
    >
      <View style={styles.topArea}>
        <Pressable onPress={handleFriendPress}>
          <FontAwesome5
            name="user-friends"
            size={24}
            color={colors.dark.accent}
          />
        </Pressable>
      </View>
      <View
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator size={"large"} color={colors.dark.accent} />
      </View>
    </SafeAreaView>
  );
}

export default Explore;

const styles = StyleSheet.create({
  lightContainer: {
    flex: 1,
    backgroundColor: colors.light.background,
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
  },

  darkContainer: {
    flex: 1,
    backgroundColor: colors.dark.background,
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
  },

  topArea: {
    width: "100%",
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "center",
    padding: 20,
  },
});
