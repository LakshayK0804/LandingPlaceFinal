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
import { ScrollView } from "react-native-gesture-handler";

export function SexualOrientation({ navigation, route }) {
  const [orientation, setOrientation] = useState("");
  const [customOrientation, setCustomOrientation] = useState("");
  const { colors } = useTheme()
  let user = route.params.user

  function nextScreen() {
     // Pass user to next screen with selected orientation
    if (orientation === "Other") {
      user.sexual_orientation = customOrientation
    } else {
      user.sexual_orientation = orientation
    }
    navigation.navigate("Race", {user: user})
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
      <TouchableWithoutFeedback onPress={() => setOrientation("Asexual")}>
        <View style={{backgroundColor: colors.card, borderWidth: 1, borderColor: orientation === "Asexual" ? colors.primary : colors.card, padding: 10, borderRadius: 10, flexDirection: "row", justifyContent: "space-between", paddingVertical: 20}}>
          <Text style={{color: colors.text}}>Asexual</Text>
            {orientation === "Asexual" 
              ? <View style={{backgroundColor: "#5468ff", height: 20, width: 20, borderRadius: 20}}/>
              : <View style={{borderWidth: 1, borderColor: "gray", height: 20, width: 20, borderRadius: 20}}/>
            }
        </View>
      </TouchableWithoutFeedback>

      <View style={{margin: 5}} />

      <TouchableWithoutFeedback onPress={() => setOrientation("Bisexual")}>
        <View style={{backgroundColor: colors.card, borderWidth: 1, borderColor: orientation === "Bisexual" ? colors.primary : colors.card, padding: 10, borderRadius: 10, flexDirection: "row", justifyContent: "space-between", paddingVertical: 20}}>
          <Text style={{color: colors.text}}>Bisexual</Text>
            {orientation === "Bisexual" 
              ? <View style={{backgroundColor: "#5468ff", height: 20, width: 20, borderRadius: 20}}/>
              : <View style={{borderWidth: 1, borderColor: "gray", height: 20, width: 20, borderRadius: 20}}/>
            }
        </View>
      </TouchableWithoutFeedback>

      <View style={{margin: 5}} />

      <TouchableWithoutFeedback onPress={() => setOrientation("Heterosexual")}>
        <View style={{backgroundColor: colors.card, borderWidth: 1, borderColor: orientation === "Heterosexual" ? colors.primary : colors.card, padding: 10, borderRadius: 10, flexDirection: "row", justifyContent: "space-between", paddingVertical: 20}}>
          <Text style={{color: colors.text}}>Heterosexual</Text>
            {orientation === "Heterosexual" 
              ? <View style={{backgroundColor: "#5468ff", height: 20, width: 20, borderRadius: 20}}/>
              : <View style={{borderWidth: 1, borderColor: "gray", height: 20, width: 20, borderRadius: 20}}/>
            }
        </View>
      </TouchableWithoutFeedback>

      <View style={{margin: 5}} />

      <TouchableWithoutFeedback onPress={() => setOrientation("Homosexual")}>
        <View style={{backgroundColor: colors.card, borderWidth: 1, borderColor: orientation === "Homosexual" ? colors.primary : colors.card, padding: 10, borderRadius: 10, flexDirection: "row", justifyContent: "space-between", paddingVertical: 20}}>
          <Text style={{color: colors.text}}>Homosexual</Text>
            {orientation === "Homosexual" 
              ? <View style={{backgroundColor: "#5468ff", height: 20, width: 20, borderRadius: 20}}/>
              : <View style={{borderWidth: 1, borderColor: "gray", height: 20, width: 20, borderRadius: 20}}/>
            }
        </View>
      </TouchableWithoutFeedback>

      <View style={{margin: 5}} />
      
      <TouchableWithoutFeedback onPress={() => setOrientation("Pansexual")}>
        <View style={{backgroundColor: colors.card, borderWidth: 1, borderColor: orientation === "Pansexual" ? colors.primary : colors.card, padding: 10, borderRadius: 10, flexDirection: "row", justifyContent: "space-between", paddingVertical: 20}}>
          <Text style={{color: colors.text}}>Pansexual</Text>
            {orientation === "Pansexual" 
              ? <View style={{backgroundColor: "#5468ff", height: 20, width: 20, borderRadius: 20}}/>
              : <View style={{borderWidth: 1, borderColor: "gray", height: 20, width: 20, borderRadius: 20}}/>
            }
        </View>
      </TouchableWithoutFeedback>

      <View style={{margin: 5}} />

      <TouchableWithoutFeedback onPress={() => setOrientation("Queer/Fluid")}>
        <View style={{backgroundColor: colors.card, borderWidth: 1, borderColor: orientation === "Queer/Fluid" ? colors.primary : colors.card, padding: 10, borderRadius: 10,  flexDirection: "row", justifyContent: "space-between", paddingVertical: 20}}>
          <Text style={{color: colors.text}}>Queer/Fluid</Text>
            {orientation === "Queer/Fluid" 
              ? <View style={{backgroundColor: "#5468ff", height: 20, width: 20, borderRadius: 20}}/>
              : <View style={{borderWidth: 1, borderColor: "gray", height: 20, width: 20, borderRadius: 20}}/>
            }
        </View>
      </TouchableWithoutFeedback>

      <View style={{margin: 5}} />

      <TouchableWithoutFeedback onPress={() => setOrientation("Other")}>
        <View style={{backgroundColor: colors.card, borderWidth: 1, borderColor: orientation === "Other" ? colors.primary : colors.card, padding: 10, borderRadius: 10, flexDirection: "row", justifyContent: "space-between", paddingVertical: 20}}>
          <Text style={{color: colors.text}}>Other</Text>
            {orientation === "Other" 
              ? <View style={{backgroundColor: "#5468ff", height: 20, width: 20, borderRadius: 20}}/>
              : <View style={{borderWidth: 1, borderColor: "gray", height: 20, width: 20, borderRadius: 20}}/>
            }
        </View>
      </TouchableWithoutFeedback>

      {
        orientation === "Other" && 
          <TextInput 
            placeholder="Type here"
            style={{paddingHorizontal: 10, paddingVertical: 20, backgroundColor: colors.card, borderRadius: 10}}
            placeholderTextColor={"gray"}
            color={colors.text}
            onChangeText={(txt) => setCustomOrientation(txt)}
          />
      }

      <View style={{margin: 5}} />

      <TouchableWithoutFeedback onPress={() => setOrientation("Unspecified")}>
        <View style={{backgroundColor: colors.card, borderWidth: 1, borderColor: orientation === "Unspecified" ? colors.primary : colors.card, padding: 10, borderRadius: 10, flexDirection: "row", justifyContent: "space-between", paddingVertical: 20}}>
          <Text style={{color: colors.text}}>Prefer not to answer</Text>
            {orientation === "Unspecified" 
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
    paddingBottom: 80
  },
  image: {
    width: 100,
    height: 100,
  },
});
