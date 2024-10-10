import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image, StatusBar, ActivityIndicator } from "react-native";
import { useTheme } from "@react-navigation/native";
import { auth } from "../../../firebaseConfig";
import { useUserStore } from "../../stores";
import AvatarSvg from "../../components/AvatarSvg"
import { EXPO_PUBLIC_URL } from "@env"

// TODO if login_num is 0, they get tutorial
export function HomeScreen({ navigation }) {

  const { colors } = useTheme()
  const user = useUserStore((store) => store.user)
  const setUser = useUserStore((store) => store.setUser)
  const deleteUser = useUserStore((store) => store.deleteUser)
  const [loading, setLoading] = useState(true)
  const [failedLoad, setFailedLoad] = useState(false)
  const [quote, setQuote] = useState({})

  useEffect(() => {
    getQuote()
  }, [])

  async function getQuote() {
    const idToken = await auth.currentUser?.getIdToken()

    await fetch(EXPO_PUBLIC_URL + "/quote", {
      headers: {
        "Authorization": "Bearer " + idToken
      }
    })
    .then((response) => {
      if (response.ok) {
        return response.json()
      }
      throw new Error("Network Error")
    })
    .then((data) => setQuote(data))
    .catch((e) => alert(e))
  }
  
  return (
    <ScrollView showsVerticalScrollIndicator={false}>

      <View style={styles.container}>
        <TouchableOpacity onPress={() => alert("Under Construction")} style={{height: 150, backgroundColor: colors.card, borderRadius: 10, margin: 10, flexDirection: "row", justifyContent: "space-between"}}>
          <AvatarSvg />
          <View style={{width: "66%", justifyContent: "center", paddingVertical: 2, paddingRight: 4}}>
            <Text style={{color: colors.text}}>{quote.quote}</Text>
            <View style={{margin: 5}} />
            <Text style={{color: colors.text}}>{quote.author?.length > 0 || quote.author !== "-" ? "-" + quote.author : ""}</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Mood")} style={{height: 150, backgroundColor: colors.card, borderRadius: 10, margin: 10, paddingHorizontal: 5}}>
          <View style={{flexDirection: "row", height: "100%", alignItems: "center"}}>
            <Image source={require("../../../assets/mood.png")} style={{width: 180, height: "100%"}} />
            <Text style={[styles.titleText, {color: colors.text, fontSize: 30, flex: 1, marginLeft: 20}]}>Mood Tracker</Text>
          </View>
        </TouchableOpacity>

        <View style={{flexDirection: "row"}}>
          <View style={{width: "50%"}}>
            <TouchableOpacity onPress={() => navigation.navigate("Checklist")} style={{flexGrow: 1, height: 150, backgroundColor: colors.card, borderRadius: 10, margin: 10, justifyContent: "center", alignItems: "center"}}>
              <Image source={require("../../../assets/checklist.png")} style={{width: 100, height: 100}} />
              <Text style={[styles.titleText, {color: colors.text}]}>Checklist</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate("Goal")} style={{flexGrow: 1, height: 150, backgroundColor: colors.card, borderRadius: 10, margin: 10, justifyContent: "center", alignItems: "center"}}>
              <Image source={require("../../../assets/goal.png")} style={{width: 100, height: 100}} />
              <Text style={[styles.titleText, {color: colors.text}]}>Goal</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={() => navigation.navigate("Journal")} style={{width: "50%"}}>
            <View style={{flexGrow: 1, height: 150, backgroundColor: colors.card, borderRadius: 10, margin: 10, justifyContent: "space-around", alignItems: "center"}}>
              <Image source={require("../../../assets/journal.png")} style={{width: 150, height: 150}} />
              <Text style={[styles.titleText, {color: colors.text, fontSize: 30}]}>Journal</Text>
            </View>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => navigation.navigate("Activities")} style={{height: 150, backgroundColor: colors.card, borderRadius: 10, margin: 10, paddingHorizontal: 5}}>
          <View style={{flexDirection: "row", height: "100%", width: "100%", alignItems: "center"}}>
            <Image source={require("../../../assets/activities.png")} style={{width: 140, height: 140, resizeMode: "contain"}} />
            <Text style={[styles.titleText, {color: colors.text, fontSize: 30, marginLeft: 30}]}>Activites</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Trend")} style={{height: 150, backgroundColor: colors.card, borderRadius: 10, margin: 10, flexDirection: "row", alignItems: "center"}}>
            <Text style={[styles.titleText, {color: colors.text, fontSize: 30, flex: 1, textAlign: "center"}]}>Trends</Text>
            <View style={{flex: 2, flexDirection: "row", justifyContent: "space-around", marginRight: 10}}>
              <Image source={require("../../../assets/bar.png")} style={{width: 120, height: 120}} />
              <Image source={require("../../../assets/pie.png")} style={{width: 120, height: 120}} />
            </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Achievements")} style={{height: 150, backgroundColor: colors.card, borderRadius: 10, margin: 10, flexDirection: "row", justifyContent: "space-around", alignItems: "center"}}>
          <Text style={[styles.titleText, {color: colors.text, fontSize: 30}]}>Achievements</Text>
          <Image source={require("../../../assets/achievement.png")} style={{width: 120, height: 120}} />
        </TouchableOpacity>

      </View>

    </ScrollView>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10
  },
  hiddenTextContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  titleText: {
    fontWeight: "bold",
    padding: 5,
    fontSize: 24,
  },
});
