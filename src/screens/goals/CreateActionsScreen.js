import { useEffect, useState } from "react"
import { View, StyleSheet, Text, Modal, TextInput, ScrollView, Platform, TouchableOpacity, TouchableWithoutFeedback, Switch, FlatList, Keyboard } from "react-native"
import { useTheme } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useGoalStore } from "../../stores";
import { auth } from "../../../firebaseConfig"
import uuid from "react-native-uuid"
import { StackActions } from "@react-navigation/native";
import { EXPO_PUBLIC_URL } from "@env"

export function CreateActionsScreen({ navigation }) {

    const { colors } = useTheme()
    const [title, setTitle] = useState("")
    const [steps, setSteps] = useState([])
    const [stepModalOpen, setStepModalOpen] = useState(false)
    const [stepName, setStepName] = useState("")
    const [stepStartDate, setStepStartDate] = useState(new Date())
    const [stepDueDate, setStepDueDate] = useState(new Date())
    const [startDate, setStartDate] = useState(new Date())
    const [isStartDatePickerShown, setIsStartDatePickerShown] = useState(false) // For Step
    const [isDueDatePickerShown, setIsDueDatePickerShown] = useState(false) // For Step
    const [isDatePickerShown, setIsDatePickerShown] = useState(false) // For overall goal
    const [reminderEnabled, setReminderEnabled] = useState(false)
    const [isTagModalOpen, setIsTagModalOpen] = useState(false)
    const [tag, setTag] = useState("")
    const tagData = [
        {name: "Academic", icon: "school"},
        {name: "Career", icon: "briefcase"},
        {name: "Social", icon: "share-social"},
        {name: "Personal", icon: "person"},
        {name: "Health", icon: "medkit"},
        {name: "Other", icon: "ellipsis-horizontal-circle"}
    ]
    const [isEditingStep, setIsEditingStep] = useState(false) // Keep track if the step being added is new or editing an old one
    const [editingIndex, setEditingIndex] = useState(-1) // Index of step in the list to be modified
    const id = uuid.v4()

    const addGoal = useGoalStore((store) => store.addGoal)
    const addGoalSteps = useGoalStore((store) => store.addGoalSteps)
    const goalSteps = useGoalStore((store) => store.goalSteps)

    // Update the date on the overall goal
    const onGoalDateChange = (event, selectedDate) => {
        const newDate = selectedDate || startDate
        setIsDatePickerShown(false)
        setStartDate(newDate)
      };

    const onStepStartDateChange = (event, selectedDate) => {
        const newDate = selectedDate || stepStartDate
        setIsStartDatePickerShown(false)
        setStepStartDate(newDate)
    }

    const onStepDueDateChange = (event, selectedDate) => {
        const newDate = selectedDate || stepDueDate
        setIsDueDatePickerShown(false)
        setStepDueDate(newDate)
    }

    async function createGoal() {
        // Check if all required elements are completed

        if (!title.replace(/\s/g, '').length) {
            alert("Please Enter A Valid Goal Name")
            return
        }

        if (steps.length == 0) {
            alert("Please Add At Least One Step")
            return
        }

        const idToken = await auth.currentUser?.getIdToken();

        await fetch(EXPO_PUBLIC_URL + "/goal", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + idToken
            },
            body: JSON.stringify({
                title: title,
                steps: steps,
                start_date: startDate,
                reminder: reminderEnabled,
                tag: tag,
                type: "actions",
                goal_id: id
            })
        })
        .then((response) => {
            if (response.ok) {
                // Create the goal in zustand store
                // Store goal steps in zustand store
                addGoalSteps(id, steps)
                addGoal(title, null, null, startDate, null, reminderEnabled, tag, id, "actions")
                navigation.dispatch(StackActions.popToTop());
            }
            else {
                alert("Network Error")
            }
        })
        .catch((error) => alert("Network Error: " + error))

    }

    function Tag(props) {

        return (
            <TouchableWithoutFeedback onPress={() => setTag(props.item.name)}>
                <View style={{flex: 1, flexDirection: "row", justifyContent: "space-between", padding: 20, backgroundColor: colors.card, borderRadius: 10, alignItems: "center"}}>
                    <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                        <Ionicons name={props.item.icon} color={colors.text} size={20} style={{marginRight: 10}}/>
                        <Text style={{color: colors.text}}>{props.item.name}</Text>
                    </View>

                    <Ionicons name={"checkmark"} color={tag == props.item.name ? colors.text : colors.card} size={20} />                    
                </View>
            </TouchableWithoutFeedback>
        )
    }

    // The render item for each step the user adds for the goal
    function Step(item, index) {

        let containerStyle

        if (index == 0) {
            containerStyle = styles.topButton
        }
        else {
            containerStyle = styles.middleButton
        }

        return (
            <TouchableWithoutFeedback onPress={() => openStepEdit(index)}>
                <View style={[containerStyle, {backgroundColor: colors.card}]}>
                    <Text style={{color: colors.text, flex:1, textAlign: "center", marginRight: 10}}>{index + 1}</Text>
                    <Text style={{color: colors.text, flex: 20,}}>{item.name}</Text>
                </View>
            </TouchableWithoutFeedback>
        )
    }

    // Opens the step edit modal to make changes to an already existing step
    function openStepEdit(index) {
        setIsEditingStep(true)
        setEditingIndex(index) // maybe can delete
        setStepName(steps[index].name)
        setStepStartDate(steps[index].start_date)
        setStepDueDate(steps[index].due_date)
        setStepModalOpen(true)
    }

    // Clears all temporary state for a new entry
    function clearInputs() {
        Keyboard.dismiss()
        setStepName("")
        setStepStartDate(new Date())
        setStepStartDate(new Date())
        setStepDueDate(new Date())
        setStepModalOpen(false)
        setEditingIndex(-1)
        setIsEditingStep(false)
    }

    return (
        <ScrollView style={styles.container} keyboardDismissMode={Platform.OS == "ios" ? "interactive": "on-drag"} keyboardShouldPersistTaps={"handled"}>

            {/* Name */}

            <View style={{flex: 1, backgroundColor: colors.card, borderRadius: 10}}>
            <TextInput
                placeholder="Name Your Goal"
                value={title}
                onChangeText={(txt) => setTitle(txt)}
                style={{flexGrow: 1, padding: 14, color: colors.text}}
                placeholderTextColor={"gray"}
                />
            </View>

            <View style={{marginBottom: 20}} />

            {/* Adding Steps And Step List */}

            {steps.map((step, index) => Step(step, index))}

            <TouchableWithoutFeedback onPress={() => setStepModalOpen(true)}>
                <View style={[steps.length == 0 ? styles.standaloneButton : styles.bottomButton, {backgroundColor: colors.card}]}>
                    <View style={{flexDirection: "row", alignItems: "center"}}>
                        <Ionicons name={"add-circle-outline"} size={20} color={colors.text} style={{marginRight: 10}}/>
                        <Text style={{color: colors.text}}>Add Step</Text>
                    </View>
                </View>
            </TouchableWithoutFeedback>

            <View style={{marginBottom: 20}} />

            {/* Start, Due, and Reminders */}

            <TouchableWithoutFeedback onPress={() => setIsDatePickerShown(!isDatePickerShown)}>
                <View style={[styles.topButton, { backgroundColor: colors.card }]}>
                    <View style={{flexDirection: "row", alignItems: "center"}}>
                        <Ionicons name="calendar-outline" color={colors.text} size={20} style={{marginRight: 10}}/>
                        <Text style={{color: colors.text}}>Start On</Text>
                    </View>
                    <Text style={{color: "white"}}>{startDate.toLocaleDateString()}</Text>
                </View>
            </TouchableWithoutFeedback>

            {isDatePickerShown == true && (
                <DateTimePicker
                    value={startDate}
                    mode={"date"}
                    display={Platform.OS === "ios" ? "inline" : "default"}
                    is24Hour={false}
                    onChange={onGoalDateChange}
                />
            )}

            <TouchableWithoutFeedback>
                <View style={[styles.bottomButton, { backgroundColor: colors.card, paddingVertical: -10 }]}>
                    <View style={{flexDirection: "row", alignItems: "center"}}>
                        <Ionicons name="notifications-outline" color={colors.text} size={20} style={{marginRight: 10}}/>
                        <Text style={{color: colors.text}}>Set a Reminder</Text> 
                    </View>

                    <Switch
                        onValueChange={() => setReminderEnabled(!reminderEnabled)}
                        value={reminderEnabled}
                        />
                </View>
            </TouchableWithoutFeedback>

            <View style={{marginBottom: 20}} />

            {/* Tags */}

            <TouchableWithoutFeedback onPress={() => setIsTagModalOpen(true)}>
                <View style={[styles.standaloneButton, { backgroundColor: colors.card }]}>
                    <View style={{flexDirection: "row", alignItems: "center"}}>
                        <Ionicons name="bookmark-outline" color={colors.text} size={20} style={{marginRight: 10}}/>
                        <Text style={{color: colors.text}}>Tag</Text>
                    </View>

                    <Text style={{color: colors.text}}>{tag}</Text>
                </View>
            </TouchableWithoutFeedback>

            <View style={{marginBottom: 20}} />

            {/* Create Button */}

            <TouchableOpacity onPress={() => createGoal()} style={{backgroundColor: "#5468ff", borderRadius: 10, height: 50, justifyContent: "center", alignItems: "center"}} >
                <Text style={{color: "white"}}>Create</Text>
            </TouchableOpacity>

            {/* Step Modal */}

            <Modal
                animationType="slide"
                transparent={true}
                visible={stepModalOpen}
                onRequestClose={() => setStepModalOpen(!stepModalOpen)}>
                <View style={[styles.completeOnModalView, { backgroundColor: "black"}]}>
                    <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                        <Ionicons name={"close-outline"} color={colors.text} size={30} onPress={clearInputs}/>
                        <Text style={{color: colors.text}}>{isEditingStep ? "Edit Step" : "Add Step"}</Text>
                        <Ionicons name={"checkmark"} color={colors.text} size={30} onPress={() => {
                            // Ensure the name is filled
                            if (!stepName.replace(/\s/g, '').length) {
                                alert("Please enter a name for the step")
                            }
                            else {
                                // If editing update the step
                                // Otherwise, create a new step
                                if (isEditingStep === true) {
                                    const temp = steps;
                                    temp[editingIndex].name = stepName;
                                    temp[editingIndex].start_date = stepStartDate;
                                    temp[editingIndex].due_date = stepDueDate;
                                    setSteps(temp)
                                }
                                else {
                                    setSteps([...steps, {name: stepName, start_date: stepStartDate, due_date: stepDueDate, is_completed: false, completed_date: null, step_id: uuid.v4()}])
                                }
                                clearInputs()
                            }
                        }}/>
                    </View>

                    <View style={{marginBottom: 20}} />

                    <ScrollView keyboardDismissMode={Platform.OS == "ios" ? "interactive" : "on-drag"} keyboardShouldPersistTaps={"handled"}>
                        
                        <View style={{flex: 1, backgroundColor: colors.card, borderRadius: 10}}>
                            <TextInput
                                placeholder="Step"
                                value={stepName}
                                onChangeText={(txt) => setStepName(txt)}
                                style={{padding: 14, color: colors.text}}
                                placeholderTextColor={"gray"}
                            />
                        </View>

                        <View style={{marginBottom: 20}} />

                        <TouchableWithoutFeedback onPress={() => setIsStartDatePickerShown(!isStartDatePickerShown)}>
                            <View style={[styles.topButton, {backgroundColor: colors.card}]}>
                                <View style={{flexDirection: "row"}}>
                                    <Ionicons name={"calendar"} size={20} color={colors.text} style={{marginRight: 10}} />
                                    <Text style={{color: colors.text}}>Start Date</Text>
                                </View>
                                <Text style={{color: colors.text}}>{stepStartDate.toLocaleDateString()}</Text>
                            </View>
                        </TouchableWithoutFeedback>

                        {isStartDatePickerShown == true && (
                            <DateTimePicker
                                value={stepStartDate}
                                mode={"date"}
                                display={Platform.OS === "ios" ? "inline" : "default"}
                                is24Hour={false}
                                onChange={onStepStartDateChange}
                                minimumDate={new Date()}
                                />
                        )}

                        <TouchableWithoutFeedback onPress={() => setIsDueDatePickerShown(!isDueDatePickerShown)}>
                            <View style={[styles.bottomButton, {backgroundColor: colors.card}]}>
                                <View style={{flexDirection: "row"}}>
                                    <Ionicons name={"calendar"} size={20} color={colors.text} style={{marginRight: 10}} />
                                    <Text style={{color: colors.text}}>Due Date</Text>
                                </View>
                                <Text style={{color: colors.text}}>{stepDueDate.toLocaleDateString()}</Text>
                            </View>
                        </TouchableWithoutFeedback>

                        {isDueDatePickerShown == true && (
                            <DateTimePicker
                                value={stepDueDate}
                                mode={"date"}
                                display={Platform.OS === "ios" ? "inline" : "default"}
                                is24Hour={false}
                                onChange={onStepDueDateChange}
                                minimumDate={stepStartDate}
                                />
                        )}

                    </ScrollView>

                </View>
            </Modal>


            {/* Tag Modal */}

            <Modal
                animationType="slide"
                transparent={true}
                visible={isTagModalOpen}
                onRequestClose={() => setIsTagModalOpen(!isTagModalOpen)}>
                <View style={[styles.completeOnModalView, { backgroundColor: "black"}]}>
                    <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                        <Ionicons name={"close-outline"} color={colors.text} size={30} onPress={() => setIsTagModalOpen(false)}/>
                        <Text style={{color: colors.text}}>Tag</Text>
                        <Ionicons name={"checkmark"} color={colors.text} size={30} onPress={() => {
                            // set the tag
                            setIsTagModalOpen(false)
                        }}/>
                    </View>

                    <FlatList
                        data={tagData}
                        renderItem={Tag}
                        numColumns={2}
                        contentContainerStyle={{justifyContent: "space-between"}}
                    />

                </View>
            </Modal>

            
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 10,
        paddingTop: 20
    },
    topButton: {
        flexDirection: "row",
        justifyContent: "space-between",
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        padding: 10,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: "gray",
        alignItems: "center"
    },
    middleButton: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 10,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: "gray",
        alignItems: "center"
    },
    bottomButton: {
        flexDirection: "row",
        justifyContent: "space-between",
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        padding: 10,
        alignItems: "center"
    },

    standaloneButton: {
        flexDirection: "row",
        justifyContent: "space-between",
        borderRadius: 10,
        padding: 10
    },

    modalView: {
        flex: 1,
        alignItems: "center",
        marginTop: 50,
    },

    completeOnModalView: {
        flex: 1,
        marginTop: 50,
        padding: 20
    }
})
