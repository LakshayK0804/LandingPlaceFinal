import React, { useEffect, useState } from "react";
import {
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useTheme } from "@react-navigation/native"
import { auth } from "../../../firebaseConfig"
import { EXPO_PUBLIC_URL } from "@env"

export function PromptsScreen({navigation}) {

  const { colors } = useTheme()

  const [prompts, setPrompts] = useState([])

  useEffect(() => {
    getPrompts();
  }, [])

  function handlePress(txt) {
    navigation.navigate("Free Write", {title: txt, isPrompt: 1, isEdit: false, uuid: ""})
  }

  const getPrompts = async () => {
    const idToken = await auth.currentUser?.getIdToken();

    await fetch(EXPO_PUBLIC_URL + "/journal/prompts", {
      headers: {
        "Authorization": "Bearer " + idToken
      }
    })
      .then((response) => {
        if (response.ok) {
          return response.json()
        }
        else {
          alert("Error")
        }
      })
      .then((data) => {
        setPrompts(data)
      })
      .catch((error) => {
        alert(error)
      })
  };

  function Prompt(item) {
    return (
      <TouchableOpacity style={[styles.item, {backgroundColor: colors.card}]} onPress={() => handlePress(item.prompt)}>
        <Text style={{color: colors.text, fontSize: 16}}>{item.prompt}</Text>
      </TouchableOpacity>
    )
  }

  return (
  // FINISH THE FLATLIST  
    <FlatList
      data={prompts}
      renderItem={({ item }) => Prompt(item)}
      numColumns={1}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    marginTop: 10,
    marginHorizontal: 20,
    fontSize: 40,
  },
  item: {
    marginTop: 10,
    marginHorizontal: 10,
    borderRadius: 10,
    padding: 16,
  },
});
