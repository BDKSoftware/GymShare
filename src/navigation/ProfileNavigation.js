import "react-native-gesture-handler";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Profile from "../screens/Profile/Profile";
import Settings from "../screens/Settings/Settings";
import AddGym from "../screens/AddGym/AddGym";
import EditProfile from "../screens/EditProfile/EditProfile";
import PastWorkouts from "../screens/PastWorkouts/PastWorkouts";
import ViewWorkout from "../screens/ViewWorkout/ViewWorkout";

const Stack = createNativeStackNavigator();

const ProfileNavigation = () => {
  return (
    <Stack.Navigator
      initialRouteName="User"
      screenOptions={{
        headerShown: false,
        unmoutOnBlur: true,
      }}
    >
      <Stack.Screen name="User" component={Profile} />
      <Stack.Screen name="Settings" component={Settings} />
      <Stack.Screen name="AddGym" component={AddGym} />
      <Stack.Screen name="EditProfile" component={EditProfile} />
      <Stack.Screen name="PastWorkouts" component={PastWorkouts} />
      <Stack.Screen name="ViewWorkout" component={ViewWorkout} />
    </Stack.Navigator>
  );
};

export default ProfileNavigation;
