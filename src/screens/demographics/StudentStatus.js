import { useEffect, useState } from "react";
import {
  Text,
  View,
  TouchableWithoutFeedback,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
} from "react-native";
import { useTheme } from "@react-navigation/native";

export function StudentStatus({ navigation, route }) {
  const [student, setStudent] = useState("");
  const { colors } = useTheme()
  let user = route.params.user


  function nextScreen() {
     // Pass user to next screen with selected student
    user.student_status = student

    navigation.navigate("Employment Status", {user: user})
  }

  return (

    <ScrollView showsVerticalScrollIndicator={false}>

    <View style={styles.container}>
    <TouchableWithoutFeedback onPress={() => setStudent("Part Time")}>
        <View style={{backgroundColor: colors.card, borderWidth: 1, borderColor: student === "Part Time" ? colors.primary : colors.card, padding: 10, borderRadius: 10, flexDirection: "row", justifyContent: "space-between", paddingVertical: 20}}>
          <Text style={{color: colors.text}}>Part Time</Text>
            {student === "Part Time" 
              ? <View style={{backgroundColor: "#5468ff", height: 20, width: 20, borderRadius: 20}}/>
              : <View style={{borderWidth: 1, borderColor: "gray", height: 20, width: 20, borderRadius: 20}}/>
            }
        </View>
      </TouchableWithoutFeedback>

      <View style={{margin: 5}} />

      <TouchableWithoutFeedback onPress={() => setStudent("Full Time")}>
        <View style={{backgroundColor: colors.card, borderWidth: 1, borderColor: student === "Full Time" ? colors.primary : colors.card, padding: 10, borderRadius: 10, flexDirection: "row", justifyContent: "space-between", paddingVertical: 20}}>
          <Text style={{color: colors.text}}>Full Time</Text>
            {student === "Full Time" 
              ? <View style={{backgroundColor: "#5468ff", height: 20, width: 20, borderRadius: 20}}/>
              : <View style={{borderWidth: 1, borderColor: "gray", height: 20, width: 20, borderRadius: 20}}/>
            }
        </View>
      </TouchableWithoutFeedback>

      <View style={{margin: 5}} />

      <TouchableWithoutFeedback onPress={() => setStudent("Not Student")}>
        <View style={{backgroundColor: colors.card, borderWidth: 1, borderColor: student === "Not Student" ? colors.primary : colors.card, padding: 10, borderRadius: 10, flexDirection: "row", justifyContent: "space-between", paddingVertical: 20}}>
          <Text style={{color: colors.text}}>Not A Student</Text>
            {student === "Not Student" 
              ? <View style={{backgroundColor: "#5468ff", height: 20, width: 20, borderRadius: 20}}/>
              : <View style={{borderWidth: 1, borderColor: "gray", height: 20, width: 20, borderRadius: 20}}/>
            }
        </View>
      </TouchableWithoutFeedback>

      <View style={{marginVertical: 20}} />

      <TouchableOpacity onPress={nextScreen}
        style={{borderRadius: 10, height: 50, backgroundColor: "#5468ff", justifyContent: "center", alignItems: "center"}}>
        <Text style={{color: "white"}}>Next</Text>
      </TouchableOpacity>
    </View>

    </ScrollView>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingBottom: 60
  },
});
