import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Platform, TextInput, TouchableWithoutFeedback, FlatList, ActivityIndicator } from "react-native"
import { auth } from "../../../firebaseConfig"
import { StackActions, useTheme } from '@react-navigation/native';
import { useMoodTrackerStore, useUserStore } from "../../stores";
import uuid from "react-native-uuid";
import { EXPO_PUBLIC_URL } from "@env"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

function Emotion({ text, toggleSelection }) {

  const { colors } = useTheme()
  const [selected, setSelected] = useState(false)

  function select() {
    toggleSelection(text)
    setSelected(!selected)
  }

  return (
    <TouchableWithoutFeedback onPress={select}>
      <View style={{flex: 1/3, backgroundColor: colors.card, borderRadius: 10, paddingVertical: 12, paddingHorizontal: 8, margin: 4, borderWidth: 1, borderColor: selected ? colors.primary : colors.card}}>
        <Text style={{color: colors.text, fontSize: 16, textAlign: "center"}}>{text}</Text>
      </View>
    </TouchableWithoutFeedback>
  )
}

export function MoodEntryScreen({ navigation, route }) {  

  const entry = route.params?.item // This only exists if edit is pressed from prev screen
  const { colors } = useTheme()
  const [loading, setLoading] = useState(false)
  
  const emotions = ["Anger", "Fear", "Sadness", "Happiness", "Disgust", "Anxiety", "Surprise", "Satisfaction", "Shame", "Guilt", "Love", "Awkwardness", "Boredom", "Envy", "Amusement", "Awe", "Interest", "Pride", "Contempt", "Affection", "Depression", "Disappointment", "Compassion", "Admiration"]
  const [selectedEmotions, setSelectedEmotions] = useState(entry? entry.emotions_selected: [])

  const [note, setNote] = useState(entry ? entry.note : "")

  const addMood = useMoodTrackerStore((store) => store.addMood)
  const updateMood = useMoodTrackerStore((store) => store.updateMood)
  const updateStats = useUserStore((store) => store.updateStats)

  async function submit(navigation) {

    setLoading(true)
    
    const moodObj = {
      emotions: selectedEmotions,
      note: note,
      date: new Date().toISOString(),
      mood_id: entry ? entry.mood_id : uuid.v4(),
      mood: route.params.mood
    }

    const idToken = await auth.currentUser?.getIdToken();

    // If entry exists, we update the row in the db
    // Else we insert it as new
    if (entry) {
      await fetch(EXPO_PUBLIC_URL + "/mood/", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + idToken
        },
        body: JSON.stringify({moodObj}),
      })
      .then((response) => {
        if (response.ok) {
          updateMood(moodObj)
          navigation.dispatch(StackActions.pop(1));
        }
        else {
          alert("Network Error")
        }
      })
      .catch((error) => alert("Network Error" + error))
      .finally(() => setLoading(false))
    }

    else {
      await fetch(EXPO_PUBLIC_URL + "/mood/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + idToken
        },
        body: JSON.stringify({moodObj}),
      })
      .then((response) => {
        if (response.ok) {
          addMood(moodObj)
          updateStats("total_mood")
          navigation.dispatch(StackActions.pop(1));
        }
        else {
          alert("Network Error")
        }
      })
      .catch((error) => alert("Network Error" + error))
      .finally(() => setLoading(false))
    }
  }

  function toggleSelection(emotion) {
    if (selectedEmotions.includes(emotion)) {
      setSelectedEmotions(selectedEmotions.filter(item => item !== emotion));
    }
    else {
      setSelectedEmotions([...selectedEmotions, emotion])
    }
  }

  return (
      <KeyboardAwareScrollView behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardShouldPersistTaps={"handled"}>
        <View style={styles.container}>
          <Text style={{color: colors.text, fontSize: 20, fontWeight: "bold", textAlign: "center", marginVertical: 10}}>Select All Emotions That Apply</Text>

          <View>
            <FlatList
              data={emotions}
              renderItem={({ item }) => <Emotion text={item} toggleSelection={toggleSelection}/>}
              numColumns={3}
              scrollEnabled={false}
              columnWrapperStyle={{justifyContent: "space-around"}}
              />
          </View>
          
          <View style={{margin: 20}} />

          <View style={[styles.textInputContainer, {color: colors.text, backgroundColor: colors.card}]}>
            <TextInput
              placeholder={"Add a quick note (optional)"}
              color={colors.text}
              placeholderTextColor={"gray"}
              value={note}
              onChangeText={(text) => setNote(text)}
              style={[styles.textInput, {backgroundColor: colors.card}]}
              multiline
              />
          </View>

          <View style={{margin: 5}} />

          <TouchableOpacity onPress={() => submit(navigation)} style={{borderRadius: 10, height: 50, backgroundColor: colors.primary, justifyContent: "center", alignItems: "center"}}>
            {loading ? <ActivityIndicator color={"white"} /> : <Text style={{color: "white"}}>Submit</Text>}
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
  )
}

const styles= StyleSheet.create({
  container: {
    flex: 1,
    padding: 10
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 5
  },
  emotion: {
    height: 60,
    width: 60
  },
  textInputContainer: {
    paddingHorizontal: 10,
    borderRadius: 10,
    height: 80
  },
  textInput: {
    flex: 1
  },
  hobby: {
    padding: 10,
    paddingRight: 20,
    borderRadius: 10,
    marginRight: 5,
    flexDirection: "row", 
    alignItems: "center"
  },
  selectedHobby: {
    padding: 10,
    paddingRight: 20,
    borderRadius: 10,
    margin: 5,
    flexDirection: "row", 
    alignItems: "center"
  },
  hobbyCircle: {
    borderWidth: 1,
    height: 20,
    width: 20,
    borderRadius: 10,
    marginRight: 5
  },
  hobbyCircleSelected: {
    borderWidth: 1,
    height: 20,
    width: 20,
    borderRadius: 10,
    marginRight: 5
  }
})