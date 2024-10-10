import React, { useEffect, useState, useRef } from "react";
import { View, Text, useColorScheme, ActivityIndicator } from "react-native";
import { NavigationContainer, useTheme } from "@react-navigation/native";
import { AppTabs } from "./src/navigation/AppTabs";
import { AuthStack } from "./src/navigation/AuthStack";
import { DemographicStack } from "./src/navigation/DemographicStack";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import { auth } from "./firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import Toast, { BaseToast } from "react-native-toast-message";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Host } from "react-native-portalize";
import { useUserStore } from "./src/stores";
import AchievementListeners from "./src/utils/AchievementListeners";
import { registerForPushNotificationsAsync, sendPushNotification } from "./src/utils/UsePushNotification";
import * as Notifications from "expo-notifications";
import * as Updates from "expo-updates";
import { EXPO_PUBLIC_URL } from "@env";

export default function App() {
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [error, setError] = useState();
    const [userFound, setUserFound] = useState(false);
    const scheme = useColorScheme();

    // Push notification vars
    const [expoPushToken, setExpoPushToken] = useState("");
    const [notification, setNotification] = useState(false);
    const notificationListener = useRef();
    const responseListener = useRef();

    const setUserData = useUserStore((store) => store.setUser);
    const userData = useUserStore((store) => store.user);
    const setStats = useUserStore((store) => store.setStats);
    const setAvatarsvg = useUserStore((store) => store.setAvatarsvg);
    const primaryColor = useUserStore((store) => store.color);

    const { colors } = useTheme();

    const MyTheme = {
        dark: false,
        colors: {
            primary: primaryColor?.length > 0 ? primaryColor : "rgb(84, 104, 255)",
            background: "rgb(242, 242, 242)",
            card: "rgb(255, 255, 255)",
            text: "rgb(28, 28, 30)",
            border: "rgb(55, 55, 55)",
            notification: "rgb(255, 69, 58)",
            input: "rgb(36, 36, 36)",
        },
    };

    const MyDarkTheme = {
        dark: true,
        colors: {
            primary: primaryColor?.length > 0 ? primaryColor : "rgb(84, 104, 255)",
            background: "rgb(1, 1, 1)",
            card: "rgb(28, 28, 30)",
            text: "rgb(299, 299, 231)",
            border: "rgb(50, 50, 50)",
            notification: "rgb(255, 69, 58)",
            input: "rgb(36, 36, 36)",
        },
    };

    // Gets user data from server on mount
    useEffect(() => {
        console.log("App useEffect1");
        // Get user from firebase
        isUser();
        console.log("user", user, "userData", userData);

        // Setup push notifications
        registerForPushNotificationsAsync().then((token) => setExpoPushToken(token));

        notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
            setNotification(notification);
        });

        responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
            console.log("response", response);
        });

        return () => {
            Notifications.removeNotificationSubscription(notificationListener.current);
            Notifications.removeNotificationSubscription(responseListener.current);
        };
    }, []);

    async function getUserData() {
        console.log("getUserData");
        setIsLoading(true);

        const idToken = await auth.currentUser?.getIdToken();
        console.log("idtoken:", idToken);

        console.log("URL:", EXPO_PUBLIC_URL);
        console.log("auth", auth.currentUser);

        await fetch(EXPO_PUBLIC_URL + "/", {
            headers: {
                Authorization: "Bearer " + idToken,
            },
        })
            .then((response) => {
                if (response.ok) {
                    console.log("ok");
                    return response.json();
                } else if (response.status === 404) {
                    setUserFound(false);
                    console.error("user not found");
                    throw new Error("404");
                } else {
                    console.error("error");
                    throw new Error();
                }
            })
            .then((data) => {
                setUserData(data[0]);
                // total_journal: 0, total_journal_prompt: 0, total_mood: 0, total_checklist: 0, total_checklist_completed: 0, total_goal: 0, total_goal_completed: 0
                const stats = {
                    total_journal: data[0].total_journal,
                    total_journal_prompt: data[0].total_journal_prompt,
                    total_mood: data[0].total_mood,
                    total_checklist: data[0].total_checklist_created,
                    total_checklist_completed: data[0].total_checklist_completed,
                    total_goal: data[0].total_goal_created,
                    total_goal_completed: data[0].total_goal_completed,
                };
                setStats(stats);
                setAvatarsvg(data[0].avatar_svg);
            })
            .catch((error) => {
                setError(true);
                Toast.show({
                    type: "error",
                    text1: "Error",
                    text2: "Failed to fetch user data. Please try again later.",
                });
            });

        setIsLoading(false);
    }

    async function isUser() {
        console.log("isUser: Start");
        onAuthStateChanged(auth, (user) => {
            console.log("isUser: Auth state changed");
            if (user) {
                getUserData();
                setUser(true);
            } else {
                console.log("isUser: No user");
                setUser(false);
                setIsLoading(false);
            }
        });
        console.log("isUser: End");
    }

    // TODO: return the splash screen
    if (isLoading) {
        return (
            <View
                style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.background }}
            >
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    function setToastConfig() {
        console.log("setToastConfig");
        const { colors } = useTheme();

        console.log("color ", colors.card);

        const tConfig = {
            success: (props) => (
                <BaseToast
                    {...props}
                    style={{ borderLeftColor: "green" }}
                    // contentContainerStyle={{  }}
                    text1Style={{
                        fontSize: 18,
                        fontWeight: "bold",
                        color: colors.text,
                    }}
                    text2Style={{
                        fontSize: 14,
                        color: colors.text,
                    }}
                />
            ),

            error: (props) => (
                <BaseToast
                    {...props}
                    style={{ borderLeftColor: "red", backgroundColor: colors.card }}
                    text1Style={{
                        fontSize: 20,
                    }}
                    text2Style={{
                        fontSize: 20,
                    }}
                    text2NumberOfLines={2}
                />
            ),

            // Text1 = Title of achievement
            // Text2 = Name of icon
            achievement: ({ text1, text2 }) => (
                <View
                    style={{
                        height: 60,
                        width: "80%",
                        backgroundColor: colors.background,
                        borderRadius: 10,
                        flexDirection: "row",
                        alignItems: "center",
                        paddingHorizontal: 20,
                    }}
                >
                    <Ionicons name={"medal"} size={30} color={colors.text} />
                    <Text
                        style={{
                            color: colors.text,
                            marginLeft: -30,
                            flex: 1,
                            textAlign: "center",
                            fontWeight: "bold",
                        }}
                    >
                        {text1}
                    </Text>
                </View>
            ),
        };

        return tConfig;
    }

    const renderNavigation = () => {
        if (user) {
            console.log("yes user");
            console.log("user", user);
            if (userData === undefined) {
                console.log("userData undefined");
                //return isLoading ? null : <DemographicStack />;
                if (isLoading) {
                    console.log("yes isLoading");
                    return null;
                } else {
                    console.log("no isLoading");
                    return <DemographicStack />;
                }
            } else {
                console.log("userData defined");
                return (
                    <>
                        <AchievementListeners />
                        <AppTabs />
                    </>
                );
            }
        } else {
            console.log("no user");
            return <AuthStack />;
        }
    };

    return (
        <ActionSheetProvider>
            <Host>
                <NavigationContainer theme={scheme === "dark" ? MyDarkTheme : MyTheme}>
                    {renderNavigation()}
                    <Toast config={setToastConfig()} />
                </NavigationContainer>
            </Host>
        </ActionSheetProvider>
    );
}
