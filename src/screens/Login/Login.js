import React from "react";
import { Text, SafeAreaView, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";

function Login() {
  const navigation = useNavigation();

  return (
    <SafeAreaView>
      <Text>Login</Text>
      <Button title="Login" onPress={login} />
    </SafeAreaView>
  );
}

export default Login;
