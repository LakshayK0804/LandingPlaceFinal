import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { useTheme } from "@react-navigation/native"

export function OnboardingScreen({ navigation, route }) {

    const { colors } = useTheme()
    const user = {}

    return (
        <View style={styles.container}>
            <View style={{flex: 1, justifyContent: "center"}}>
                <Text style={{color: colors.text, fontSize: 20, textAlign: "center"}}>We just have a few questions before we get started</Text>
            </View>

            <View style={{flex: 1, justifyContent: "flex-end"}}>
                <TouchableOpacity onPress={() => navigation.navigate("Age", {user: user})} style={styles.button}>
                    <Text style={{color: "white"}}>Ok</Text>
                </TouchableOpacity> 
            </View>
            
        </View>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        padding: 20,
        marginVertical: 50
    },
    button: {
        borderRadius: 10,
        height: 50,
        backgroundColor: "#5468ff",
        justifyContent: "center", 
        alignItems: "center"
    }
})