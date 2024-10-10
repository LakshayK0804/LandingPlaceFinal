import { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Image, ScrollView, KeyboardAvoidingView } from "react-native"
import { useTheme } from "@react-navigation/native"
import Ionicons from "@expo/vector-icons/Ionicons";

export function CreateGoalScreen({ navigation }) {

  const { colors } = useTheme()

  const [selection, setSelection] = useState(0)
  const screen = ["Create Repeating Goal", "Create Actions Goal"]

  return (
    <View style={styles.container} >
      <ScrollView>
        <TouchableWithoutFeedback onPress={() => setSelection(0)}>
          <View style={[styles.topButton, {backgroundColor: colors.card, borderColor: colors.border}]}>
            <View>
              <Text style={{color: colors.text, fontSize: 18, marginBottom: 5}}>Repeating Goal</Text>
              <Text style={{color: colors.text, opacity: 0.5}}>Single actions to be repeated</Text>
            </View>
            <Ionicons name={"checkmark"} size={26} style={{color: selection == 0 ? colors.text : colors.card}} />
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={() => setSelection(1)}>
          <View style={[styles.bottomButton, {backgroundColor: colors.card, borderColor: colors.border}]}>
            <View>
              <Text style={{color: colors.text, fontSize: 18, marginBottom: 5}}>Actions</Text>
              <Text style={{color: colors.text, opacity: 0.5}}>Define steps to reach goal</Text>
            </View>
            <Ionicons name={"checkmark"} size={26} style={{color: selection == 1 ? colors.text : colors.card}} />
          </View>
        </TouchableWithoutFeedback>
        <View style={{marginBottom: 10}} />
        {/* Render the example image */}
        <View style={{alignItems: "center"}}>
          <Image source={selection === 0 ? require("../../../assets/goal-examples/repeating.jpeg") : require("../../../assets/goal-examples/actions.jpeg") } style={{width: 300, height: 450, marginTop: 10, resizeMode: "contain", }} />
        </View>
        {/* End render image */}
        <View style={{marginBottom: 20}} />
        { selection != -1 && (
          <TouchableOpacity onPress={() => navigation.navigate(screen[selection])} style={{backgroundColor: "#5468ff", borderRadius: 10, height: 50, justifyContent: "center", alignItems: "center"}} >
            <Text style={{color: "white"}}>Continue</Text>
          </TouchableOpacity>
        )}   
        <View style={{marginBottom: 20}} />
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
  },
  topButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 20,
    borderWidth: 1,
    alignItems: "center",
  },
  middleButton: {
      flexDirection: "row",
      justifyContent: "space-between",
      padding: 20,
      borderWidth: 1,
      alignItems: "center"
  },
  bottomButton: {
      flexDirection: "row",
      justifyContent: "space-between",
      borderBottomLeftRadius: 10,
      borderBottomRightRadius: 10,
      borderWidth: 1,
      padding: 20,
      alignItems: "center"
  },

  standaloneButton: {
      flexDirection: "row",
      justifyContent: "space-between",
      borderRadius: 10,
      padding: 10
  },
})