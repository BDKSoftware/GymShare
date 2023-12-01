import React from "react";
import { Text, SafeAreaView, Button } from "react-native";
import { auth } from "../../../firebase";
import { useAuth } from "../../context/AuthContext";
import { useNavigation } from "@react-navigation/native";

function Social() {
  let displayName = auth.currentUser.email;
  const { logOut } = useAuth();
  const navigation = useNavigation();

  const handleLogout = () => {
    logOut();
    navigation.navigate("Login");
  };

  return (
    <SafeAreaView>
      <Text>Social</Text>
      <Button title="Logout" onPress={handleLogout} />
    </SafeAreaView>
  );
}

export default Social;
