import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Platform,
    ActivityIndicator,
    TouchableWithoutFeedback,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import { auth } from "../../../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import Ionicons from "@expo/vector-icons/Ionicons";

export function RegisterScreen({ navigation }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");
    const [loading, setLoading] = useState(false);
    const [hiddenPassword, setHiddenPassword] = useState(true);
    const [errorText, setErrorText] = useState("");
    const { colors } = useTheme();

    async function register() {
        // Check if the entered values are valid
        if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
            setErrorText("Please Enter A Valid Email");
            return;
        }

        if (password.length < 6) {
            setErrorText("Password Must Be At Least Six Characters");
            return;
        }

        if (password !== password2) {
            setErrorText("Passwords Do Not Match");
            return;
        }

        console.log("loading");

        setLoading(true);

        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {})
            .catch((error) => {
                alert(error);
                setLoading(false);
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
                    <Text style={{ color: colors.text, fontSize: 25 }}>Create new account</Text>
                    <View style={{ marginVertical: 5 }} />
                    <Text style={{ color: colors.text, fontSize: 15, opacity: 0.6 }}>Fill out form to continue</Text>
                </View>

                <View style={{ marginVertical: 30 }} />

                <View
                    style={{ borderRadius: 10, backgroundColor: colors.card, paddingHorizontal: 10, marginBottom: 10 }}
                >
                    <TextInput
                        placeholder="Email"
                        placeholderTextColor={"gray"}
                        keyboardType="email-address"
                        autoCorrect={false}
                        style={{ paddingVertical: 20 }}
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
                        autoCapitalize="none"
                    />
                    <TouchableOpacity onPress={() => setHiddenPassword(!hiddenPassword)}>
                        <Ionicons name="eye-outline" color={"gray"} size={25} style={{ marginRight: 20 }} />
                    </TouchableOpacity>
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
                        placeholder="Confirm Password"
                        placeholderTextColor={"gray"}
                        secureTextEntry={hiddenPassword}
                        autoCorrect={false}
                        style={{ paddingVertical: 20, flexGrow: 1 }}
                        color={colors.text}
                        onChangeText={(txt) => setPassword2(txt)}
                        autoCapitalize="none"
                    />
                    <TouchableOpacity onPress={() => setHiddenPassword(!hiddenPassword)}>
                        <Ionicons name="eye-outline" color={"gray"} size={25} style={{ marginRight: 20 }} />
                    </TouchableOpacity>
                </View>

                <View style={{ margin: 10 }} />

                <Text style={{ color: colors.notification, textAlign: "center" }}>{errorText}</Text>

                <View style={{ margin: 10 }} />

                <TouchableWithoutFeedback onPress={register} disabled={loading}>
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
                            <ActivityIndicator color={colors.text} style={{ alignSelf: "center" }} />
                        ) : (
                            <Text style={{ color: colors.text }}>Sign Up</Text>
                        )}
                    </View>
                </TouchableWithoutFeedback>

                <View style={{ margin: 20 }} />

                <View style={{ flexDirection: "row", justifyContent: "center" }}>
                    <Text style={{ color: colors.text }}>Have an account? </Text>
                    <Text style={{ color: colors.primary }} onPress={() => navigation.navigate("Login")}>
                        Sign In
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
});
