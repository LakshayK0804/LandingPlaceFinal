import { useState } from "react"
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator} from "react-native"
import { auth } from "../../../firebaseConfig"
import { useTheme } from "@react-navigation/native"
import { StackActions } from '@react-navigation/native';
import showToast from "../../utils/DisplayToast";
import { EXPO_PUBLIC_URL } from "@env"

export function BugReport({ navigation }) {

    const { colors } = useTheme()
    const [text, setText] = useState("")
    const [loading, setLoading] = useState(false)

    async function submit() {

        setLoading(true)
        const idToken = await auth.currentUser?.getIdToken()

        await fetch(EXPO_PUBLIC_URL + "/bug-report", {
            method: "POST",  
            headers: {
                    "Authorization": "Bearer " + idToken,
                    "Content-Type": "application/json"
                },
            body: JSON.stringify({text: text})
        })
        .then((response) => {
            if (response.ok) {
                navigation.dispatch(StackActions.popToTop());
                showToast("success", "Thank You For Your Feedback!")
            }
            else {
                throw new Error(response.status)
            }
        })
        .catch((error) => alert("Network Error: " + error))

        setLoading(false)
        
    }

    return (
        <View style={styles.container}>

            <View style={styles.contentContainer}>

                <TextInput 
                    placeholder="Type Here"
                    placeholderTextColor={"gray"}
                    style={{color: colors.text, height: 200, backgroundColor: colors.card, borderRadius: 10, padding: 10, textAlignVertical: "top"}}
                    onChangeText={(txt) => setText(txt)}
                    multiline
                    maxLength={240}
                />

                <Text style={{color: "gray", alignSelf: "flex-end"}}>{text?.length}/280</Text>

            </View>

            <View style={{margin: 20}} />

            <TouchableOpacity onPress={submit} style={{borderRadius: 10, height: 50, backgroundColor: colors.primary, justifyContent: "center", alignItems: "center"}}>
                <Text style={{color: "white"}}>{loading ? <ActivityIndicator /> : "Submit"}</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 40
    },
    contentContainer: {
        
    }
})