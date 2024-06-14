import React, { useState, useEffect } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Image } from "expo-image";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { auth } from "../../../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useAuth } from "../../context/AuthContext";
import AuthInput from "../../components/AuthInput";
import AuthButton from "../../components/AuthButton";

import colors from "../../../theme";
import AsyncStorage from "@react-native-async-storage/async-storage";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const { logIn } = useAuth();
  const { isLoggedIn } = useAuth();
  const navigation = useNavigation();

  const theme = useSelector((state) => state.theme.value);

  function clearState() {
    setEmail("");
    setPassword("");
  }

  function onClickForgotPassword() {
    navigation.navigate("ForgotPassword");
    clearState();
  }

  function onClickSignUp() {
    navigation.navigate("Register");
    clearState();
  }

  async function onClickSignIn() {
    await signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        logIn(user);
        navigation.navigate("Root");
        clearState();
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
          contentFit="contain"
        />

        <AuthInput
          theme={theme}
          placeholder="Email"
          onChangeText={(email) => setEmail(email)}
          value={email}
          secureTextEntry={false}
          onFocus={() => setError(false)}
          textContentType={"emailAddress"}
        />
        <AuthInput
          theme={theme}
          placeholder="Password"
          onChangeText={(password) => setPassword(password)}
          value={password}
          secureTextEntry={true}
          onFocus={() => setError(false)}
          textContentType={"oneTimeCode"}
        />
        <View style={styles.forgotPasswordContainer}>
          <TouchableOpacity onPress={onClickForgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>

        <Text style={error == true ? styles.error : { display: "none" }}>
          An Error Has Occured, Please Try Again
        </Text>

        <AuthButton theme={theme} title="Sign In" onPress={onClickSignIn} />
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
