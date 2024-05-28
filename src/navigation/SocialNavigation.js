import "react-native-gesture-handler";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Explore from "../screens/Explore/Explore";
import FindFriends from "../screens/FindFriends/FindFriends";
import ViewWorkout from "../screens/ViewWorkout/ViewWorkout";

const Stack = createNativeStackNavigator();

const SocialNavigation = () => {
  return (
    <Stack.Navigator
      initialRouteName="Explore"
      screenOptions={{
        headerShown: false,
        unmoutOnBlur: true,
      }}
    >
      <Stack.Screen name="Explore" component={Explore} />
      <Stack.Screen name="FindFriends" component={FindFriends} />
      <Stack.Screen name="ViewWorkout" component={ViewWorkout} />
    </Stack.Navigator>
  );
};

export default SocialNavigation;
