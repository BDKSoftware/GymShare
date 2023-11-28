import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Home from "../screens/Home/Home";

const Stack = createNativeStackNavigator();

const RootNavigation = () => {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={Home} />
    </Stack.Navigator>
  );
};

export default RootNavigation;
