import { View, Text, StyleSheet } from "react-native"
import { useTheme } from "@react-navigation/native"

export function MeditationListScreen() {

    const { colors } = useTheme()

    return (
        <View style={styles.container}>

            <Text style={{color: colors.text}}>Meditation List Screen</Text>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})