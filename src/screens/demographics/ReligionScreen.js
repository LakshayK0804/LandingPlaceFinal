import { useEffect, useState } from "react";
import {
  Text,
  View,
  TouchableWithoutFeedback,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";
import { useTheme } from "@react-navigation/native";

export function ReligionScreen({ navigation, route }) {
  const [religion, setReligion] = useState("");
  const [customReligion, setCustomReligion] = useState("")
  const { colors } = useTheme()
  let user = route.params.user

  function nextScreen() {
     // Pass user to next screen with selected religion
    if (religion === "Other") {
      user.religion = customReligion
    } 
    else {
      user.religion = religion
    }
    navigation.navigate("Language", {user: user})
  }

  return (
    <View style={styles.container}>
      
      <TouchableWithoutFeedback onPress={() => setReligion("Other")}>
        <View style={{backgroundColor: colors.card, borderWidth: 1, borderColor: religion === "Other" ? colors.primary : colors.card, padding: 10, borderRadius: 10, flexDirection: "row", justifyContent: "space-between", paddingVertical: 20}}>
          <Text style={{color: colors.text}}>Enter</Text>
            {religion === "Other" 
              ? <View style={{backgroundColor: "#5468ff", height: 20, width: 20, borderRadius: 20}}/>
              : <View style={{borderWidth: 1, borderColor: "gray", height: 20, width: 20, borderRadius: 20}}/>
            }
        </View>
      </TouchableWithoutFeedback>

      {
        religion === "Other" && 
          <TextInput 
            placeholder="Type here"
            style={{paddingHorizontal: 10, paddingVertical: 20, backgroundColor: colors.card, borderRadius: 10}}
            placeholderTextColor={"gray"}
            color={colors.text}
            onChangeText={(txt) => setCustomReligion(txt)}
          />
      }

      <View style={{margin: 5}} />

      <TouchableWithoutFeedback onPress={() => setReligion("Unspecified")}>
        <View style={{backgroundColor: colors.card, borderWidth: 1, borderColor: religion === "Unspecified" ? colors.primary : colors.card, padding: 10, borderRadius: 10, flexDirection: "row", justifyContent: "space-between", paddingVertical: 20}}>
          <Text style={{color: colors.text}}>Prefer not to answer</Text>
            {religion === "Unspecified" 
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20
  },
  image: {
    width: 100,
    height: 100,
  },
});
