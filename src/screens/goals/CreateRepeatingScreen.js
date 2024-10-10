import { useEffect, useState, useRef } from "react"
import { View, StyleSheet, Text, Modal, TextInput, ScrollView, Platform, TouchableOpacity, TouchableWithoutFeedback, Switch, FlatList } from "react-native"
import { useTheme } from "@react-navigation/native"
import Ionicons from "@expo/vector-icons/Ionicons";
import { useActionSheet } from "@expo/react-native-action-sheet";
import DateTimePicker from "@react-native-community/datetimepicker";
import uuid from "react-native-uuid"
import { auth } from "../../../firebaseConfig"
import { StackActions } from "@react-navigation/native";
import {useGoalStore, useUserStore} from "../../stores";
import { EXPO_PUBLIC_URL } from "@env"

export function CreateRepeatingScreen({ navigation }) {

    const { colors } = useTheme()

    const [title, setTitle] = useState("")
    const [tempo, setTempo] = useState(1)
    const [temp, setTemp] = useState(1)
    const [tempModalIsOpen, setTempModalIsOpen] = useState(false)
    const [frequency, setFrequency] = useState(0)
    const frequencyList = ['Daily', 'Weekly', 'Monthly', 'Yearly']
    const { showActionSheetWithOptions } = useActionSheet();
    const [startDate, setStartDate] = useState(new Date())
    const [isDatePickerShown, setIsDatePickerShown] = useState(false)
    const [completeOnModalOpen, setCompleteOnModalOpen] = useState(false)
    const [completeOnList, setCompleteOnList] =useState(["S", "M", "T", "W", "TH", "F", "S"])
    const [reminderEnabled, setReminderEnabled] = useState(false)
    const [isTagModalOpen, setIsTagModalOpen] = useState(false)
    const [tag, setTag] = useState("")
    const [tempTag, setTempTag] = useState("")
    const tagData = [
        {name: "Academic", icon: "school"},
        {name: "Career", icon: "briefcase"},
        {name: "Social", icon: "share-social"},
        {name: "Personal", icon: "person"},
        {name: "Health", icon: "medkit"},
        {name: "Other", icon: "ellipsis-horizontal-circle"}
    ]

    const addGoal = useGoalStore((store) => store.addGoal)
    const updateStats = useUserStore((store) => store.updateStats)

    function showFrequencyActionSheet() {
        const options = ['Daily', 'Weekly', 'Monthly', 'Yearly', 'Cancel'];
        const cancelButtonIndex = 4;
4
        showActionSheetWithOptions({
            options,
            cancelButtonIndex,
        }, (selectedIndex) => {
            switch (selectedIndex) {
            case 0: 
                setFrequency(0)
                break;
            case 1:
                setFrequency(1)
                break;
    
            case 2:
                setFrequency(2)
                break;
            case 3:
                setFrequency(3)
                break;
            case cancelButtonIndex:
                break;
    
            }});
    }

    const onStartDateChanged = (event, value) => {
        if (value !== undefined) {
          setStartDate(value);
        }
        setIsDatePickerShown(false)

    };

    function PrintCompleteOn() {

        let string = ""
        let count = 0
        for (let i = 0; i < completeOnList.length; i++) {
            if (completeOnList[i] !== "") {
                string = string.concat(completeOnList[i], " ")
                count++
            }
        }

        if (count === 7 ){
            return <Text style={{color: colors.text}}>Every Day</Text>
        }
        else if (count === 0) {
            return <Text style={{color: colors.text}}>No Days</Text>
        }

        return <Text style={{color: colors.text}}>{string}</Text>
    }

    function editCompleteOnList(name, index) {
        let temp = [...completeOnList]

        if (completeOnList[index] === "") {
            temp[index] = name + " "
        }
        else {
            temp[index] = ""
        }

        setCompleteOnList(temp)
    }

    async function createGoal() {
        // Check if all required elements are completed

        if (!title.replace(/\s/g, '').length) {
            alert("Please Enter A Valid Goal Name")
            return
        }

        const id = uuid.v4()
        const idToken = await auth.currentUser?.getIdToken();

        await fetch(EXPO_PUBLIC_URL + "/goal", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + idToken
            },
            body: JSON.stringify({
                title: title,
                amount: tempo,
                occurrence_level: frequencyList[frequency],
                start_date: startDate,
                complete_on: completeOnList,
                reminder: reminderEnabled,
                tag: tag,
                goal_id: id,
                type: "repeating"
            })
        })
        .then((response) => {
            // If ok, then we add to Zustand store and pop back to goal screen
            if (response.ok) {
                addGoal(title, tempo, frequencyList[frequency], startDate, completeOnList, reminderEnabled, tag, id, "repeating")
                updateStats("total_goal")
                navigation.dispatch(StackActions.popToTop())
            }
            else {
                throw new Error()
            }
        })
        .catch((error) => alert(error))

    }

    function Tag(props) {

        return (
            <TouchableWithoutFeedback onPress={() => setTempTag(props.item.name)}>
                <View style={{flex: 1, flexDirection: "row", justifyContent: "space-between", marginHorizontal: 5, padding: 20, backgroundColor: colors.card, borderRadius: 10, alignItems: "center"}}>
                    <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                        <Ionicons name={props.item.icon} color={colors.text} size={20} style={{marginRight: 10}}/>
                        <Text style={{color: colors.text}}>{props.item.name}</Text>
                    </View>

                    <Ionicons name={"checkmark"} color={tempTag == props.item.name ? colors.text : colors.card} size={20} />                    
                </View>
            </TouchableWithoutFeedback>
        )
    }


    return (
        <ScrollView style={styles.container} keyboardDismissMode={Platform.OS === "ios" ? "interactive": "on-drag"} keyboardShouldPersistTaps={"handled"}>

            {/* Name */}

            <View style={{flex: 1, backgroundColor: colors.card, borderRadius: 10}}>
            <TextInput
                placeholder="Name Your Goal"
                placeholderTextColor={"gray"}
                value={title}
                onChangeText={(txt) => setTitle(txt)}
                style={{flexGrow: 1, padding: 14, color: colors.text}}
                maxLength={45}
                />
            </View>

            <View style={{marginBottom: 20}} />

            {/* Tempo and Frequency */}

            <TouchableWithoutFeedback onPress={() => setTempModalIsOpen(true)}>
                <View style={[styles.topButton, { backgroundColor: colors.card }]}>
                    <View style={{flexGrow: 1, flexDirection: "row", alignItems: "center"}}>
                        <Ionicons name="bulb-outline" color={colors.text} size={20} style={{marginRight: 10}}/>
                        <Text style={{color: colors.text}}>Amount</Text>
                    </View>

                    {temp > 1 ? (
                        <Text style={{color: colors.text}}>{tempo} Times</Text>
                    ) : (
                        <Text style={{color: colors.text}}>{tempo} Time</Text>
                    )}
                </View>
            </TouchableWithoutFeedback>

            <TouchableWithoutFeedback onPress={showFrequencyActionSheet}>
                <View style={[styles.bottomButton, { backgroundColor: colors.card }]}>
                    <View style={{flexDirection: "row", alignItems: "center"}}>
                        <Ionicons name="flash-outline" color={colors.text} size={20} style={{marginRight: 10}}/>
                        <Text style={{color: colors.text}}>Occurence Level</Text>
                    </View>
                    <Text style={{color: "white"}}>{frequencyList[frequency]}</Text>
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

            {isDatePickerShown === true && (
                <DateTimePicker
                    value={startDate}
                    mode={"date"}
                    display={Platform.OS === "ios" ? "inline" : "default"}
                    is24Hour={false}
                    onChange={onStartDateChanged}
                    minimumDate={new Date()}
                    />
            )}

            <TouchableWithoutFeedback onPress={() => setCompleteOnModalOpen(true)}>
                <View style={[styles.middleButton, { backgroundColor: colors.card }]}>
                    <View style={{flexDirection: "row", alignItems: "center"}}>
                        <Ionicons name="checkmark-circle-outline" color={colors.text} size={20} style={{marginRight: 10}}/>
                        <Text style={{color: colors.text}}>Complete On</Text>
                    </View>

                    {PrintCompleteOn()}
                </View>
            </TouchableWithoutFeedback>

            <TouchableWithoutFeedback>
                <View style={[styles.bottomButton, { backgroundColor: colors.card }]}>
                    <View style={{flexDirection: "row", alignItems: "center"}}>
                        <Ionicons name="notifications-outline" color={colors.text} size={20} style={{marginRight: 10}}/>
                        <Text style={{color: colors.text}}>Set a Reminder</Text> 
                    </View>

                    <Switch
                        onValueChange={() => setReminderEnabled(!reminderEnabled)}
                        value={reminderEnabled}
                        style={{margin: -5}}
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


            {/* Modal for amount entry */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={tempModalIsOpen}
                onRequestClose={() => setModalVisible(!modalVisible)}>
                <View style={[styles.modalView, { backgroundColor: "black", width: "100%"}]}>
                    <View style={[styles.modalContentView, { backgroundColor: colors.card}]}>
    
                        <Ionicons name={"close-outline"} color={colors.text} size={25} onPress={() => {
                            setTemp(tempo)
                            setTempModalIsOpen(false)
                        }}/>
                        <Text style={{color: "white"}}>Amount</Text>

                        <Ionicons name={"checkmark"} color={temp.length > 0 ? colors.text : "gray"} size={25} onPress={() => {
                            if (temp.length > 0) {
                                setTempo(temp)
                                setTempModalIsOpen(false)
                            }
                            
                        }}/>

                    </View>

                    <ScrollView keyboardDismissMode={Platform.OS === "ios" ? "interactive" : "on-drag"} contentContainerStyle={{justifyContent: "center", alignItems: "center", backgroundColor: colors.card, marginTop: 20}}>
                        <View style={{backgroundColor: colors.card, width: "100%"}}>
                            <TextInput
                                keyboardType="number-pad"
                                value={temp}
                                onChangeText={(num) => setTemp(num)}
                                autoFocus
                                style={{color: colors.text, fontSize: 50, width: "100%", textAlign: "center"}}
                                placeholderTextColor={"gray"}
                                />
                        </View>
                    </ScrollView>
                    
                </View>
            </Modal>

            {/* Modal for Complete On */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={completeOnModalOpen}
                onRequestClose={() => setCompleteOnModalOpen(!completeOnModalOpen)}>
                <View style={[styles.modalView, { backgroundColor: colors.card}]}>
                    <View style={styles.modalContentView}>
                        <TouchableWithoutFeedback >
                            <Ionicons name={"close-outline"} color={colors.text} size={25} onPress={() => {
                            setTemp(tempo)
                            setCompleteOnModalOpen(false)
                        }}/>
                        </TouchableWithoutFeedback>
                        <Text style={{color: "white"}}>Select Days</Text>

                        <Ionicons name={"checkmark"} color={colors.text} size={25} onPress={() => {
                            setTempo(temp)
                            setCompleteOnModalOpen(false)
                        }}/>
                    </View>

                    <View style={{marginBottom: 20}} />

                    <View style={{margin: 10}}>
                        <TouchableWithoutFeedback onPress={() => editCompleteOnList("S", 0)}>
                            <View style={[styles.topButton, {backgroundColor: colors.card}]}>
                                <Text style={{color: colors.text, fontWeight: completeOnList[0] != "normal" && "bold"}}>Sunday</Text>
                                <Ionicons name="checkmark" size={20} color={completeOnList[0] != "" ? colors.text : colors.card}/>
                            </View>
                        </TouchableWithoutFeedback>

                        <TouchableWithoutFeedback onPress={() => editCompleteOnList("M", 1)}>
                            <View style={[styles.middleButton, {backgroundColor: colors.card}]}>
                                <Text style={{color: colors.text, fontWeight: completeOnList[1] != "normal" && "bold"}}>Monday</Text>
                                <Ionicons name="checkmark" size={20} color={completeOnList[1] != "" ? colors.text : colors.card}/>
                            </View>
                        </TouchableWithoutFeedback>

                        <TouchableWithoutFeedback onPress={() => editCompleteOnList("T", 2)}>
                            <View style={[styles.middleButton, {backgroundColor: colors.card}]}>
                                <Text style={{color: colors.text, fontWeight: completeOnList[2] != "normal" && "bold"}}>Tuesday</Text>
                                <Ionicons name="checkmark" size={20} color={completeOnList[2] != "" ? colors.text : colors.card}/>
                            </View>
                        </TouchableWithoutFeedback>

                        <TouchableWithoutFeedback onPress={() => editCompleteOnList("W", 3)}>
                            <View style={[styles.middleButton, {backgroundColor: colors.card}]}>
                                <Text style={{color: colors.text, fontWeight: completeOnList[3] != "normal" && "bold"}}>Wednesday</Text>
                                <Ionicons name="checkmark" size={20} color={completeOnList[3] != "" ? colors.text : colors.card}/>
                            </View>
                        </TouchableWithoutFeedback>

                        <TouchableWithoutFeedback onPress={() => editCompleteOnList("TH", 4)}>
                            <View style={[styles.middleButton, {backgroundColor: colors.card}]}>
                                <Text style={{color: colors.text, fontWeight: completeOnList[4] != "normal" && "bold"}}>Thursday</Text>
                                <Ionicons name="checkmark" size={20} color={completeOnList[4] != "" ? colors.text : colors.card}/>
                            </View>
                        </TouchableWithoutFeedback>

                        <TouchableWithoutFeedback onPress={() => editCompleteOnList("F", 5)}>
                            <View style={[styles.middleButton, {backgroundColor: colors.card}]}>
                                <Text style={{color: colors.text, fontWeight: completeOnList[5] != "normal" && "bold"}}>Friday</Text>
                                <Ionicons name="checkmark" size={20} color={completeOnList[5] != "" ? colors.text : colors.card}/>
                            </View>
                        </TouchableWithoutFeedback>

                        <TouchableWithoutFeedback onPress={() => editCompleteOnList("S", 6)}>
                            <View style={[styles.bottomButton, {backgroundColor: colors.card}]}>
                                <Text style={{color: colors.text, fontWeight: completeOnList[6] != "normal" && "bold"}}>Saturday</Text>
                                <Ionicons name="checkmark" size={20} color={completeOnList[6] != "" ? colors.text : colors.card}/>
                            </View>
                        </TouchableWithoutFeedback>
                    </View> 
                </View>
            </Modal>

            {/* Tag Modal */}

            <Modal
                animationType="slide"
                transparent={true}
                visible={isTagModalOpen}
                onRequestClose={() => setIsTagModalOpen(!isTagModalOpen)}>
                <View style={[styles.modalView, { backgroundColor: "black"}]}>
                    <View style={styles.modalContentView}>
                        <Ionicons name={"close-outline"} color={colors.text} size={30} onPress={() => {
                            setTempTag(tag)
                            setIsTagModalOpen(false)
                        }}/>
                        <Text style={{color: colors.text}}>Tag</Text>
                        <Ionicons name={"checkmark"} color={colors.text} size={30} onPress={() => {
                            setTag(tempTag)
                            setIsTagModalOpen(false)
                        }}/>
                    </View>

                    <View style={{marginBottom: 20}} />

                    <FlatList
                        data={tagData}
                        renderItem={Tag}
                        numColumns={2}
                        ItemSeparatorComponent={<View style={{margin: 5}} />}
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
        alignItems: "center",
        borderRadius: 10,
        padding: 10
    },
    modalView: {
        flex: 1,
    },
    modalContentView: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 80,
        padding: 10,
        alignItems: "center"
    }
})