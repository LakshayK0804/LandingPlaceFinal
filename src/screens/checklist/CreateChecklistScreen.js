import { useState } from "react"
import { View, Text, TextInput, TouchableOpacity, StyleSheet, TouchableWithoutFeedback, Switch,  ScrollView, Platform } from "react-native"
import { useTheme } from "@react-navigation/native";
import { Modalize } from "react-native-modalize";
import { Portal } from "react-native-portalize";
import { useRef } from "react";
import { useActionSheet } from "@expo/react-native-action-sheet";
import DateTimePicker from "@react-native-community/datetimepicker";

export function CreateChecklistScreen() {

    const { colors } = useTheme()
    const theme = useTheme()

    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")

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

    const modalizeRef = useRef(null)

    // Start Modal Functions
    const onDateChange = (event, value) => {
        if (value !== undefined) {
          setDate(value);
        }
        setIsDatePickerShown(false)
    };
    
    const onTimeChange = (event, value) => {
        if (value !== undefined) {
            setTime(value);
        }
        setIsTimePickerShown(false)
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

    function toggleSwitch() {
        setReminderValue(!reminderValue)
    }
    // End Modal Functions

    return (
        <ScrollView keyboardDismissMode={Platform.OS === "ios" ? "interactive" : "on-drag"}>
            <View style={styles.container}>
                <TextInput 
                    placeholder="Checklist Group Title"
                    placeholderTextColor={"gray"}
                    color={colors.text}
                    style={{paddingHorizontal: 20, paddingVertical: 16, backgroundColor: colors.card, marginTop: 20, fontSize: 14, borderWidth: StyleSheet.hairlineWidth}}
                    value={title}
                    onChangeText={(txt) => setTitle(txt)}
                />

                <TextInput 
                    placeholder="Description (optional)"
                    placeholderTextColor={"gray"}
                    color={colors.text}
                    style={{paddingHorizontal: 20, paddingVertical: 16, backgroundColor: colors.card, fontSize: 14, borderWidth: StyleSheet.hairlineWidth}}
                    value={description}
                    onChangeText={(txt) => setDescription(txt)}
                />

                <View style={{margin: 10}} />

                <TouchableOpacity onPress={() => modalizeRef.current.open()} style={{backgroundColor: colors.card, paddingVertical: 16, paddingHorizontal: 20, flexDirection: "row", justifyContent: "space-between", borderWidth: StyleSheet.hairlineWidth, borderTopWidth: 0}}>
                    <Text style={{color: colors.text, fontWeight: "bold"}}>Add Item</Text>
                </TouchableOpacity>

                <Portal>
                    <Modalize ref={modalizeRef} adjustToContentHeight modalStyle={{backgroundColor: colors.background, borderRadius: 20}} childrenStyle={{height: "100%"}} >
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

                            {isDatePickerShown && (
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

                            {isTimePickerShown && (
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
                    </Modalize>
                </Portal>

            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 10
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