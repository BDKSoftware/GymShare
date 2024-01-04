import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "../screens/Home/Home";
import CreateWorkout from "../screens/CreateWorkout/CreateWorkout";

const Stack = createNativeStackNavigator();

const HomeNavigation = () => {
  return (
    <Stack.Navigator
      initialRouteName="HomeScreen"
      screenOptions={{
        headerShown: false,
        unmoutOnBlur: true,
      }}
    >
      <Stack.Screen name="HomeScreen" component={Home} />
      <Stack.Screen name="CreateWorkout" component={CreateWorkout} />
    </Stack.Navigator>
  );
};

export default HomeNavigation;
