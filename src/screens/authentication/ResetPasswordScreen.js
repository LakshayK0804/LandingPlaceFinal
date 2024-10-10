import {
    Text,
    ScrollView,
    TextInput,
    ActivityIndicator,
    TouchableWithoutFeedback,
    View,
    StyleSheet,
} from "react-native";
import { useState } from "react";
import { useTheme } from "@react-navigation/native";
import { auth } from "../../../firebaseConfig";
import { sendPasswordResetEmail } from "firebase/auth";

export function ResetPasswordScreen({ navigation }) {
    const { colors } = useTheme();

    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorText, setErrorText] = useState("");

    async function handleEnterEmail() {
        if (email?.length === 0) {
            return;
        }
        setLoading(true);
        sendPasswordResetEmail(auth, email)
            .then(() => {
                Alert.alert("Password Reset Link Sent", "Please check your email for the link.");
            })
            .catch((error) => {
                Alert.alert("Password reset failed", error.message);
            });
        navigation.navigate("Login");
    }

    return (
        <ScrollView
            keyboardDismissMode={Platform.OS === "ios" ? "interactive" : "on-drag"}
            keyboardShouldPersistTaps={"handled"}
        >
            <View style={styles.container}>
                <View style={styles.space} />
                <View style={{ slignItems: "center" }}>
                    <View style={{ marginVertical: 5 }} />
                    <Text
                        style={{
                            color: colors.text,
                            fontSize: 15,
                            opacity: 0.6,
                        }}
                    >
                        Please enter your email to receive a password reset link
                    </Text>
                </View>
                <View style={{ marginVertical: 30 }} />
                <View
                    style={{
                        borderRadius: 10,
                        backgroundColor: colors.card,
                        paddingHorizontal: 10,
                        marginBottom: 10,
                    }}
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
                <View style={styles.space} />
                <View>
                    <Text style={{ color: colors.notification, textAlign: "center" }}>{errorText}</Text>
                </View>
                <View style={styles.space} />
                <TouchableWithoutFeedback onPress={handleEnterEmail} disabled={loading}>
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
    space: {
        margin: 10,
    },
    logo: {
        height: 300,
        width: "100%",
        alignSelf: "center",
    },
});
