import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "../screens/Login/Login";
import RegisterScreen from "../screens/Register/Register";
import ForgotPassword from "../screens/ForgotPassword/ForgotPassword";
import RootNavigation from "./RootNavigation";
import AuthLoading from "../screens/AuthLoading/AuthLoading";
import React, { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { NavigationContainer, useNavigation } from "@react-navigation/native";

const Stack = createNativeStackNavigator();

const AuthNavigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="AuthLoading"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        <Stack.Screen name="AuthLoading" component={AuthLoading} />
        <Stack.Screen
          name="Root"
          component={RootNavigation}
          options={{
            gestureEnabled: false,
            fullScreenGestureEnabled: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AuthNavigation;
