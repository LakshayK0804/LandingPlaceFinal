import {TouchableOpacity, View, Text, StyleSheet, ScrollView } from "react-native"
import { useTheme } from "@react-navigation/native"

export function ChoiceScreen({ navigation }) {

    const { colors } = useTheme()

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <TouchableOpacity onPress={() => navigation.navigate("Free Write", {title: "", body: "", isPrompt: 0, isEdit: false, uuid: ""})}>
                <View style={[styles.button, {backgroundColor: colors.card}]}>
                    <Text style={{color: colors.text, fontSize: 20}}>Speak Your Mind</Text>
                </View>
            </TouchableOpacity>

            <Text style={{color: colors.text, fontSize: 20}}>OR</Text>

            <TouchableOpacity onPress={() => navigation.navigate("Prompts")}>
                <View style={[styles.button, {backgroundColor: colors.card}]}>
                    <Text style={{color: colors.text, fontSize: 20}}>Choose From Our Prompts</Text>
                </View>
            </TouchableOpacity>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    button: {
        height: 200,
        width: 300,
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 80,
        borderRadius: 20
    },
})