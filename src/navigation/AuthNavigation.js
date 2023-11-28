import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "../screens/Login/Login";
import RegisterScreen from "../screens/Register/Register";
import ForgotPassword from "../screens/ForgotPassword/ForgotPassword";
import RootNavigation from "./RootNavigation";

const Stack = createNativeStackNavigator();

const AuthNavigation = () => {
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
      <Stack.Screen name="Root" component={RootNavigation} />
    </Stack.Navigator>
  );
};

export default AuthNavigation;
