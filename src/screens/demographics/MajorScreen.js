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

export function MajorScreen({ navigation, route }) {
  const [major, setMajor] = useState("");
  const [customMajor, setCustomMajor] = useState()
  const { colors } = useTheme()
  let user = route.params.user

  function nextScreen() {
     // Pass user to next screen with selected major

    if (major === "Other") {
        user.intended_major = customMajor
    }
    else {
        user.intended_major = major
    }
    //navigation.navigate("Categories", {user: user})
    navigation.navigate("Avatar", {user: user}) //changing for right now because backend not working
  }

  return (

    <ScrollView showsVerticalScrollIndicator={false}>

    <View style={styles.container}>


      <TouchableWithoutFeedback onPress={() => setMajor("Other")}>
        <View style={{backgroundColor: colors.card, borderWidth: 1, borderColor: major === "Other" ? colors.primary : colors.card, padding: 10, borderRadius: 10, flexDirection: "row", justifyContent: "space-between", paddingVertical: 20}}>
          <Text style={{color: colors.text}}>Enter Major</Text>
            {major === "Other" 
              ? <View style={{backgroundColor: "#5468ff", height: 20, width: 20, borderRadius: 20}}/>
              : <View style={{borderWidth: 1, borderColor: "gray", height: 20, width: 20, borderRadius: 20}}/>
            }
        </View>
      </TouchableWithoutFeedback>

      {
        major === "Other" && 
          <TextInput 
            placeholder="Type here"
            style={{paddingHorizontal: 10, paddingVertical: 20, backgroundColor: colors.card, borderRadius: 10}}
            placeholderTextColor={"gray"}
            color={colors.text}
            onChangeText={(txt) => setCustomMajor(txt)}
          />
      }

      <View style={{margin: 5}} />

    <TouchableWithoutFeedback onPress={() => setMajor("Undecided")}>
        <View style={{ backgroundColor: colors.card, borderWidth: 1, borderColor: major === "Undecided" ? colors.primary : colors.card, padding: 10, borderRadius: 10, flexDirection: "row", justifyContent: "space-between", paddingVertical: 20}}>
          <Text style={{color: colors.text}}>Undecided</Text>
            {major === "Undecided" 
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
