import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { ActivitiesScreen } from "../screens/activities/ActvitiesScreen";
import { ArticleListScreen } from "../screens/activities/ArticleListScreen";
import { ReadArticleScreen } from "../screens/activities/ReadArticleScreen";
import { PlayAudioScreen } from "../screens/activities/PlayAudioScreen";
import { useTheme } from "@react-navigation/native";
import { CompleteActivityScreen } from "../screens/activities/CompleteActivityScreen"
import { AudioListScreen } from "../screens/activities/AudioListScreen";
import { ExerciseListScreen } from "../screens/activities/ExerciseListScreen"

export function ActivitiesStack() {

  const { colors } = useTheme()

  //prompts history trends settings
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator>
        <Stack.Screen name="Activities" component={ActivitiesScreen}  options={{title: "Activities",  headerBackTitleVisible: false, headerTintColor: colors.text}} />
        <Stack.Screen name="Exercises" component={ExerciseListScreen} options={{title: "Cognitive Exercises",  headerBackTitleVisible: false, headerTintColor: colors.text}}/>
        <Stack.Screen name="Complete Exercise" component={CompleteActivityScreen} options={({ route }) => ({ title: route.params.title, headerTintColor: colors.text, headerBackTitleVisible: false })} />
        <Stack.Screen name="Articles" component={ArticleListScreen} options={{title: "Wellness Articles", headerBackTitleVisible: false, headerTintColor: colors.text}}/>
        <Stack.Screen name="Medidations" component={AudioListScreen} options={{title: "Mindful Meditations", headerBackTitleVisible: false, headerTintColor: colors.text}} />
        <Stack.Screen name="Play Audio" component={PlayAudioScreen} options={{headerTitle: false,  headerBackTitleVisible: false, headerTintColor: colors.text}}/>
        <Stack.Screen name="Read Article" component={ReadArticleScreen} options={{headerTitle: false,  headerBackTitleVisible: false, headerTintColor: colors.text}}/>
    </Stack.Navigator>
  );
}
