import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import { JournalScreen } from "../screens/journal/JournalScreen";
import { WriteScreen } from "../screens/journal/WriteScreen"
import { PromptsScreen } from "../screens/journal/PromptsScreen";
import { HistoryScreen } from "../screens/journal/HistoryScreen";
import { SettingsScreen } from "../screens/journal/SettingsScreen";
import { ChoiceScreen } from "../screens/journal/ChoiceScreen";
import { useTheme } from "@react-navigation/native"

export function JournalStack() {
  //prompts history trends settings
  const Stack = createStackNavigator();
  const { colors } = useTheme()

  return (
    <Stack.Navigator>
      <Stack.Screen name="JournalHome" component={JournalScreen} options={{title: "Journal",  headerBackTitleVisible: false, headerTintColor: colors.text}} />
      <Stack.Screen name="Choice" component={ChoiceScreen} options={{title: "Choose",  headerBackTitleVisible: false, headerTintColor: colors.text}}/>
      <Stack.Screen name="Free Write" component={WriteScreen} options={{title: "Entry",  headerBackTitleVisible: false, headerTintColor: colors.text}}/>
      <Stack.Screen name="Prompts" component={PromptsScreen} options={{title: "Prompts",  headerBackTitleVisible: false, headerTintColor: colors.text}}/>
      <Stack.Screen name="History" component={HistoryScreen} options={{title: "History",  headerBackTitleVisible: false, headerTintColor: colors.text}}/>
      <Stack.Screen name="Settings" component={SettingsScreen} options={{title: "Settings",  headerBackTitleVisible: false, headerTintColor: colors.text}}/>
    </Stack.Navigator>
  );
}
