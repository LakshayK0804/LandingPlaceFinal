import { useEffect, useState } from "react"
import { View, FlatList, Text, StyleSheet, Image, TouchableOpacity, Button} from "react-native"
import { useTheme } from "@react-navigation/native"
import Ionicons from "@expo/vector-icons/Ionicons";
import { useGoalStore } from "../../stores";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { auth } from "../../../firebaseConfig";
const moment = require("moment")
import { EXPO_PUBLIC_URL } from "@env"

function showOptions(item, showActionSheetWithOptions, removeGoal, removeExtras) {

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
            deleteGoal(item.goal_id, removeGoal, removeExtras)
            break;

        case cancelButtonIndex:
            // Canceled
      }
  });
}

async function deleteGoal(goal_id, removeGoal, removeExtras) {

  const idToken = await auth.currentUser?.getIdToken()
  console.log("goal id", goal_id)

  await fetch(EXPO_PUBLIC_URL + "/goal?id=" + goal_id, {
    method: "DELETE",
    headers: {
      "Authorization": "Bearer " + idToken
    }
  })
  .then((result) => {
    if (result.ok) {
      console.log("ok")
      removeGoal(goal_id)
      removeExtras(goal_id) // This will either be removing the goal logs for repeating goals or the goal steps for the steps goal type
    }
    else {
      throw new Error()
    }
  })
  .catch((error) => alert(error))
}


