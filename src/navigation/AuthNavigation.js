import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "../screens/Login/Login";
import RegisterScreen from "../screens/Register/Register";
import ForgotPassword from "../screens/ForgotPassword/ForgotPassword";
import RootNavigation from "./RootNavigation";
import React, { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigation } from "@react-navigation/native";

const Stack = createNativeStackNavigator();

const AuthNavigation = () => {
  const { isLoggedIn } = useAuth();
  const navigation = useNavigation();
  console.log(isLoggedIn);

  useEffect(() => {
    if (isLoggedIn) {
      navigation.navigate("Root");
    }
  }, [isLoggedIn]);
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      <Stack.Screen
        name="Root"
        component={RootNavigation}
        options={{
          gestureEnabled: false,
          fullScreenGestureEnabled: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default AuthNavigation;
