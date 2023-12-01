import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  SafeAreaView,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Image } from "expo-image";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { auth } from "../../../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import colors from "../../../theme";
import { useAuth } from "../../context/AuthContext";
import AuthButton from "../../components/AuthButton";
import AuthInput from "../../components/AuthInput";
import createUser from "../../utils/createUser";

function Register() {
  const navigation = useNavigation();
  const theme = useSelector((state) => state.theme.value);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("");
  const { logIn } = useAuth();

  function clearState() {
    setName("");
    setEmail("");
    setPassword("");
    setVerifyPassword("");
  }

  function validateForm() {
    if (name === "") {
      alert("Please enter a name");
      return false;
    }
    if (email === "") {
      alert("Please enter an email address");
      return false;
    }
    if (password === "") {
      alert("Please enter a password");
      return false;
    }
    if (verifyPassword === "") {
      alert("Please verify your password");
      return false;
    }

    if (verifyPassword !== password) {
      alert("Passwords do not match");
      setPassword("");
      setVerifyPassword("");
      return false;
    }

    return true;
  }

  function handleRegister() {
    let valid = validateForm();
    if (!valid) {
      return;
    } else {
      createUserWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
          const user = userCredential.user;

          await createUser(user.uid, name, email).then(() => {
            navigation.navigate("Root");
          });
          logIn(user);
          clearState();
        })
        .catch((error) => {
          alert(error.message);
        });
    }
  }

  return (
    <SafeAreaView
      style={theme === "light" ? styles.lightContainer : styles.darkContainer}
    >
      <KeyboardAvoidingView
        enabled={true}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.content}
      >
        <Image
          source={require("../../../assets/logo.png")}
          style={styles.logo}
          contentFit="contain"
        />
        <AuthInput
          placeholder="Name"
          value={name}
          onChangeText={(value) => setName(value)}
          theme={theme}
        />
        <AuthInput
          placeholder="Email"
          value={email}
          onChangeText={(value) => setEmail(value)}
          theme={theme}
          textContentType={"emailAddress"}
        />
        <AuthInput
          placeholder="Password"
          value={password}
          onChangeText={(value) => setPassword(value)}
          secureTextEntry={true}
          theme={theme}
          textContentType={"oneTimeCode"}
        />
        <AuthInput
          placeholder="Verify Password"
          value={verifyPassword}
          onChangeText={(value) => setVerifyPassword(value)}
          secureTextEntry={true}
          theme={theme}
          textContentType={"oneTimeCode"}
        />

        <AuthButton theme={theme} title="Register" onPress={handleRegister} />
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Login");
            clearState();
          }}
          style={{ marginTop: 20 }}
        >
          <Text
            style={
              theme === "light"
                ? styles.backToLoginLight
                : styles.backToLoginDark
            }
          >
            Already have an account? Login
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export default Register;

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
    height: "100%",
  },

  logo: {
    height: 200,
    width: 200,
  },

  backToLoginLight: {
    color: colors.light.accent,
    fontSize: 16,
  },

  backToLoginDark: {
    color: "#fff",
    fontSize: 16,
  },
});
