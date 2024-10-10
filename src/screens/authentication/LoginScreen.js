import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Platform,
    ScrollView,
    TextInput,
    ActivityIndicator,
    TouchableWithoutFeedback,
} from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../firebaseConfig";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTheme } from "@react-navigation/native";
import showToast from "../../utils/DisplayToast";
import { useUserStore } from "../../stores";
import AchievementListeners from "../../utils/AchievementListeners";
import { AppTabs } from "../../navigation/AppTabs";
import { AuthStack } from "../../navigation/AuthStack";

export function LoginScreen({ navigation }) {
    const { colors } = useTheme();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [hiddenPassword, setHiddenPassword] = useState(true);
    const [loading, setLoading] = useState(false);
    const [errorText, setErrorText] = useState("");
    const [loggedIn, setLoggedIn] = useState(false);

    async function handleLogin() {
        if (email?.length === 0 || password?.length === 0) {
            return;
        }
        setLoading(true);
        signInWithEmailAndPassword(auth, email, password)
            .catch((error) => {
                if (error.code === "auth/invalid-email") setErrorText("Please enter a valid email");
                else if (error.code === "auth/user-not-found" || "auth/wrong-password")
                    setErrorText("Incorrect Email/Password Combination");
                else if (error.code === "auth/too-many-requests")
                    setErrorText("Maximum Login Attempts Exceeded: Reset Password Or Try Again Later");
            })
            .finally(() => setLoading(false));
    }

    return (
        <ScrollView
            keyboardDismissMode={Platform.OS === "ios" ? "interactive" : "on-drag"}
            keyboardShouldPersistTaps={"handled"}
        >
            <View style={styles.container}>
                <View style={{ margin: 10 }} />

                <View style={{ alignItems: "center" }}>
                    <Text style={{ color: colors.text, fontSize: 25 }}>Welcome</Text>
                    <View style={{ marginVertical: 5 }} />
                    <Text style={{ color: colors.text, fontSize: 15, opacity: 0.6 }}>
                        Please sign into your account
                    </Text>
                </View>

                <View style={{ marginVertical: 30 }} />

                <View
                    style={{ borderRadius: 10, backgroundColor: colors.card, paddingHorizontal: 10, marginBottom: 10 }}
                >
                    <TextInput
                        placeholder="Email"
                        placeholderTextColor={"gray"}
                        keyboardType="email-address"
                        style={{ paddingVertical: 20 }}
                        autoCorrect={false}
                        color={colors.text}
                        onChangeText={(txt) => setEmail(txt)}
                        autoCapitalize="none"
                    />
                </View>

                <View
                    style={{
                        borderRadius: 10,
                        backgroundColor: colors.card,
                        paddingHorizontal: 10,
                        marginBottom: 10,
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <TextInput
                        placeholder="Password"
                        placeholderTextColor={"gray"}
                        secureTextEntry={hiddenPassword}
                        autoCorrect={false}
                        style={{ paddingVertical: 20, flexGrow: 1 }}
                        color={colors.text}
                        onChangeText={(txt) => setPassword(txt)}
                    />
                    <TouchableOpacity onPress={() => setHiddenPassword(!hiddenPassword)}>
                        <Ionicons name="eye-outline" color={"gray"} size={25} style={{ marginRight: 20 }} />
                    </TouchableOpacity>
                </View>

                <TouchableWithoutFeedback onPress={() => navigation.navigate("ResetPassword")}>
                    <Text style={{ alignSelf: "flex-end", opacity: 0.6, color: colors.primary }}>Forgot Password?</Text>
                </TouchableWithoutFeedback>

                <View style={{ margin: 10 }} />

                <View>
                    <Text style={{ color: colors.notification, textAlign: "center" }}>{errorText}</Text>
                </View>

                <View style={{ margin: 10 }} />

                <TouchableWithoutFeedback onPress={handleLogin} disabled={loading}>
                    <View
                        style={{
                            borderRadius: 10,
                            height: 50,
                            backgroundColor: colors.primary,
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        {loading ? (
                            <ActivityIndicator color={colors.text} />
                        ) : (
                            <Text style={{ color: "white" }}>Sign In</Text>
                        )}
                    </View>
                </TouchableWithoutFeedback>

                <View style={{ margin: 20 }} />

                <View style={{ flexDirection: "row", justifyContent: "center" }}>
                    <Text style={{ color: colors.text }}>Need an account? </Text>
                    <Text style={{ color: colors.primary }} onPress={() => navigation.navigate("Register")}>
                        Sign up
                    </Text>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        marginTop: 50,
    },
    logo: {
        height: 300,
        width: "100%",
        alignSelf: "center",
    },
});
