import React, {useEffect, useRef, useState} from "react";
import {
    TextInput,
    View,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Platform,
    Keyboard,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { auth } from "../../../firebaseConfig"
import { useJournalStore, useUserStore } from "../../stores";
import showToast from "../../utils/DisplayToast";
import uuid from 'react-native-uuid';
import { StackActions, useTheme } from '@react-navigation/native';
const moment = require('moment')
import { EXPO_PUBLIC_URL } from "@env"

export function WriteScreen ({ navigation, route })  {

  const { colors } = useTheme()
  // TODO THE USE STATE IS NOT UPDATING

  const [title, setTitle] = useState(route.params.title);
  const [body, setBody] = useState(route.params.body);
  const isPrompt = route.params.isPrompt
  const [isEdit, setIsEdit] = useState(route.params.isEdit)
  const [id, setId] = useState(route.params.uuid)
  const updateStats = useUserStore((store) => store.updateStats)

  // Zustand actions
  const addEntry = useJournalStore((store) => store.addEntry)
  const removeEntry = useJournalStore((store) => store.removeEntry)

  useEffect(() => {
    setHeader()
  })

  // Called by submit, use the journal zustand store addEntry
  function setHeader() {
    navigation.setOptions({
      title: route.params.date ? moment(route.params.date).format("LL") : moment().format("LL"),
      headerRight: () => (
        <TouchableOpacity onPress={submit} style={{marginRight: 5}} >
          <Ionicons name={"checkmark-outline"} size={32} color={colors.text} />
        </TouchableOpacity>
      )
    })
  }

  async function submit() {

    console.log("submit")
    Keyboard.dismiss()

    // Check if it is editing an already existing journal entry
    // If so, update it on the database and on zustand

    if (body.length === 0 || title.length === 0) {
      alert("Please enter both a title and body")
      return
    }

    if (isEdit) {
      // Update the db
      const idToken = await auth.currentUser?.getIdToken();

      await fetch(EXPO_PUBLIC_URL + "/journal", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + idToken
        },
        body: JSON.stringify({
          date: new Date().toISOString(),
          title: title,
          body: body,
          uuid: id
        })
      })
      .then((response) => {
        console.log("alsjdfajsdkfhkohokhijh")
        if (response.ok) {
          // We now need to find the entry in our zustand store and remove it
          // Then we append the new edited entry
          removeEntry(id)
          addEntry(title, body, new Date().toISOString(), id)
          console.log("is edit")
          navigation.dispatch(StackActions.popToTop());
        }
        else {
          showToast("error", "Something went wrong", "Please try again later")
        }
      })
      
    }
    else {

      let newUuid = uuid.v4()
      let newDate = new Date().toISOString()

      const idToken = await auth.currentUser?.getIdToken();

      await fetch((EXPO_PUBLIC_URL+ "/journal"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + idToken
        },
        body: JSON.stringify({
          date: newDate,
          title: title,
          body: body,
          is_prompt: isPrompt,
          uuid: newUuid
        }),
      })
      .then((response) => {
        console.log("alsjdfajsdkfhkohokhijh")

        if (response.ok) {
          addEntry(title, body, newDate, newUuid)
          setIsEdit(true)
          setId(newUuid)
          console.log("pre pop")
          navigation.dispatch(StackActions.popToTop());
          console.log("should pop to top")
        }
        else {
         throw new Error()
        }
      })
      .catch((error) =>  showToast("error", "Something went wrong", "Please try again later"))
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardDismissMode={Platform.OS === "ios" ? "interactive" : "on-drag"} keyboardShouldPersistTaps={"handled"}>
        <View style={{padding: 10, borderRadius: 10, backgroundColor: colors.card, marginBottom: 10, flex: 1}}>
          <TextInput
            placeholder="Title"
            placeholderTextColor="gray"
            multiline
            maxLength={40}
            onChangeText={(txt) => setTitle(txt)}
            value={title}
            style={{flexGrow: 1, color: colors.text}}
          />
        </View>

        <View style={{padding: 10, borderRadius: 10, backgroundColor: colors.card, marginBottom: 10, flex: 30}}>
          <TextInput
            placeholder="Body"
            placeholderTextColor="gray"
            multiline
            onChangeText={txt => setBody(txt)}
            value={body}
            style={{flexGrow: 1, color: colors.text, textAlignVertical: "top"}}
          />
        </View>
      </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10
  },
})