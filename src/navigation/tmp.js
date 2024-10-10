import { ActivityListScreen } from "../screens/activities/ActivityListScreen";
import { CompleteActivityScreen } from "../screens/activities/CompleteActivityScreen";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator()

export function ActivitiesStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ActivitiesScreen"
        component={ActivityListScreen}
        options={{headerShown: false}}
      />

      <Stack.Screen 
        name="CompleteActivity"
        component={CompleteActivityScreen}
        options={({ route }) => ({ title: route.params.title })}
      />

    </Stack.Navigator>
  );
}