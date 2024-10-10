import { useState } from "react";
import {
  Text,
  View,
  TouchableWithoutFeedback,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";
import { useTheme } from "@react-navigation/native";

export function SexScreen({ navigation, route }) {
  const [sex, setSex] = useState("");
  const [customSex, setCustomSex] = useState("");
  const { colors } = useTheme()
  let user = route.params.user

  function nextScreen() {
    if (sex === "Other") {
      user.sex = customSex
    }
    else {
      user.sex = sex
    }
    navigation.navigate("Gender", {user: user})
  }

  return (
    <View style={styles.container}>

      <TouchableWithoutFeedback onPress={() => setSex("Male")}>
        <View style={{backgroundColor: colors.card, borderWidth: 1, borderColor: sex === "Male" ? colors.primary : colors.card, padding: 10, borderRadius: 10, flexDirection: "row", justifyContent: "space-between", paddingVertical: 20}}>
          <Text style={{color: colors.text}}>Male</Text>
            {sex === "Male" 
              ? <View style={{backgroundColor: "#5468ff", height: 20, width: 20, borderRadius: 20}}/>
              : <View style={{borderWidth: 1, borderColor: "gray", height: 20, width: 20, borderRadius: 20}}/>
            }
        </View>
      </TouchableWithoutFeedback>

      <View style={{margin: 5}} />

      <TouchableWithoutFeedback onPress={() => setSex("Female")}>
        <View style={{backgroundColor: colors.card, borderWidth: 1, borderColor: sex === "Female" ? colors.primary : colors.card, padding: 10, borderRadius: 10, flexDirection: "row", justifyContent: "space-between", paddingVertical: 20}}>
          <Text style={{color: colors.text}}>Female</Text>
            {sex === "Female" 
              ? <View style={{backgroundColor: "#5468ff", height: 20, width: 20, borderRadius: 20}}/>
              : <View style={{borderWidth: 1, borderColor: "gray", height: 20, width: 20, borderRadius: 20}}/>
            }
        </View>
      </TouchableWithoutFeedback>

      <View style={{margin: 5}} />

      <TouchableWithoutFeedback onPress={() => setSex("Intersex")}>
        <View style={{backgroundColor: colors.card, borderWidth: 1, borderColor: sex === "Intersex" ? colors.primary : colors.card, padding: 10, borderRadius: 10, flexDirection: "row", justifyContent: "space-between", paddingVertical: 20}}>
          <Text style={{color: colors.text}}>Intersex</Text>
            {sex === "Intersex" 
              ? <View style={{backgroundColor: "#5468ff", height: 20, width: 20, borderRadius: 20}}/>
              : <View style={{borderWidth: 1, borderColor: "gray", height: 20, width: 20, borderRadius: 20}}/>
            }
        </View>
      </TouchableWithoutFeedback>

      <View style={{margin: 5}} />

      <TouchableWithoutFeedback onPress={() => setSex("Other")}>
        <View style={{backgroundColor: colors.card, borderWidth: 1, borderColor: sex === "Other" ? colors.primary : colors.card, padding: 10, borderRadius: 10, flexDirection: "row", justifyContent: "space-between", paddingVertical: 20}}>
          <Text style={{color: colors.text}}>Other: Please Specify</Text>
            {sex === "Other" 
              ? <View style={{backgroundColor: "#5468ff", height: 20, width: 20, borderRadius: 20}}/>
              : <View style={{borderWidth: 1, borderColor: "gray", height: 20, width: 20, borderRadius: 20}}/>
            }
        </View>
      </TouchableWithoutFeedback>

      {
        sex === "Other" && 
          <TextInput 
            placeholder="Type here"
            style={{paddingHorizontal: 10, paddingVertical: 20, backgroundColor: colors.card, borderRadius: 10}}
            placeholderTextColor={"gray"}
            color={colors.text}
            onChangeText={(txt) => setCustomSex(txt)}
          />
      }

      <View style={{margin: 5}} />

      <TouchableWithoutFeedback onPress={() => setSex("Unspecified")}>
        <View style={{backgroundColor: colors.card, borderWidth: 1, borderColor: sex === "Unspecified" ? colors.primary : colors.card, padding: 10, borderRadius: 10, flexDirection: "row", justifyContent: "space-between", paddingVertical: 20}}>
          <Text style={{color: colors.text}}>Prefer not to answer</Text>
            {sex === "Unspecified" 
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
