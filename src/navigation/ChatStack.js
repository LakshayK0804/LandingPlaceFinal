import { useLayoutEffect } from "react";
import { Image, View } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { ChatHomeScreen } from "../screens/chat/ChatHomeScreen";
import { ChatScreen } from "../screens/chat/ChatScreen";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { useTheme } from "@react-navigation/native"
import AvatarSvg from "../components/AvatarSvg";
import { SvgXml } from 'react-native-svg';
import { useUserStore } from "../stores";

export function ChatStack({ navigation, route }) {
  const Stack = createStackNavigator();
  
  const { colors } = useTheme()
  const user = useUserStore((store) => store.user)
  let avatar = useUserStore((store) => store.avatarsvg)

  useLayoutEffect(() => {
    const routeName = getFocusedRouteNameFromRoute(route);
    if (routeName === "Chat Screen") {
      navigation.setOptions({ tabBarStyle: { display: "none" } });
    } else {
      navigation.setOptions({ tabBarStyle: { display: "flex" } });
    }
  }, [navigation, route]);

  console.log("avatar", avatar);

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Chat Home"
        component={ChatHomeScreen}
        options={{ title: "Chats",  headerBackTitleVisible: false, headerTintColor: colors.text }}
      />

      <Stack.Screen
        name="Chat Screen"
        component={ChatScreen}
        options={{
          title: (
            <AvatarSvg />            
          ),
           headerBackTitleVisible: false,
           headerTintColor: colors.text
        }}
        screenOptions={{ tabBarStyle: { display: "none" } }}
      />
    </Stack.Navigator>
  );
}
