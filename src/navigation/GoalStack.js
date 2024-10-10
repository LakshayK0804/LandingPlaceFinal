import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import { GoalScreen } from "../screens/goals/GoalScreen";
import { CreateGoalScreen } from "../screens/goals/CreateGoalScreen";
import { CreateRepeatingScreen } from "../screens/goals/CreateRepeatingScreen";
import { CreateActionsScreen } from "../screens/goals/CreateActionsScreen";
import { CompletedGoalScreen } from "../screens/goals/CompletedGoalScreen";
import { ViewRepeatingGoalScreen } from "../screens/goals/ViewRepeatingGoalScreen";
import { ViewActionGoalScreen } from "../screens/goals/ViewActionGoalScreen";
import { useTheme } from "@react-navigation/native";
import { RepeatingGoalStack } from "./RepeatingGoalStack";

const Stack = createStackNavigator();

export function GoalStack({ route }) {

  const { colors } = useTheme()
  
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="GoalHome"
        component={GoalScreen}
        options={{ title: "Goals",  headerBackTitleVisible: false }}
      />
      <Stack.Screen
        name="Create Goal"
        component={CreateGoalScreen}
        options={{ title: "Create Goal",  headerBackTitleVisible: false }}
      />
      <Stack.Screen
        name="Create Repeating Goal"
        component={CreateRepeatingScreen}
        options={{ title: "Create Goal",  headerBackTitleVisible: false }}
        />
        <Stack.Screen
        name="Create Actions Goal"
        component={CreateActionsScreen}
        options={{ title: "Create Goal",  headerBackTitleVisible: false }}
        />
      <Stack.Screen
        name="Completed Goal"
        component={CompletedGoalScreen}
        options={{ title: "Completed Goals",  headerBackTitleVisible: false }}
      />
      <Stack.Screen
        name="View Repeating Goal"
        component={RepeatingGoalStack}
        options={({ route }) => ({ title: route.params.name,  headerBackTitleVisible: false })}
      />
      <Stack.Screen
        name="View Action Goal"
        component={ViewActionGoalScreen}
        options={({ route }) => ({title: route.params.name,  headerBackTitleVisible: false })}
      />
    </Stack.Navigator>
  );
}
