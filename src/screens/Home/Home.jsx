import React from "react";
import { Text, View, Button, StyleSheet } from "react-native";
import { auth } from "../../../firebase";
import { useAuth } from "../../context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import colors from "../../../theme";
import { changeTheme } from "../../store/themeSlice";

function Home() {
  const { logOut } = useAuth();
  const navigation = useNavigation();
  const theme = useSelector((state) => state.theme.value);
  const dispatch = useDispatch();

  const handleLogout = () => {
    logOut();
    navigation.navigate("Login");
  };

  const handleChangeColorTheme = () => {
    if (theme === "light") {
      dispatch(changeTheme("dark"));
    } else {
      dispatch(changeTheme("light"));
    }
  };

  return (
    <View
      style={theme === "light" ? styles.lightContainer : styles.darkContainer}
    >
      <Text>Home</Text>
      <Button title="Logout" onPress={handleLogout} />
      <Button title="Change Color Theme" onPress={handleChangeColorTheme} />
    </View>
  );
}

export default Home;

const styles = StyleSheet.create({
  lightContainer: {
    flex: 1,
    backgroundColor: colors.light.background,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  darkContainer: {
    flex: 1,
    backgroundColor: colors.dark.background,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});
