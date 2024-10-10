import { useEffect, useState } from "react";
import {
  Text,
  View,
  TouchableWithoutFeedback,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView
} from "react-native";
import { useTheme } from "@react-navigation/native";

export function RaceScreen({ navigation, route }) {
  const [race, setRace] = useState("");
  const [multiracial, setMultiracial] = useState("");
  const [customrace, setRaceCustomRace] = useState("");
  const { colors } = useTheme()
  let user = route.params.user

  function nextScreen() {
     // Pass user to next screen with selected race
    if (race === "Other") {
      user.race = customrace
    } 
    else if (race === "Multiracial") {
        user.race = multiracial
    }
    else {
      user.race = race
    }
    navigation.navigate("Religion", {user: user})
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
      <TouchableWithoutFeedback onPress={() => setRace("African American / Black")}>
        <View style={{backgroundColor: colors.card, borderWidth: 1, borderColor: race === "African American / Black" ? colors.primary : colors.card, padding: 10, borderRadius: 10, flexDirection: "row", justifyContent: "space-between", paddingVertical: 20}}>
          <Text style={{color: colors.text}}>African American / Black</Text>
            {race === "African American / Black" 
              ? <View style={{backgroundColor: "#5468ff", height: 20, width: 20, borderRadius: 20}}/>
              : <View style={{borderWidth: 1, borderColor: "gray", height: 20, width: 20, borderRadius: 20}}/>
            }
        </View>
      </TouchableWithoutFeedback>

      <View style={{margin: 5}} />

      <TouchableWithoutFeedback onPress={() => setRace("Asian")}>
        <View style={{backgroundColor: colors.card, borderWidth: 1, borderColor: race === "Asian" ? colors.primary : colors.card, padding: 10, borderRadius: 10, flexDirection: "row", justifyContent: "space-between", paddingVertical: 20}}>
          <Text style={{color: colors.text}}>Asian</Text>
            {race === "Asian" 
              ? <View style={{backgroundColor: "#5468ff", height: 20, width: 20, borderRadius: 20}}/>
              : <View style={{borderWidth: 1, borderColor: "gray", height: 20, width: 20, borderRadius: 20}}/>
            }
        </View>
      </TouchableWithoutFeedback>

      <View style={{margin: 5}} />

      <TouchableWithoutFeedback onPress={() => setRace("Hispanic / Latinx (Non-White)")}>
        <View style={{backgroundColor: colors.card, borderWidth: 1, borderColor: race === "Hispanic / Latinx (Non-White)" ? colors.primary : colors.card, padding: 10, borderRadius: 10, flexDirection: "row", justifyContent: "space-between", paddingVertical: 20}}>
          <Text style={{color: colors.text}}>Hispanic / Latinx (Non-White)</Text>
            {race === "Hispanic / Latinx (Non-White)" 
              ? <View style={{backgroundColor: "#5468ff", height: 20, width: 20, borderRadius: 20}}/>
              : <View style={{borderWidth: 1, borderColor: "gray", height: 20, width: 20, borderRadius: 20}}/>
            }
        </View>
      </TouchableWithoutFeedback>

      <View style={{margin: 5}} />

      <TouchableWithoutFeedback onPress={() => setRace("Middle Eastern / North African (Non-White)")}>
        <View style={{backgroundColor: colors.card, borderWidth: 1, borderColor: race === "Middle Eastern / North African (Non-White)" ? colors.primary : colors.card, padding: 10, borderRadius: 10, flexDirection: "row", justifyContent: "space-between", paddingVertical: 20}}>
          <Text style={{color: colors.text}}>Middle Eastern / North African (Non-White)</Text>
            {race === "Middle Eastern / North African (Non-White)"
              ? <View style={{backgroundColor: "#5468ff", height: 20, width: 20, borderRadius: 20}}/>
              : <View style={{borderWidth: 1, borderColor: "gray", height: 20, width: 20, borderRadius: 20}}/>
            }
        </View>
      </TouchableWithoutFeedback>

      <View style={{margin: 5}} />
      
      <TouchableWithoutFeedback onPress={() => setRace("Native American / Alaska Native / Indegenous")}>
        <View style={{backgroundColor: colors.card, borderWidth: 1, borderColor: race === "Native American / Alaska Native / Indegenous" ? colors.primary : colors.card, padding: 10, borderRadius: 10, flexDirection: "row", justifyContent: "space-between", paddingVertical: 20}}>
          <Text style={{color: colors.text}}>Native American / Alaska Native / Indegenous</Text>
            {race === "Native American / Alaska Native / Indegenous" 
              ? <View style={{backgroundColor: "#5468ff", height: 20, width: 20, borderRadius: 20}}/>
              : <View style={{borderWidth: 1, borderColor: "gray", height: 20, width: 20, borderRadius: 20}}/>
            }
        </View>
      </TouchableWithoutFeedback>

      <View style={{margin: 5}} />

      <TouchableWithoutFeedback onPress={() => setRace("White")}>
        <View style={{backgroundColor: colors.card, borderWidth: 1, borderColor: race === "White" ? colors.primary : colors.card, padding: 10, borderRadius: 10, flexDirection: "row", justifyContent: "space-between", paddingVertical: 20}}>
          <Text style={{color: colors.text}}>White</Text>
            {race === "White" 
              ? <View style={{backgroundColor: "#5468ff", height: 20, width: 20, borderRadius: 20}}/>
              : <View style={{borderWidth: 1, borderColor: "gray", height: 20, width: 20, borderRadius: 20}}/>
            }
        </View>
      </TouchableWithoutFeedback>

      <View style={{margin: 5}} />

      <TouchableWithoutFeedback onPress={() => setRace("Multiracial")}>
        <View style={{backgroundColor: colors.card, borderWidth: 1, borderColor: race === "Multiracial" ? colors.primary : colors.card, padding: 10, borderRadius: 10, flexDirection: "row", justifyContent: "space-between", paddingVertical: 20}}>
          <Text style={{color: colors.text}}>Multiracial</Text>
            {race === "Multiracial" 
              ? <View style={{backgroundColor: "#5468ff", height: 20, width: 20, borderRadius: 20}}/>
              : <View style={{borderWidth: 1, borderColor: "gray", height: 20, width: 20, borderRadius: 20}}/>
            }
        </View>
      </TouchableWithoutFeedback>

      {
        race === "Multiracial" && 
          <TextInput 
            placeholder="Type here"
            style={{paddingHorizontal: 10, paddingVertical: 20, backgroundColor: colors.card, borderRadius: 10}}
            placeholderTextColor={"gray"}
            color={colors.text}
            onChangeText={(txt) => setMultiracial(txt)}
          />
      }

      <View style={{margin: 5}} />

      <TouchableWithoutFeedback onPress={() => setRace("Other")}>
        <View style={{backgroundColor: colors.card, borderWidth: 1, borderColor: race === "Other" ? colors.primary : colors.card, padding: 10, borderRadius: 10, flexDirection: "row", justifyContent: "space-between", paddingVertical: 20}}>
          <Text style={{color: colors.text}}>Other</Text>
            {race === "Other" 
              ? <View style={{backgroundColor: "#5468ff", height: 20, width: 20, borderRadius: 20}}/>
              : <View style={{borderWidth: 1, borderColor: "gray", height: 20, width: 20, borderRadius: 20}}/>
            }
        </View>
      </TouchableWithoutFeedback>

      {
        race === "Other" && 
          <TextInput 
            placeholder="Type here"
            style={{paddingHorizontal: 10, paddingVertical: 20, backgroundColor: colors.card, borderRadius: 10}}
            placeholderTextColor={"gray"}
            color={colors.text}
            onChangeText={(txt) => setRaceCustomRace(txt)}
          />
      }

      <View style={{margin: 5}} />

      <TouchableWithoutFeedback onPress={() => setRace("Unspecified")}>
        <View style={{backgroundColor: colors.card, borderWidth: 1, borderColor: race === "Unspecified" ? colors.primary : colors.card, padding: 10, borderRadius: 10, flexDirection: "row", justifyContent: "space-between", paddingVertical: 20}}>
          <Text style={{color: colors.text}}>Prefer not to answer</Text>
            {race === "Unspecified" 
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
    paddingBottom: 80,
  },
  image: {
    width: 100,
    height: 100,
  },
});
