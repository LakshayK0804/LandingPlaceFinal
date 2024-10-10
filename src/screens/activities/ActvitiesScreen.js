import { useEffect, useState } from "react"
import { View, FlatList, Text, TouchableOpacity, StyleSheet, Image, ActivityIndicator, ScrollView } from "react-native"
import { auth } from "../../../firebaseConfig"
import { useTheme } from "@react-navigation/native"
import { EXPO_PUBLIC_URL } from "@env"

function ActivityPill({ item, onPress }) {

  console.log(item)
  const { colors } = useTheme()

  return (
    <TouchableOpacity onPress={onPress} style={[styles.pill, { backgroundColor: colors.card }]}>
      <Text style={[styles.pillText, { color: colors.text }]}>{item.title}</Text>
    </TouchableOpacity>
  )
}

export function ActivitiesScreen({ navigation }) {

  const { colors } = useTheme()
  const [exercises, setExercises] = useState([])
  const [meditations, setMeditations] = useState([]);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState("")

  useEffect(() => {
    getData();
  }, []);

  async function getData() {

    const idToken = await auth.currentUser?.getIdToken()
    setToken(idToken)

    await fetch(EXPO_PUBLIC_URL + "/library", {
      headers: {
        "Authorization": "Bearer " + idToken
      }
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error()
      }
      return response.json()
    })
    .then((data) => {
      setMeditations(data[0]);
      setArticles(data[1]);
      setExercises(data[2])
      setLoading(false)

    })
    .catch((error) => {
      alert("Something went wrong")
    });
  }

  function handleVideoPress(title, id, thumbnail) {
    console.log(id)
    navigation.navigate("PlayAudio", { id: id, title: title, image: thumbnail });
  }

  function handleArticlePress(title, id) {
    navigation.navigate("Read Article", { id: id });
  }

  if (loading) {
    return <ActivityIndicator size={"large"} color={colors.primary} style={{flex: 1, justifyContent: "center", alignSelf: "center"}}/>
  }

  return (
    <ScrollView style={styles.container}>

      <TouchableOpacity style={[styles.sectionButton, { backgroundColor: colors.card }]} onPress={() => navigation.navigate("Medidations")}>
        <View style={styles.viewAll}>
          <Text style={{color: colors.text}}>View All {">"}</Text>
        </View>
        <View style={{flexDirection: "row", marginTop: -10, alignItems: "center"}}>
            <Image source={require("../../../assets/activities/mindful-meditation.png")} style={styles.img} />
            <Text style={[styles.sectionText, {color: colors.text,}]}>Mindful{"\n"}Meditation</Text>
        </View>

      </TouchableOpacity>
      <FlatList
        data={meditations}
        renderItem={({ item }) => <ActivityPill item={item} onPress={() => navigation.navigate("Play Audio", {id: item.id})}/>}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
      <View style={[styles.border, { borderColor: colors.border }]} />

      <TouchableOpacity style={[styles.sectionButton, { backgroundColor: colors.card }]} onPress={() => navigation.navigate("Articles")}>
        <View style={styles.viewAll}>
          <Text style={{color: colors.text}}>View All {">"}</Text>
        </View>
        <View style={{flexDirection: "row", marginTop: -10, alignItems: "center"}}>
          <Image source={require("../../../assets/activities/wellness-articles.png")} style={styles.img} />
          <Text style={[styles.sectionText, {color: colors.text,}]}>Wellness{"\n"}Articles</Text>
        </View>
      </TouchableOpacity>
      <FlatList
        data={articles}
        renderItem={({ item }) => <ActivityPill item={item} onPress={()=> navigation.navigate("Read Article", {id: item.uuid})}/>}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
      <View style={[styles.border, { borderColor: colors.border }]} />

      <TouchableOpacity style={[styles.sectionButton, { backgroundColor: colors.card }]} onPress={() => navigation.navigate("Exercises")}>
        <View style={styles.viewAll}>
          <Text style={{color: colors.text}}>View All {">"}</Text>
        </View>
        <View style={{flexDirection: "row", marginTop: -10, alignItems: "center"}}>
          <Image source={require("../../../assets/activities/cognitive-exercises.png")} style={styles.img} />
          <Text style={[styles.sectionText, {color: colors.text,}]}>Cognitive{"\n"}Exercises</Text>
        </View>
      </TouchableOpacity>
      <FlatList
        data={exercises}
        renderItem={({ item }) => <ActivityPill item={item} onPress={ () => navigation.navigate("Complete Exercise", {id: item._id, title: item.title})}/>}
        horizontal
        showsHorizontalScrollIndicator={false}
      />

    </ScrollView>
  )
}

const styles = StyleSheet.create({
  sectionButton: {
    height: 150,
    borderRadius: 10,
    margin: 10,
    paddingHorizontal: 5,
  },
  sectionText: {
    fontSize: 32,
    fontWeight: "bold",
    marginLeft: 20,
  },
  img: {
    height: 120,
    width: 100,
    resizeMode: "contain",
    marginLeft: 10
  },
  viewAll: {
    flexDirection: "row",
    marginRight: 10, 
    marginTop: 10,
    justifyContent: "flex-end",
  },
  pill: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
    marginBottom: 5
  },
  pillText: {
    fontSize: 16,
  },
  border: {
    borderWidth: 1,
    margin: 10,
    marginVertical: 10
  }
})
