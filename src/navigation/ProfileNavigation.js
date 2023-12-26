import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Profile from "../screens/Profile/Profile";
import Settings from "../screens/Settings/Settings";

const Stack = createNativeStackNavigator();

const ProfileNavigation = () => {
  return (
    <Stack.Navigator
      initialRouteName="Profile"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="Settings" component={Settings} />
    </Stack.Navigator>
  );
};

export default ProfileNavigation;
