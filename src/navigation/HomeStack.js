import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { HomeScreen } from "../screens/home/HomeScreen";
import { MoodStack } from "./MoodStack";
import { ChecklistStack } from "./ChecklistStack";
import { GoalStack } from "./GoalStack";
import { JournalStack} from "./JournalStack"
import { TrendStack } from "./TrendStack";
import { AchievementsScreen } from "../screens/home/AchievementsScreen";
import { ActivitiesStack } from "./ActivitiesStack";
import EditWidgetScreen from "../screens/home/EditWidgetScreen";
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { useTheme } from "@react-navigation/native";
import { SettingsStack } from "./SettingsStack";

export function HomeStack({ navigation, route}) {

  React.useLayoutEffect(() => {
    const routeName = getFocusedRouteNameFromRoute(route);
    if (routeName === "Chat Screen"){
        navigation.setOptions({tabBarStyle: {display: 'none'}});
    }else {
        navigation.setOptions({tabBarStyle: {display: 'flex'}});
    }
  }, [navigation, route]);

  const Stack = createStackNavigator();

  const { colors } = useTheme()

  return (
    <Stack.Navigator initialRouteName="HomeHome">
      <Stack.Screen
        name="HomeHome"
        component={HomeScreen}
        options={{ title: "Home"}}
      />

      <Stack.Screen
        name="Profile"
        component={SettingsStack}
        options={{title: "Settings",  headerBackTitleVisible: false}}
      />
      <Stack.Screen
        name="EditWidgets"
        component={EditWidgetScreen}
        options={{ title: "Edit Widgets" }}
      />
      <Stack.Screen
        name="Mood"
        component={MoodStack}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Checklist"
        component={ChecklistStack}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Goal"
        component={GoalStack}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Journal"
        component={JournalStack}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Activities"
        component={ActivitiesStack}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Achievements"
        component={AchievementsScreen}
        options={{ headerBackTitleVisible: false, headerTintColor: colors.text }}
      />

      <Stack.Screen
        name="Trend"
        component={TrendStack}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
