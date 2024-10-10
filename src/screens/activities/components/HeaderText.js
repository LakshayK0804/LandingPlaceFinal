import { Text, StyleSheet } from "react-native"
import { useTheme } from "@react-navigation/native"

export default function HeaderText({text}) {

    const { colors } = useTheme()

    return (
        <Text style={[styles.text, {color: colors.text}]}>{text}</Text>
    )
}

const styles = StyleSheet.create({
    text: {
        fontSize: 18,
        marginVertical: 10
    }
})