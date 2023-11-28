import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Home from "../screens/Home/Home";

const Stack = createNativeStackNavigator();

const RootNavigation = () => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="Home"
        component={Home}
        options={{
          gestureEnabled: false,
          fullScreenGestureEnabled: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default RootNavigation;
