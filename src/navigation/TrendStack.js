import React, { useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { TrendScreen } from "../screens/trends/TrendScreen";
import { useTheme } from "@react-navigation/native";

export function TrendStack() {

  const { colors } = useTheme()

  const Stack = createStackNavigator();
  return (
    <Stack.Navigator>
      <Stack.Screen name="TrendHome" component={TrendScreen} options={{ title: "Trends", headerTintColor: colors.text, headerBackTitleVisible: false }}/>
    </Stack.Navigator>
  );
}
