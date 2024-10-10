import { View, Text, StyleSheet, TouchableOpacity} from "react-native";
import { useTheme} from "@react-navigation/native";

export function ColorPicker() {

    const { colors } = useTheme()

    return (
        <View>
            <Text style={{color: colors.text}}>COLOR PICKER</Text>

            <TouchableOpacity style={{backgroundColor: colors.card}}>
                <Text style={{color: colors.text}}>Color</Text>
            </TouchableOpacity>
        </View>
    )
}