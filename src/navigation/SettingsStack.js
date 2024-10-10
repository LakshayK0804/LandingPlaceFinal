import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { SettingsScreen } from "../screens/settings/SettingsScreen"
import { EditAvatarScreen } from "../screens/settings/EditAvatarScreen";
import { BugReport } from "../screens/settings/BugReport";
import { Feedback } from "../screens/settings/Feedback";
import { AboutScreen } from "../screens/settings/AboutScreen";
import {ColorPicker} from "../screens/settings/ColorPicker";

export function SettingsStack() {
    const Stack = createStackNavigator();

    return (
        <Stack.Navigator>
            <Stack.Screen name="Settings Home" component={SettingsScreen} options={{title: "Settings",  headerBackTitleVisible: false}}/>
            <Stack.Screen name="Edit Avatar" component={EditAvatarScreen} options={{title: "Edit Avatar",  headerBackTitleVisible: false}}/>
            <Stack.Screen name={"Color Picker"} component={ColorPicker} options={{title: "Select Color", headerBackTitleVisible: false}}/>
            <Stack.Screen name="Report Bug" component={BugReport} options={{title: "Report Bug",  headerBackTitleVisible: false}}/>
            <Stack.Screen name="Feedback" component={Feedback} options={{title: "Give Feedback",  headerBackTitleVisible: false}}/>
            <Stack.Screen name="About Screen" component={AboutScreen} options={{title: "About", headerBackTitleVisible: false}} />
        </Stack.Navigator>
    );
}
