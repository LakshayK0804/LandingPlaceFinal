import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";
import { HomeStack } from "./HomeStack";
import { ChatStack } from "./ChatStack"
import { useTheme } from "@react-navigation/native";
import { SettingsStack } from "./SettingsStack";

const Tab = createBottomTabNavigator();

export const AppTabs = () => {
  
  const { colors } = useTheme()

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, size }) => {
          let iconName, color;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
            // color = focused ? colors.primary : colors.text
          } else if (route.name === "Library") {
            iconName = focused ? "library" : "library-outline";
            // color = focused ? colors.primary : colors.text
          } else if (route.name === "Chat") {
            iconName = focused ? "chatbubble" : "chatbubble-outline";
            // color = focused ? colors.primary : colors.text
          } else if (route.name === "Settings") {
            iconName = focused ? "settings" : "settings-outline";
            // color = focused ? colors.primary : colors.text
          }

          // You can return any component that you like here!
          return (
            <Ionicons
              name={iconName}
              size={size}
              color={colors.text}
            />
          );
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{ headerShown: false, tabBarShowLabel: false }}
      />
      <Tab.Screen
        name="Chat"
        component={ChatStack}
        options={{ headerShown: false, tabBarShowLabel: false }}        
      />
      <Tab.Screen
        name="Settings"
        component={SettingsStack}
        options={{ headerShown: false, tabBarShowLabel: false }}
      />

    </Tab.Navigator>
  );
};
