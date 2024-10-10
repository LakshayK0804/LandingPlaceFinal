import { useState } from "react"
import { 
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    TouchableWithoutFeedback,
    Switch, 
    ScrollView,
    Platform
} from "react-native"
import { useActionSheet } from "@expo/react-native-action-sheet";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useTheme } from "@react-navigation/native"
import Ionicons from "@expo/vector-icons/Ionicons";
import { auth } from "../../../../firebaseConfig";
import showToast from "../../../utils/DisplayToast";
import uuid from "react-native-uuid"
import { useCheckListStore } from "../../../stores";
import { EXPO_PUBLIC_URL } from "@env"

const moment = require('moment')

export default function AddItem() {

    const { colors } = useTheme()

    const [todo, setTodo] = useState("")
    const [isDatePickerShown, setIsDatePickerShown] = useState(false)
    const [isTimePickerShown, setIsTimePickerShown] = useState(false)
    const [date, setDate] = useState(new Date())
    const [time, setTime] = useState(new Date())
    const [dateText, setDateText] = useState(new Date(Date.now()));
    const [repeatValue, setRepeatValue] = useState(0) // 0 = never, 1 = daily, 2 = weekly, 3 = monthly
    const [reminderValue, setReminderValue] = useState(false) // 0 Yes, 1 = No

    const repeatString = ["Daily", "Weekly", "Monthly", "Never"];
    const { showActionSheetWithOptions } = useActionSheet();

    const checklist = useCheckListStore((store) => store.checklist)
    const addChecklist = useCheckListStore((store) => store.addChecklist)
    const nuke = useCheckListStore((store) => store.removeChecklist)

    // setupHeader()

    // function setupHeader() {
    //     navigation.setOptions({
    //       headerRight: () => (
    //         <TouchableOpacity style={{ paddingRight: 10 }} onPress={insertTodo}>
    //             <Ionicons name="checkmark-outline" size={32} color={colors.text} />
    //         </TouchableOpacity>
    //       )
    //     });
    //   }

    const onDateChange = (event, value) => {
        setDate(value);
        setIsDatePickerShown(false)
    };
    
    const onTimeChange = (event, value) => {
        setTime(value);
        setIsTimePickerShown(false);
    };
    
    function openRecurringMenu() {
    const options = ['Daily', 'Weekly', 'Monthly', 'Never', 'Cancel'];
    const cancelButtonIndex = 4;

    showActionSheetWithOptions({
        options,
        cancelButtonIndex,
    }, (selectedIndex) => {
        if (selectedIndex != 4) {
        setRepeatValue(selectedIndex)
        }
    })
    }

    async function insertTodo() {
        const localSelection = new Date(date.toISOString().split("T")[0] + "T" + time.toISOString().split("T")[1]);

        let id = uuid.v4()
        const checklistObj = {
            creation_date: new Date().toISOString(),
            text: todo,
            due_date: localSelection.toISOString(),
            is_recurring: repeatString != "Never" ? true : false,
            recurring_frequency: repeatString[repeatValue],
            reminder: reminderValue,
            checklist_id: id
        }

        const idToken = await auth.currentUser?.getIdToken();

        await fetch(EXPO_PUBLIC_URL + "/checklist", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + idToken
            },
            body: JSON.stringify(checklistObj)
        })
        .then((response) => {
            if (response.ok) {
                checklistObj.is_complete = 0
                addChecklist(checklistObj)
            }
            else {
                showToast("error", "Network Error", "Please try again later")
            }
        })
        .catch((error) => {
            alert(error);
        });
    }

    function toggleSwitch() {
        setReminderValue(!reminderValue)
    }

    return (
        <ScrollView keyboardDismissMode={Platform.OS === "ios" ? "interactive" : "on-drag"}>
            <View style={styles.container}>
                <TextInput 
                    placeholder="New todo"
                    placeholderTextColor={"gray"}
                    color={colors.text}
                    style={{paddingHorizontal: 20, paddingVertical: 16, backgroundColor: colors.card, marginTop: 20, fontSize: 14, borderWidth: StyleSheet.hairlineWidth}}
                    value={todo}
                    onChangeText={(txt) => setTodo(txt)}
                />

                <TouchableWithoutFeedback onPress={() => setIsDatePickerShown(!isDatePickerShown)}>
                    <View style={{backgroundColor: colors.card, paddingVertical: 15, paddingHorizontal: 20, marginTop: 20, flexDirection: "row", justifyContent: "space-between", borderWidth: StyleSheet.hairlineWidth}}>
                        <Text style={{color: colors.text, fontWeight: "bold"}}>Select Date</Text>
                        <Text style={{color: colors.text, fontWeight: "bold"}}>{date.toLocaleDateString()}</Text>
                    </View>
                </TouchableWithoutFeedback>

                {isDatePickerShown == true && (
                    <DateTimePicker
                        value={date}
                        mode={"date"}
                        display={Platform.OS === "ios" ? "inline" : "default"}
                        is24Hour={false}
                        onChange={onDateChange}
                        minimumDate={new Date()}
                    />
                )}

                <TouchableWithoutFeedback onPress={() => setIsTimePickerShown(!isTimePickerShown)}>
                    <View style={{backgroundColor: colors.card, paddingVertical: 15, paddingHorizontal: 20, flexDirection: "row", justifyContent: "space-between", borderWidth: StyleSheet.hairlineWidth, borderTopWidth: 0, marginBottom: 20}}>
                        <Text style={{color: colors.text, fontWeight: "bold"}}>Select Time</Text>
                        <Text style={{color: colors.text, fontWeight: "bold"}}>{time.toLocaleTimeString().substring(0, time.toLocaleTimeString().length - 6)} {time.toLocaleTimeString().substring(time.toLocaleTimeString().length - 2)}</Text>
                    </View>
                </TouchableWithoutFeedback>

                {isTimePickerShown == true && (
                    <DateTimePicker
                        value={time}
                        mode={"time"}
                        display={"spinner"}
                        is24Hour={false}
                        onChange={onTimeChange}
                    />
                )}

                <TouchableOpacity onPress={openRecurringMenu} style={{backgroundColor: colors.card, paddingVertical: 15, paddingHorizontal: 20, flexDirection: "row", justifyContent: "space-between", borderWidth: StyleSheet.hairlineWidth, borderTopWidth: 0}}>
                    <Text style={{color: colors.text, fontWeight: "bold"}}>Repeat Every </Text>
                    <Text style={{color: colors.text, fontWeight: "bold"}}>{repeatString[repeatValue]}</Text>
                </TouchableOpacity>

                <View style={{backgroundColor: colors.card, paddingVertical: 8, paddingHorizontal: 20, alignItems: "center", flexDirection: "row", justifyContent: "space-between", borderWidth: StyleSheet.hairlineWidth, borderTopWidth: 0}}>
                    <Text style={{color: colors.text, fontWeight: "bold"}}>Set Reminder</Text>
                    <Switch
                        trackColor={{false: '#767577', true: '#81b0ff'}}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={toggleSwitch}
                        value={reminderValue}
                    />
                </View>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    titleText: {
    fontWeight: "bold",
    fontSize: 16
    },
    dateText: {
    opacity: 0.5,
    fontWeight: "bold"
    },
  });