import React, { useEffect, useState } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  StyleSheet,
  Image,
  TextInput,
  KeyboardAvoidingView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { auth } from "../../../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useAuth } from "../../context/AuthContext";

import colors from "../../../theme";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const { logIn } = useAuth();

  const navigation = useNavigation();
  const theme = useSelector((state) => state.theme.value);

  function onClickForgotPassword() {
    navigation.navigate("ForgotPassword");
  }

  function onClickSignUp() {
    navigation.navigate("Register");
  }

  async function onClickSignIn() {
    await signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        logIn(user);
        navigation.navigate("Root");
      })
      .catch((error) => {
        setError(true);
      });
  }

  return (
    <SafeAreaView
      style={theme === "light" ? styles.lightContainer : styles.darkContainer}
    >
      <KeyboardAvoidingView
        style={styles.loginContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <Image
          source={require("../../../assets/logo.png")}
          style={styles.logo}
        />

        <TextInput
          style={theme === "light" ? styles.lightInput : styles.darkInput}
          placeholder="Email"
          placeholderTextColor={theme === "light" ? colors.light.accent : white}
          onChangeText={(email) => setEmail(email)}
          value={email}
          className="input"
          onFocus={() => setError(false)}
        />
        <TextInput
          style={theme === "light" ? styles.lightInput : styles.darkInput}
          placeholder="Password"
          placeholderTextColor={theme === "light" ? colors.light.accent : white}
          onChangeText={(password) => setPassword(password)}
          value={password}
          secureTextEntry={true}
          className="input"
          onFocus={() => setError(false)}
        />
        <View style={styles.forgotPasswordContainer}>
          <TouchableOpacity onPress={onClickForgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>

        <Text style={error == true ? styles.error : { display: "none" }}>
          An Error Has Occured, Please Try Again
        </Text>

        <TouchableOpacity
          style={theme == "light" ? styles.lightButton : styles.darkButton}
          activeOpacity={0.7}
          onPress={onClickSignIn}
        >
          <Text
            style={
              theme == "light" ? styles.lightButtonText : styles.darkButtonText
            }
          >
            Sign In
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
      <View>
        <TouchableOpacity onPress={onClickSignUp}>
          <Text style={styles.forgotPasswordText}>
            Don't have an account? Sign Up Here
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

export default Login;

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

  loginContainer: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "90%",
    height: "90%",
  },

  logo: {
    width: 200,
    height: 200,
    resizeMode: "contain",
  },

  lightInput: {
    width: "90%",
    height: 50,
    backgroundColor: colors.light.background,
    color: colors.light.accent,
    borderRadius: 10,
    paddingLeft: 10,
    marginTop: 20,
    borderColor: colors.light.accent,
    borderWidth: 1,
  },

  darkInput: {
    width: "90%",
    height: 50,
    backgroundColor: colors.dark.background,
    color: "white",
    borderRadius: 10,
    paddingLeft: 10,
    marginTop: 20,
    borderColor: "white",
    borderWidth: 1,
  },

  lightButton: {
    width: "90%",
    height: 50,
    backgroundColor: colors.light.accent,
    borderRadius: 10,
    marginTop: 30,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  darkButton: {
    width: "90%",
    height: 50,
    backgroundColor: colors.dark.accent,
    borderRadius: 10,
    marginTop: 30,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  lightButtonText: {
    color: colors.light.background,
    fontSize: 20,
  },

  darkButtonText: {
    color: "white",
    fontSize: 20,
  },

  forgotPasswordContainer: {
    width: "90%",
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    marginTop: 10,
  },

  forgotPasswordText: {
    color: colors.light.accent,
    fontSize: 15,
  },

  error: {
    color: "red",
    fontSize: 16,
    marginTop: 20,
  },
});
