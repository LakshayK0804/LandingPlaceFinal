import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { ViewRepeatingGoalScreen } from '../screens/goals/ViewRepeatingGoalScreen';
import { RepeatingLogsScreen } from '../screens/goals/RepeatingLogsScreen';
import { RepeatingEditScreen } from '../screens/goals/RepeatingEditScreen';

const Tab = createMaterialTopTabNavigator();

export function RepeatingGoalStack({ route }) {

  return (
    // <GoalContext.Provider value={route.params.goal}>
      <Tab.Navigator>
        <Tab.Screen name="Repeating Home" component={ViewRepeatingGoalScreen} options={{title: "Calendar"}} initialParams={{ goal: route.params.goal }}/>
        <Tab.Screen name="Repeating Logs" component={RepeatingLogsScreen} options={{title: "Logs"}} initialParams={{ goal: route.params.goal }}/>
        <Tab.Screen name="Repeating Edit" component={RepeatingEditScreen} options={{title: "Edit"}} initialParams={{ goal: route.params.goal }}/>
      </Tab.Navigator>
    // </GoalContext.Provider>
  );
}