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

export function LanguageScreen({ navigation, route }) {
  const [language, setLanguage] = useState("");
  const [customLanguage, setCustomLanguage] = useState("")
  const { colors } = useTheme()
  let user = route.params.user

  function nextScreen() {
     // Pass user to next screen with selected language
    if (language === "Other") {
      user.primary_language = customLanguage
    } 
    else {
      user.primary_language = language
    }

    navigation.navigate("Relationship", {user: user})
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
    <View style={styles.container}>

    <TouchableWithoutFeedback onPress={() => setLanguage("English")}>
        <View style={{backgroundColor: colors.card, borderWidth: 1, borderColor: language === "English" ? colors.primary : colors.card, padding: 10, borderRadius: 10, flexDirection: "row", justifyContent: "space-between", paddingVertical: 20}}>
          <Text style={{color: colors.text}}>English</Text>
            {language === "English" 
              ? <View style={{backgroundColor: "#5468ff", height: 20, width: 20, borderRadius: 20}}/>
              : <View style={{borderWidth: 1, borderColor: "gray", height: 20, width: 20, borderRadius: 20}}/>
            }
        </View>
      </TouchableWithoutFeedback>

      <View style={{margin: 5}} />

      <TouchableWithoutFeedback onPress={() => setLanguage("Spanish")}>
        <View style={{backgroundColor: colors.card, borderWidth: 1, borderColor: language === "Spanish" ? colors.primary : colors.card, padding: 10, borderRadius: 10, flexDirection: "row", justifyContent: "space-between", paddingVertical: 20}}>
          <Text style={{color: colors.text}}>Spanish</Text>
            {language === "Spanish" 
              ? <View style={{backgroundColor: "#5468ff", height: 20, width: 20, borderRadius: 20}}/>
              : <View style={{borderWidth: 1, borderColor: "gray", height: 20, width: 20, borderRadius: 20}}/>
            }
        </View>
      </TouchableWithoutFeedback>

      <View style={{margin: 5}} />

      <TouchableWithoutFeedback onPress={() => setLanguage("Portuguese")}>
        <View style={{backgroundColor: colors.card, borderWidth: 1, borderColor: language === "Portuguese" ? colors.primary : colors.card, padding: 10, borderRadius: 10, flexDirection: "row", justifyContent: "space-between", paddingVertical: 20}}>
          <Text style={{color: colors.text}}>Portuguese</Text>
            {language === "Portuguese" 
              ? <View style={{backgroundColor: "#5468ff", height: 20, width: 20, borderRadius: 20}}/>
              : <View style={{borderWidth: 1, borderColor: "gray", height: 20, width: 20, borderRadius: 20}}/>
            }
        </View>
      </TouchableWithoutFeedback>

      <View style={{margin: 5}} />

      <TouchableWithoutFeedback onPress={() => setLanguage("French")}>
        <View style={{backgroundColor: colors.card, borderWidth: 1, borderColor: language === "French" ? colors.primary : colors.card, padding: 10, borderRadius: 10, flexDirection: "row", justifyContent: "space-between", paddingVertical: 20}}>
          <Text style={{color: colors.text}}>French</Text>
            {language === "French" 
              ? <View style={{backgroundColor: "#5468ff", height: 20, width: 20, borderRadius: 20}}/>
              : <View style={{borderWidth: 1, borderColor: "gray", height: 20, width: 20, borderRadius: 20}}/>
            }
        </View>
      </TouchableWithoutFeedback>

      <View style={{margin: 5}} />

      <TouchableWithoutFeedback onPress={() => setLanguage("Mandarin")}>
        <View style={{backgroundColor: colors.card, borderWidth: 1, borderColor: language === "Mandarin" ? colors.primary : colors.card, padding: 10, borderRadius: 10, flexDirection: "row", justifyContent: "space-between", paddingVertical: 20}}>
          <Text style={{color: colors.text}}>Mandarin</Text>
            {language === "Mandarin" 
              ? <View style={{backgroundColor: "#5468ff", height: 20, width: 20, borderRadius: 20}}/>
              : <View style={{borderWidth: 1, borderColor: "gray", height: 20, width: 20, borderRadius: 20}}/>
            }
        </View>
      </TouchableWithoutFeedback>

      <View style={{margin: 5}} />

      <TouchableWithoutFeedback onPress={() => setLanguage("Arabic")}>
        <View style={{backgroundColor: colors.card, borderWidth: 1, borderColor: language === "Arabic" ? colors.primary : colors.card, padding: 10, borderRadius: 10, flexDirection: "row", justifyContent: "space-between", paddingVertical: 20}}>
          <Text style={{color: colors.text}}>Arabic</Text>
            {language === "Arabic" 
              ? <View style={{backgroundColor: "#5468ff", height: 20, width: 20, borderRadius: 20}}/>
              : <View style={{borderWidth: 1, borderColor: "gray", height: 20, width: 20, borderRadius: 20}}/>
            }
        </View>
      </TouchableWithoutFeedback>
      
      <View style={{margin: 5}} />

      <TouchableWithoutFeedback onPress={() => setLanguage("Other")}>
        <View style={{backgroundColor: colors.card, borderWidth: 1, borderColor: language === "Other" ? colors.primary : colors.card, padding: 10, borderRadius: 10, flexDirection: "row", justifyContent: "space-between", paddingVertical: 20}}>
          <Text style={{color: colors.text}}>Other</Text>
            {language === "Other" 
              ? <View style={{backgroundColor: "#5468ff", height: 20, width: 20, borderRadius: 20}}/>
              : <View style={{borderWidth: 1, borderColor: "gray", height: 20, width: 20, borderRadius: 20}}/>
            }
        </View>
      </TouchableWithoutFeedback>

      {
        language === "Other" && 
          <TextInput 
            placeholder="Type here"
            style={{paddingHorizontal: 10, paddingVertical: 20, backgroundColor: colors.card, borderRadius: 10}}
            placeholderTextColor={"gray"}
            color={colors.text}
            onChangeText={(txt) => setCustomLanguage(txt)}
          />
      }

      <View style={{margin: 5}} />

      <TouchableWithoutFeedback onPress={() => setLanguage("Unspecified")}>
        <View style={{backgroundColor: colors.card, borderWidth: 1, borderColor: language === "Unspecified" ? colors.primary : colors.card, padding: 10, borderRadius: 10, flexDirection: "row", justifyContent: "space-between", paddingVertical: 20}}>
          <Text style={{color: colors.text}}>Prefer not to answer</Text>
            {language === "Unspecified" 
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
