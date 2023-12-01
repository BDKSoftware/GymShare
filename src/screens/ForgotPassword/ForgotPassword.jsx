import React from "react";
import {
  SafeAreaView,
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
} from "react-native";
import { Image } from "expo-image";
import colors from "../../../theme";
import { auth } from "../../../firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import AuthInput from "../../components/AuthInput";
import AuthButton from "../../components/AuthButton";

function ForgotPassword() {
  const theme = useSelector((state) => state.theme.value);
  const [email, setEmail] = React.useState("");

  const navigation = useNavigation();

  function onClickReturnToLogin() {
    navigation.navigate("Login");
  }

  function onClickSendResetEmail() {
    if (email === "") return alert("Please enter an email address");
    sendPasswordResetEmail(auth, email)
      .then(() => {
        alert("Password reset email sent!");
        navigation.navigate("Login");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
      });
  }
  return (
    <SafeAreaView
      style={theme === "light" ? styles.lightContainer : styles.darkContainer}
    >
      <View style={styles.content}>
        <Image
          source={require("../../../assets/logo.png")}
          style={styles.logo}
          contentFit="contain"
        />
        <Text style={styles.heading}>
          Forgot your password? Enter your email below
        </Text>
        <AuthInput
          theme={theme}
          placeholder="Email"
          value={email}
          onChangeText={(value) => setEmail(value)}
          secureTextEntry={false}
        />

        <AuthButton
          theme={theme}
          title="Send Reset Email"
          onPress={onClickSendResetEmail}
        />
      </View>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("Login");
          setEmail("");
        }}
      >
        <Text style={styles.returnToLogin}>Back To Login</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

export default ForgotPassword;

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

  content: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "90%",
    height: "90%",
  },

  logo: {
    width: 200,
    height: 200,
  },

  heading: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.light.accent,
    marginVertical: 20,
    textAlign: "center",
  },

  returnToLogin: {
    color: colors.light.accent,
    fontSize: 15,
    marginTop: 10,
  },
});
