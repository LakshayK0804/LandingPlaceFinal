import { createStackNavigator } from "@react-navigation/stack";
import { LoginScreen } from "../screens/authentication/LoginScreen";
import { RegisterScreen } from "../screens/authentication/RegisterScreen";
import { ResetPasswordScreen } from "../screens/authentication/ResetPasswordScreen";

const Stack = createStackNavigator();

export const AuthStack = () => {
    console.log("AuthStack");

    return (
        <Stack.Navigator>
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />

            <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />

            <Stack.Screen
                name="ResetPassword"
                component={ResetPasswordScreen}
                options={{ title: "Reset Password", headerShown: false }}
            />
        </Stack.Navigator>
    );
};
