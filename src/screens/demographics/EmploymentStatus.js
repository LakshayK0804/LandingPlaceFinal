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

export function EmploymentStatusScreen({ navigation, route }) {
  const [employment, setEmployment] = useState("");
  const { colors } = useTheme()
  let user = route.params.user

  function nextScreen() {
     // Pass user to next screen with selected employment
    user.employment_status = employment
    navigation.navigate("Housing Status", {user: user})
  }

  return (

    <ScrollView showsVerticalScrollIndicator={false}>

    <View style={styles.container}>
    <TouchableWithoutFeedback onPress={() => setEmployment("Part Time")}>
        <View style={{backgroundColor: colors.card, borderWidth: 1, borderColor: employment === "Part Time" ? colors.primary : colors.card, padding: 10, borderRadius: 10, flexDirection: "row", justifyContent: "space-between", paddingVertical: 20}}>
          <Text style={{color: colors.text}}>Part Time</Text>
            {employment === "Part Time" 
              ? <View style={{backgroundColor: "#5468ff", height: 20, width: 20, borderRadius: 20}}/>
              : <View style={{borderWidth: 1, borderColor: "gray", height: 20, width: 20, borderRadius: 20}}/>
            }
        </View>
      </TouchableWithoutFeedback>

      <View style={{margin: 5}} />

      <TouchableWithoutFeedback onPress={() => setEmployment("Full Time")}>
        <View style={{backgroundColor: colors.card, borderWidth: 1, borderColor: employment === "Full Time" ? colors.primary : colors.card, padding: 10, borderRadius: 10, flexDirection: "row", justifyContent: "space-between", paddingVertical: 20}}>
          <Text style={{color: colors.text}}>Full Time</Text>
            {employment === "Full Time" 
              ? <View style={{backgroundColor: "#5468ff", height: 20, width: 20, borderRadius: 20}}/>
              : <View style={{borderWidth: 1, borderColor: "gray", height: 20, width: 20, borderRadius: 20}}/>
            }
        </View>
      </TouchableWithoutFeedback>

      <View style={{margin: 5}} />

      <TouchableWithoutFeedback onPress={() => setEmployment("Unemployed")}>
        <View style={{backgroundColor: colors.card, borderWidth: 1, borderColor: employment === "Unemployed" ? colors.primary : colors.card, padding: 10, borderRadius: 10,  flexDirection: "row", justifyContent: "space-between", paddingVertical: 20}}>
          <Text style={{color: colors.text}}>Unemployed</Text>
            {employment === "Unemployed" 
              ? <View style={{backgroundColor: "#5468ff", height: 20, width: 20, borderRadius: 20}}/>
              : <View style={{borderWidth: 1, borderColor: "gray", height: 20, width: 20, borderRadius: 20}}/>
            }
        </View>
      </TouchableWithoutFeedback>

      <View style={{margin: 5}} />

      <TouchableWithoutFeedback onPress={() => setEmployment("Self Employed")}>
        <View style={{backgroundColor: colors.card, borderWidth: 1, borderColor: employment === "Self Employed" ? colors.primary : colors.card, padding: 10, borderRadius: 10, flexDirection: "row", justifyContent: "space-between", paddingVertical: 20}}>
          <Text style={{color: colors.text}}>Self Employed</Text>
            {employment === "Self Employed" 
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
