import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Button } from "react-native";
import CompleteTodo from "../../components/CompleteTodo";
import { useTheme } from "@react-navigation/native";
import { auth } from "../../../firebaseConfig"
import { EXPO_PUBLIC_URL } from "@env"

export const CompletedChecklistScreen = (props) => {

  const { colors } = useTheme()

  const [completedList, setCompletedList] = useState([]);

  useEffect(() => {
    getTodos();
  }, []);

  // Fetches the users todo list using user's id where is_completed=1
  async function getTodos() {
    const idToken = await auth.currentUser?.getIdToken();
    await fetch(EXPO_PUBLIC_URL + "/checklist/completed/" + auth.currentUser.uid, {
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
        setCompletedList(data);
      })
      .catch((error) => alert(error))
  };

  const deleteTodo = async(index) => {
    const valToDelete = completedList[index];

    const idToken = await auth.currentUser?.getIdToken();

    // Delete from db
    const requestOptions = {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": "Bearer " + idToken
       },
      body: JSON.stringify({
        user_id: auth.currentUser.id,
        id: valToDelete.id,
      }),
    };

    const deletePost = async () => {
      try {
        await fetch(EXPO_PUBLIC_URL + "/checklist/delete", requestOptions);
      } catch (error) {
        alert(error)
      }
    };

    deletePost();

    let todoListCopy = [...completedList];
    todoListCopy.splice(index, 1);
    setCompletedList(todoListCopy);
  };

  function isTodoEmpty() {
    return completedList < 1;
  }

  return (
    <View style={[styles.container, { color: colors.text}]}>
      {
        // We either display empty message, or loop through the todo list and display each item
        isTodoEmpty() ? (
          <View style={styles.emptyView}>
            <Text style={styles.emptyText}>Im empty</Text>
          </View>
        ) : (
          <ScrollView style={styles.items}>
            {completedList.map((todo, index) => {
              return (
                <CompleteTodo
                  key={index}
                  index={index}
                  text={todo.text}
                  date={todo.completed_date}
                  deleteTodo={deleteTodo}
                />
              );
            })}
          </ScrollView>
        )
      }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  suggested: {
    height: 40,
    margin: 20,
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  items: {
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    height: "100%",
  },
  emptyText: {
    textAlign: "center",
    opacity: 0.87,
  },
  emptyView: {
    flex: 1,
    justifyContent: "center",
    opacity: 0.5,
  },
});
