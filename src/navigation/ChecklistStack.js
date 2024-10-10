import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { ChecklistScreen } from "../screens/checklist/ChecklistScreen";
import { CompletedChecklistScreen } from "../screens/checklist/CompletedChecklistScreen";
import { CreateChecklistScreen } from "../screens/checklist/CreateChecklistScreen";
import { CreateChecklistItemScreen } from "../screens/checklist/CreateChecklistItemScreen";
import { useTheme } from "@react-navigation/native";

export function ChecklistStack() {
  const Stack = createStackNavigator();

  const { colors } = useTheme()

  return (
    <Stack.Navigator>
      <Stack.Screen name="ChecklistHome" component={ChecklistScreen} options={{title: "Checklist",  headerBackTitleVisible: false}} />
      <Stack.Screen name="Completed Checklist" component={CompletedChecklistScreen} options={{title: "Completed",  headerBackTitleVisible: false}} />
      <Stack.Screen name="Create Checklist" component={CreateChecklistScreen} options={{title: "Create Checklist",  headerBackTitleVisible: false}} />
      <Stack.Screen name="Create Checklist Item" component={CreateChecklistItemScreen} options={{title: "Create",  headerBackTitleVisible: false}} />
    </Stack.Navigator>
  );
}