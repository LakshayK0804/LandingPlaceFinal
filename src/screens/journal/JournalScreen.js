import React, { useEffect} from "react";
import { Text, StyleSheet, View, TouchableOpacity, FlatList } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTheme } from "@react-navigation/native";
import { auth } from "../../../firebaseConfig"
import { EmptyMessage } from "../../components/EmptyMessage";
import { useJournalStore } from "../../stores";
import { TouchableWithoutFeedback } from "react-native";
import showToast from "../../utils/DisplayToast";
import {useActionSheet} from "@expo/react-native-action-sheet";
const moment = require('moment')
import { EXPO_PUBLIC_URL } from "@env"

function JournalEntry ({ item, navigation, handleRemoveEntry }) {

  const { colors } = useTheme()
  const { showActionSheetWithOptions } = useActionSheet();

  function showOptions() {
    const options = ['Delete', 'Cancel'];
    const destructiveButtonIndex = 0;
    const cancelButtonIndex = 1;

    showActionSheetWithOptions({
      options,
      cancelButtonIndex,
      destructiveButtonIndex
    }, (selectedIndex) => {
      switch (selectedIndex) {

        case destructiveButtonIndex:
          handleRemoveEntry(item.uuid)
          break;

        case cancelButtonIndex:
          // Canceled
      }});
  }
  return (
      <TouchableOpacity onLongPress={showOptions} onPress={() => navigation.navigate("Free Write", {title: item.title, isEdit: true, uuid: item.uuid, body: item.body, date: item.date})}>
        <View style={styles.entry}>
          <Text style={[styles.titleText, {color: colors.text}]} numberOfLines={1}>{item.title}</Text>
          <View style={{flexDirection: "row"}}>
            <Text style={[styles.dateText, {color: colors.text}]} numberOfLines={1}>{moment(item.date).format("LL")}</Text>
            <Text style={[styles.dateText, {color: colors.text}]} numberOfLines={1}>{item.body}</Text>
          </View>
        </View>
      </TouchableOpacity>
  );
}

export function JournalScreen({ navigation }) {

  const { colors } = useTheme()
  const entries = useJournalStore((store) => store.entries)
  console.log(entries)
  const setEntries = useJournalStore((store) => store.setEntry)
  const removeEntry = useJournalStore((store) => store.removeEntry)

  function handleSetEntry(data) {
    setEntries(data.entries)
  }

  useEffect(() => {
    console.log("journal useeffect");
    setUpHeader();
    getData()
  }, []);

  function setUpHeader() {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity style={{ marginTop: 2, marginRight: 15 }} onPress={() => navigation.navigate("Choice")}>
            <Ionicons name="create-outline" size={32} color={colors.text} />
          </TouchableOpacity>
        </View>
      ),
    });
  }

  async function getData() {
    const idToken = await auth.currentUser?.getIdToken();

    await fetch(EXPO_PUBLIC_URL + "/journal", {
      headers: {
        "Authorization": "Bearer " + idToken
      }
    })
      .then((response) => {
        if (response.ok) {
          return response.json()
        }
        else {
          setEntries([])
          throw new Error()
        }
      })
      .then((data) => {
        handleSetEntry({entries: data})
      })
      .catch((error) => {
        alert("Network Error")
      })
  }

  async function handleRemoveEntry(uuid) {
    const idToken = await auth.currentUser?.getIdToken();

    await fetch(EXPO_PUBLIC_URL + "/journal/", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + idToken
      },
      body: JSON.stringify({
        uuid: uuid,
      })
    })
    .then((response) => {
      if (response.ok) {
        removeEntry(uuid)
      }
      else {
        showToast("error", "Failed", "Try again later")
      }
    })
    .catch(() => showToast("error", "Network Failed"))
  }

  return (
    entries?.length === 0 ? (
      <EmptyMessage />
    ) : (
      <View style={styles.container}>
        <FlatList
          data={entries}
          keyExtractor={(item, index) => index}
          renderItem={({item}) => <JournalEntry item={item} navigation={navigation} handleRemoveEntry={handleRemoveEntry}/>}
          showsVerticalScrollIndicator={false}
        />
      </View>
    )
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10
  },

  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: "white"
  },
  items: {
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    height: "90%",
  },
  emptyText: {
    textAlign: "center",
    color: "white",
  },
  emptyView: {
    flex: 1,
    justifyContent: "center",
    opacity: 0.5,
  },
  item: {
    padding: 10,
    borderRadius: 10,
    justifyContent: "space-between",
    marginBottom: 10
  },
  titleText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  bodyText: {
    color: "white",
  },
  dateText: {
    fontSize: 12,
    opacity: 0.5,
    color: "white",
    fontWeight: "bold",
    marginRight: 10
  },
  entry: {
    padding: 10, 
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "gray"
  }
});