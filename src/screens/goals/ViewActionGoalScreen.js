import { useState, useMemo } from "react"
import { View, Text, StyleSheet, Button, FlatList, TouchableWithoutFeedback, Alert } from "react-native"
import { useGoalStore } from "../../stores"
import { useTheme } from "@react-navigation/native"
import Ionicons from "@expo/vector-icons/Ionicons";
import { auth } from "../../../firebaseConfig";
const moment = require("moment")
import { EXPO_PUBLIC_URL } from "@env"

function StepCard({item, index, toggleCompletion}) {

    const { colors } = useTheme()
    const completeGoal = useGoalStore((store) => store.completeGoal)
    const incompleteGoal = useGoalStore((store) => store.incompleteGoal)

    return(
        <View style={[styles.card, {backgroundColor: colors.card}]}>
            <View style={{flex: 1, flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                <View style={{flexDirection: "column", justifyContent: "space-between"}}>
                    <Text style={{color: colors.text, fontSize: 16, marginBottom: 5}}>{item.name}</Text>
                    <Text style={{color: "gray"}}>{item.is_completed == true || item.is_completed == 1 ? ("Completed " + moment(item.completed_date).format("l")) : ("Due " + moment(item.due_date).format("l"))}</Text>
                </View>
                
                <TouchableWithoutFeedback onPress={() => toggleCompletion(index, completeGoal, incompleteGoal)}>
                    <View style={[styles.checkbox, {backgroundColor: item.is_completed ? colors.primary : "gray"}]}>
                        <Ionicons name="checkmark" color={colors.text} size={26} style={{opacity: item.is_completed ? 1 : 0}}/>            
                    </View>
                </TouchableWithoutFeedback>
            </View>
            
        </View>
    )
}

export function ViewActionGoalScreen({ route }) {

    const goal = route.params.goal
    const goalSteps = useGoalStore((store) => store.goalSteps)
    const removeAllGoalSteps = useGoalStore((store) => store.removeAllGoalSteps)
    const thisGoalSteps = useMemo(() => {
        return getThisGoalSteps(goal.goal_id, goalSteps)
    }, [goalSteps.length])
    const completeGoalStep = useGoalStore((store) => store.completeGoalStep) // Mark step as complete
    const incompleteGoalStep = useGoalStore((store) => store.incompleteGoalStep) // Mark step as incomplete

    // Retrieve the goal steps that correspond to this goal
    function getThisGoalSteps(goal_id, goalSteps) {
        let steps = []
        for (let i = 0; i < goalSteps.length; i++) {
            if (goalSteps[i].goal_id === goal_id) {
                console.log("equals")
                steps.push(goalSteps[i])
            }
        }
        console.log("steps are : : ", steps)
        return steps
    }

    // Called by StepCard component
    // Changes mutates is_completed and completed_date variables at passed index
    async function toggleCompletion(index, completeGoal, incompleteGoal) {

        console.log(thisGoalSteps[1].is_completed)
        console.log(index, ": index")

        const idToken = await auth.currentUser?.getIdToken();

        if (thisGoalSteps[index].is_completed == 1 || thisGoalSteps[index].is_completed == true) {

            await fetch(EXPO_PUBLIC_URL + "/goal/action/incomplete", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + idToken
                },
                body: JSON.stringify({
                    goal_id: goal.goal_id,
                    step_id: thisGoalSteps[index].step_id,
                })
            })
            .then((response) => {
                if (response.ok) {
                    incompleteGoalStep(thisGoalSteps[index].step_id)
                    incompleteGoal(goal.goal_id)
                }
                else {
                    alert("Network Error")
                }
            })
            .catch((error) => alert("Network Error " + error))

        }
        else {

            await fetch(EXPO_PUBLIC_URL + "/goal/action/complete", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + idToken
                },
                body: JSON.stringify({
                    goal_id: goal.goal_id,
                    step_id: thisGoalSteps[index].step_id,
                })
            })
            .then((response) => {
                if (response.ok) {
                    completeGoalStep(thisGoalSteps[index].step_id)
                    checkRest()
                }
                else {
                    alert("Network Error")
                }
            })
            .catch((error) => alert("Network Error " + error))
            
        }

        // Check to see if all the goal steps are completed
        async function checkRest() {
            let count = 0
            thisGoalSteps.map((item) =>{
                if (item.is_completed === true) {
                    count++
                }
            })

            if (count === thisGoalSteps.length) {
                // Mark the entire goal as completed
                await fetch(EXPO_PUBLIC_URL+ "/goal/action/complete-goal/" + goal.goal_id, {
                    method: "PATCH",
                    headers: {
                        "Authorization": "Bearer " + idToken
                    }
                })
                .then((response) => {
                    if (response.ok) {
                        completeGoal(goal.goal_id)
                    }
                    else {
                        throw new Error("Network Error")
                    }
                })
                .catch((error) => alert(error))
            }
        }
    }

    console.log(thisGoalSteps)

    return (
        <View style={styles.container}>

            <FlatList
                data={thisGoalSteps}
                renderItem={({item, index}) => <StepCard item={item} index={index} toggleCompletion={toggleCompletion}/>}
                ItemSeparatorComponent={<View style={{margin: 10}} />}
                style={{marginTop: 20}}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{margin: 20 }}
            />

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    card: {
        flex: 1, 
        borderRadius: 10, 
        flexDirection: "row", 
        justifyContent: "space-between",
        alignItems: "center",
        padding: 10,
    },
    checkbox: {
        height: 25, 
        width: 25,
        borderRadius: 5, 
        justifyContent: "center", 
        alignItems: "center"
    }
})