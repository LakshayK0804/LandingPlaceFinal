import React, { useMemo, useState, useContext } from "react"
import { View, StyleSheet, FlatList, Text, Platform, TouchableOpacity } from "react-native"
import { useGoalStore } from "../../stores"
import { useTheme } from "@react-navigation/native"
import { Modalize } from "react-native-modalize"
import { useRef } from "react"
import { TextInput } from "react-native"
import DateTimePicker from "@react-native-community/datetimepicker"
// import { GoalContext } from "../../navigation/RepeatingGoalStack";
import { auth } from "../../../firebaseConfig"
import showToast from "../../utils/DisplayToast";
import Ionicons from "@expo/vector-icons/Ionicons";
const moment = require("moment")
import { EXPO_PUBLIC_URL } from "@env"

// Render item for the logs FlatList
function Log({ item, index, length, openModal }) {

    const { colors } = useTheme()
    const num = length - index

    return (
        <TouchableOpacity onPress={() => openModal(item, num)} style={[styles.logItem, {backgroundColor: colors.card}]}>
            <Text style={{color: colors.text, fontSize: 16}}>{num + ". " + moment(item.date_completed).format("llll")}</Text>

            {item.note && (
                <Text style={{color: colors.text, opacity: 0.5, marginLeft: 20, marginTop: 5}}>{item.note}</Text>
            )}
        </TouchableOpacity>
    )
}

export function RepeatingLogsScreen({ route }) {

    const { colors } = useTheme()

    const goal = route.params.goal
    const logs = getLogs()
    const updateCompletedGoal = useGoalStore((store) => store.updateCompletedGoal)
    const removeCompletedGoal = useGoalStore((store) => store.removeCompletedGoal)
    const modalRef = useRef(null)
    const [modalData, setModalData] = useState({})
    const [index, setIndex] = useState(0)
    const [note, setNote] = useState()
    const [date, setDate] = useState(new Date())

    function getLogs() {
        let temp = useGoalStore((store) => store.completedGoals)
        return temp.filter((log) => log.goal_id === goal.goal_id)
    }

    function openModal(item, ind) {
        setModalData(item)
        setIndex(ind)
        setNote(item.note)
        setDate(new Date(item.date_completed))
        modalRef.current.open()
    }

    const onDateChange = (event, value) => {
        if (event.type === "set")
            setDate(value)
    };

    const onTimeChange = (event, value) => {
        if (event.type === "set")
            setDate(value)
    };

    function clearValues() {
        setNote("")
    }

    async function updateEntry() {

        const entryObj = {
            goal_id: goal.goal_id,
            date_completed: date,
            note: note,
            log_num: modalData.log_num
        }

        const idToken = await auth.currentUser?.getIdToken();

        await fetch(EXPO_PUBLIC_URL + "/goal/complete", {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + idToken
            },
            body: JSON.stringify(entryObj)
        })
        .then((response) => {
            if (response.ok) { 
                updateCompletedGoal(entryObj)
                showToast("success", "Sucess!", "Log updated")
                modalRef.current.close()
            }
            else {
                alert("Network Error")
            }
        })
        .catch((error) => alert("Error: " + error))
    }

    async function deleteEntry() {

        const idToken = await auth.currentUser?.getIdToken();

        await fetch(`${EXPO_PUBLIC_URL}/goal/complete?goal_id=${modalData.goal_id}&log_num=${modalData.log_num}&uid=${auth.currentUser.uid}`, {
            method: "DELETE",
            headers: {
                "Authorization": "Bearer " + idToken
            }
        })
        .then((response) => {
            if (response.ok) {
                removeCompletedGoal(modalData.goal_id, modalData.log_num)
                modalRef.current.close()
            }
            else {
                alert("Network Error")
            }
        })
        .catch((error) => alert("Network Error: " + error))
    }

    return (
        <View style={styles.container}>
            
            {useMemo(() => (
                <FlatList
                    data={logs}
                    renderItem={({item, index}) => <Log item={item} index={index} length={logs.length} openModal={openModal}/> }
                    ItemSeparatorComponent={<View style={{margin: 5}} />}
                />
            ),[logs])}
            
            <Modalize
                ref={modalRef}
                adjustToContentHeight
                modalStyle={{backgroundColor: colors.background, flex: 1, marginTop: 100}}
                childrenStyle={{margin: 10}}
                onClosed={clearValues}
            >
                
                <View style={{backgroundColor: colors.card, padding: 10, borderRadius: 10, marginVertical: 10, flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                    <Ionicons name={"close-outline"} color={colors.text} onPress={() => modalRef.current.close()} size={25} />
                    <Text style={{color: colors.text, textAlign: "center", fontSize: 16}}>Log {index}</Text>
                    <Ionicons name={"trash-outline"} color={"red"} onPress={deleteEntry} size={25} />
                </View>
                
                <View style={[styles.buttonTop, {backgroundColor: colors.card, borderColor: colors.border}]} >
                    <Text style={{color: colors.text}}>Date</Text>
                    <DateTimePicker
                        mode="date"
                        display={Platform.OS === "ios" ? "default" : "calendar"}
                        onChange={onDateChange}
                        value={date}
                    />
                </View>

                <View style={[styles.buttonBottom, {backgroundColor: colors.card}]} >
                    <Text style={{color: colors.text}}>Time</Text>
                    <DateTimePicker
                        mode="time"
                        display={"default"}
                        onChange={onTimeChange}
                        value={date}
                    />
                </View>

                <View style={[styles.textInputContainer, {backgroundColor: colors.card}]}>
                    <TextInput
                        value={note}
                        onChangeText={(txt) => setNote(txt)}
                        placeholder="Add Note"
                        placeholderTextColor={"gray"}
                        style={{color: colors.text, flex: 1}}
                    />
                </View>

                <View style={{margin: 10}} />

                <TouchableOpacity onPress={updateEntry} style={{borderRadius: 10, height: 50, backgroundColor: colors.primary, justifyContent: "center", alignItems: "center"}}>
                    <Text style={{color: "white"}}>Update</Text>
                </TouchableOpacity>
                
            </Modalize>
        </View>
    )
        
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10
    },
    logItem: {
        padding: 10,
        borderRadius: 10,
    },
    textInputContainer: {
        marginTop: 10,
        padding: 10,
        height: 100,
        borderRadius: 10
    },
    buttonTop: {
        marginTop: 10,
        padding: 10,
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        borderBottomWidth: 1,
        alignItems: "center"
    },
    buttonBottom: {
        padding: 10,
        borderBottomRightRadius: 10,
        borderBottomLeftRadius: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 10,
        alignItems: "center"
    }
})