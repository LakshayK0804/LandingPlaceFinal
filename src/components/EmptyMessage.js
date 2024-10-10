import { Text, View } from "react-native"
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTheme } from "@react-navigation/native"

export function EmptyMessage() {

    const { colors } = useTheme()

    return (
        <View style={{flex: 1, alignItems: "center", justifyContent: "center", opacity: 0.6}}>
            <Text style={{color: colors.text, fontSize: 18}}>Nothing Yet</Text>
            <Text style={{color: colors.text, fontSize: 18}}>Select <Ionicons name="create-outline" size={16} color={colors.text}/> to Start</Text>
        </View>
    )
}