function RepeatingCard({item, navigation}) {

  console.log(item)

  const { colors } = useTheme()
  const { showActionSheetWithOptions } = useActionSheet();
  const completedGoals = useGoalStore((store) => store.completedGoals)
  const removeGoal = useGoalStore((store) => store.removeGoal)
  const removeCompleteGoals = useGoalStore((store) => store.removeCompleteGoals)
  const currDate = new Date().toLocaleDateString()

  let count = 0
  if (item.occurrence_level === "Daily") {
    for (let i = 0; i < completedGoals.length; i++) {
      if (item.goal_id === completedGoals[i].goal_id && currDate === new Date(completedGoals[i].date_completed).toLocaleDateString()) {
        count++
      }
    }
  }
  else if (item.occurrence_level === "Weekly") {
    for (let i = 0; i < completedGoals.length; i++) {
      if (item.goal_id === completedGoals[i].goal_id && moment().isAfter(moment(completedGoals[i].date_completed).startOf("week").toLocaleString()) && moment().isBefore(moment(completedGoals[i].date_completed).endOf("week").toLocaleString())) {
        count++
      }
    }
  }
  else if (item.occurrence_level === "Monthly") {
    for (let i = 0; i < completedGoals.length; i++) {
      if (item.goal_id === completedGoals[i].goal_id && moment().isAfter(moment(completedGoals[i].date_completed).startOf("month").toLocaleString()) && moment().isBefore(moment(completedGoals[i].date_completed).endOf("month").toLocaleString())) {
        count++
      }
    }
  }
  else if (item.occurrence_level === "Yearly") {
    for (let i = 0; i < completedGoals.length; i++) {
      if (item.goal_id === completedGoals[i].goal_id && moment().isAfter(moment(completedGoals[i].date_completed).startOf("year").toLocaleString()) && moment().isBefore(moment(completedGoals[i].date_completed).endOf("year").toLocaleString())) {
        count++
      }
    }
  }

  return (
    <TouchableOpacity onPress={() => navigation.navigate("View Repeating Goal", {goal: item, name: item.title})} onLongPress={() => showOptions(item, showActionSheetWithOptions, removeGoal, removeCompleteGoals)}
      style={[styles.card, {backgroundColor: colors.card}]}>
      <View>
        <Text style={{color: colors.text, marginBottom: 5}}>{item.title}</Text>
        <Text style={{color: "gray"}}>{item.occurrence_level}</Text>
      </View>
      <View style={{flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between"}}>
        <Text style={{color: colors.text}}>{count} of {item.amount}</Text>
      </View>
    </TouchableOpacity>
  )
}

function StepCard({ item, navigation }) {

  const { colors } = useTheme()
  const goalSteps = useGoalStore((store) => store.goalSteps)
  const removeGoal = useGoalStore((store) => store.removeGoal)
  const removeGoalSteps = useGoalStore((store) => store.removeGoalSteps)
  const { showActionSheetWithOptions } = useActionSheet();
  const steps = goalSteps.filter((tmp) => tmp.goal_id === item.goal_id)

  let completedSteps = 0
  for (let i = 0; i < steps.length; i++) {
    if (steps[i].is_completed === true || steps[i].is_completed == 1) {
      completedSteps++
    }
  }

  return (
    <TouchableOpacity onPress={() => navigation.navigate("View Action Goal", {goal: item, name: item.title, steps: steps})} onLongPress={() => showOptions(item, showActionSheetWithOptions, removeGoal, removeGoalSteps)}
      style={[styles.card, {backgroundColor: colors.card}]}>
      <Text style={{color: colors.text}}>{item.title}</Text>
      <Text style={{color: colors.text}}>{completedSteps} of {steps.length}</Text>
    </TouchableOpacity>
  )
}

function AchievedCard({ item }) {
  
  const { colors } = useTheme()

  return (
    <View style={[styles.card, {backgroundColor: colors.card}]}>
      <Text style={{color: colors.text}}>{item.title}</Text>
      <Text style={{color: "gray"}}>{moment(item.completed_date).format("MMM Do YYYY")}</Text>
    </View>
  )
}

export function GoalScreen({ navigation }) {

  const { colors } = useTheme()
  const goals = useGoalStore((store) => store.goals)
  const setGoals = useGoalStore((store) => store.setGoals)
  const setGoalSteps = useGoalStore((store) => store.setGoalSteps)
  const setCompletedGoals = useGoalStore((store) => store.setCompletedGoals)
  const destroy = useGoalStore((store) => store.destroy)
  const repeatingGoals = goals.filter((tmp) => tmp.type === "repeating")
  const actionGoals = goals.filter((tmp) => tmp.type === "actions")
  const [avatarMessage, setAvatarMessage] = useState("Hello!")

  useEffect(() => {
    setupHeader()
    getGoals()
  }, [])

  function setupHeader() {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity style={{ paddingRight: 10 }} onPress={() => {
          navigation.navigate("Create Goal");
        }}>
            <Ionicons name="create-outline" size={32} color={colors.text} />
        </TouchableOpacity>
      )
    });
  }

  async function getGoals() {

    const idToken = await auth.currentUser?.getIdToken()
    await fetch(EXPO_PUBLIC_URL + "/goal", {
      headers: {
        "Authorization": "Bearer " + idToken
      }
    })

    .then((results) => {
      if (results.ok) {
        return results.json()
      }
      throw new Error()
    })
    .then((data) => {
      setGoalSteps(data[2])
      setCompletedGoals(data[1])
      setGoals(data[0])
    })
    .catch((e) => console.log(e))
  }

  return (
    <View style={styles.container}>

      {
        (repeatingGoals.length > 0 ) && (
          <View>
            <View style={styles.goalGroup}>
              <View style={styles.goalGroupHeader}>
                <Text style={[styles.headerText, {color: colors.text}]}>Repeating</Text>
                <Ionicons name={"add-outline"} size={25} color={colors.text} onPress={() => navigation.navigate("Create Repeating Goal")} />
              </View>

              <FlatList 
                data={repeatingGoals}
                renderItem={({item}) => <RepeatingCard item={item} navigation={navigation}/>}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{marginTop: 10}}
                ItemSeparatorComponent={<View style={{marginHorizontal: 10}} />}
              />
              
            </View>
          </View>
        )
      }
      
      {
        actionGoals.length > 0 && (
        <View>
          <View style={styles.goalGroup}>
            <View style={styles.goalGroupHeader}>
              <Text style={[styles.headerText, {color: colors.text}]}>Actions</Text>
              <Ionicons name={"add-outline"} size={25} color={colors.text} onPress={() => navigation.navigate("Create Actions Goal")} />
            </View>
            
            <FlatList 
              data={actionGoals}
              renderItem={({item}) => <StepCard item={item} navigation={navigation}/>}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{marginTop: 10}}
              ItemSeparatorComponent={<View style={{marginHorizontal: 10}} />}
            />
          </View>
        </View>
        )
      }

      {
        goals.length == 0 && (
          <View style={{flex: 1, justifyContent: "center", alignItems: "center", opacity: 0.5}}>
            <Text style={{color: colors.text}}>No Active Goals</Text>
            <Text style={{color: colors.text}}>Tap <Ionicons name={"create-outline"} size={15} color={colors.text} /> to create one</Text>
          </View>
        )
      }

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 150,
    borderRadius: 10,
    margin: 10,
    flexDirection: "row",
  },
  headerText: {
    fontWeight: "bold",
    fontSize: 18
  },
  goalGroup: {
    marginHorizontal: 20,
    marginVertical: 10,
  },
  goalGroupHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  card: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    height: 120,
    width: 120,
    borderRadius: 10,
    padding: 10
  },
  footer: {
    margin: 20,
  },
  avatar: {
    width: 200,
    height: 150,
  },
  avatarText: {
    backgroundColor: "#484848",
    marginVertical: 10,
    borderRadius: 50,
    width: 180,
    marginLeft: -20
  }
})