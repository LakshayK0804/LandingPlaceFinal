import React from "react";
import { Image } from "react-native"
import { createStackNavigator } from "@react-navigation/stack";
import { MoodEntryScreen } from "../screens/mood/MoodEntryScreen";
import { MoodScreen } from "../screens/mood/MoodScreen";
import { useTheme } from "@react-navigation/native"

function MoodEntryHeader({ mood }) {

  const moodMap = {
    0: {
      url: require("../../assets/emotions/face-great.png"),
      tintColor: "green"
    },
    1: {
      url: require("../../assets/emotions/face-good.png"),
      tintColor: "aqua"
    },
    2: {
      url: require("../../assets/emotions/face-neutral.png"),
      tintColor: "yellow"
    },
    3: {
      url: require("../../assets/emotions/face-bad.png"),
      tintColor: "orange"
    },
    4: {
      url: require("../../assets/emotions/face-terrible.png"),
      tintColor: "red"
    },
  }

  const img = moodMap[mood]?.url
  const tintColor = moodMap[mood]?.tintColor

  return (
    <Image source={img} style={{height: 40, width: 40}} tintColor={tintColor} />
  )
}

export function MoodStack() {
  const Stack = createStackNavigator();

  const { colors } = useTheme()

  // const emotionMap = {
  //   0: ""
  // }



  return (
    <Stack.Navigator>
      <Stack.Screen name="Mood Home" component={MoodScreen} options={{title: "Mood",  headerBackTitleVisible: false}}/>
      <Stack.Screen name="Mood Entry" component={MoodEntryScreen} options={({ route })  => ({title: <MoodEntryHeader mood={route.params.mood}/>, headerBackTitleVisible: false})}/>
    </Stack.Navigator>
  );
}
