import React, { useEffect, useState } from "react";
import {
  Text,
  StyleSheet,
  ScrollView,
  View,
  TouchableOpacity,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTheme } from "@react-navigation/native"
import { auth } from "../../../firebaseConfig"
import { FlatList } from "react-native-gesture-handler";
import { EXPO_PUBLIC_URL } from "@env"

// update inserts new entry instead of updating
// check the id being passed from route.params
// most likely not getting correct in the first place from db

export function HistoryScreen({ navigation }) {
  
  const { colors } = useTheme()

  const [entries, setEntries] = useState([]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity
            style={{ marginTop: 2, marginRight: 15 }}
            onPress={() => alert("Drop down with sorting options")}
          >
            <Ionicons name="filter-outline" size={32} color="black" />
          </TouchableOpacity>
        </View>
      ),
    });
    getHistory();
  }, []);

  async function getHistory() {
    const idToken = await auth.currentUser?.getIdToken();

    await fetch(EXPO_PUBLIC_URL + "/journal/" + auth.currentUser.uid, {
      headers: {
        "Authorization": "Bearer " + idToken
      }
    })
      .then((response) => {
        if (response.ok) {
          return response.json()
        }
        else {
          throw new Error()
        }
      })
      .then((data) => {
        setEntries(data)
      })
      .catch((error) => alert(error))
  }

  function isJournalEmpty() {
    return entries.length < 1;
  }

  // We navigate to the write screen passing the title, body and date
  function handlePress(item) {
    navigation.navigate("Free Write", {
      title: item.title,
      body: item.body,
      date: item.date,
      isEdit: true,
      id: item.id
    })
  }

  // Journal entry component
  function JournalEntry(item) {
    return (
      <TouchableOpacity style={[styles.item, {backgroundColor: colors.card}]} onPress={() => handlePress(item)}>
        <Text numberOfLines={1} style={[styles.titleText, {color: colors.text}]}>
          {item.title}
        </Text>
        <Text numberOfLines={1} style={{color: colors.text}}>
          {item.body}
        </Text>
        <Text style={[styles.dateText, {color: colors.text}]}>{item.date}</Text>
      </TouchableOpacity>
    );
  }

  if (isJournalEmpty()) {
    return (
      <View style={styles.emptyView}>
        <Text style={[styles.emptyText, {color: colors.text}]}>Nothing Here</Text>
      </View>
    );
  } else {
    return (
      <FlatList
        data={entries}
        renderItem={({ item }) => JournalEntry(item)}
        numColumns={1}
        style={styles.items}
        />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  items: {
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    height: "90%",
  },
  emptyText: {
    textAlign: "center",
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
    marginBottom: 10,
  },
  titleText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  dateText: {
    fontSize: 12,
    opacity: 0.5,
  },
});
