import "react-native-gesture-handler";
import AuthNavigation from "./src/navigation/AuthNavigation";
import { Provider } from "react-redux";
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import themeReducer from "./src/store/themeSlice";
import unitSlice from "./src/store/unitSlice";
import { AuthProvider } from "./src/context/AuthContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const reducer = combineReducers({
  theme: themeReducer,
  unit: unitSlice,
});

const store = configureStore({ reducer });

export default function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <AuthNavigation />
        </GestureHandlerRootView>
      </AuthProvider>
    </Provider>
  );
}
