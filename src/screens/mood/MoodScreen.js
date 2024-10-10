import { useEffect } from "react";
import { FlatList, StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { auth } from "../../../firebaseConfig";
import { useTheme } from "@react-navigation/native";
import { EmptyMessage } from "../../components/EmptyMessage"
import { useMoodTrackerStore } from "../../stores";
import { useActionSheet } from "@expo/react-native-action-sheet";
const moment = require('moment')
import { EXPO_PUBLIC_URL } from "@env"

function Mood({ item, navigation }){

    const { colors } = useTheme()
    const { showActionSheetWithOptions } = useActionSheet();
    const removeMood = useMoodTrackerStore((store) => store.removeMood)

    console.log(item)


    function showOptions() {
        const options = ['Edit', 'Delete', 'Cancel'];
        const destructiveButtonIndex = 1;
        const cancelButtonIndex = 2;
    
        showActionSheetWithOptions({
            options,
            cancelButtonIndex,
            destructiveButtonIndex
        }, (selectedIndex) => {
            switch (selectedIndex) {
            case 0:
                // Save
                navigation.navigate("Mood Entry", {item})
                break;
    
            case destructiveButtonIndex:
                deleteMood()
                break;
    
            case cancelButtonIndex:
                // Canceled
        }});
    }

    async function deleteMood() {

        const idToken = await auth.currentUser?.getIdToken()

        console.log(item.mood_id)

        await fetch(EXPO_PUBLIC_URL + "/mood/" + item.mood_id, {
            method: "DELETE",
            headers: {
                "Authorization": "Bearer " + idToken
            }
        })
        .then((response) => {
            if (response.ok) {
                removeMood(item.mood_id)
            }
            else {
                throw new Error()
            }
        })
        .catch(() => alert("Something went wrong"))
    }

    // Filter only the activites with the same mood_id

    const moodMap = {
        0: {
            url: require("../../../assets/emotions/face-great.png"),
            tintColor: "green"
        },
        1: {
            url: require("../../../assets/emotions/face-good.png"),
            tintColor: "aqua"
        },
        2: {
            url: require("../../../assets/emotions/face-neutral.png"),
            tintColor: "yellow"
        },
        3: {
            url: require("../../../assets/emotions/face-bad.png"),
            tintColor: "orange"
        },
        4: {
            url: require("../../../assets/emotions/face-terrible.png"),
            tintColor: "red"
        },
    }

    return (
        <TouchableOpacity style={[styles.moodContainer, {backgroundColor: colors.card}]} onPress={showOptions}>
            <View style={{flexDirection: "row", marginLeft: 10, alignItems: "center", marginBottom: 12, justifyContent: "space-between"}}>
                <Image source={moodMap[item.mood].url} style={{height: 50, width: 50}} tintColor={moodMap[item.mood].tintColor} />
                <View>
                    <Text style={[styles.dateText, {color: colors.text}]}>{moment(item.date).format('LL')}</Text>
                    <Text style={[styles.timeText, {color: colors.text}]}>{moment(item.date).format('h:mm a')}</Text>
                </View>
            </View>

            <FlatList
                data={item.emotions}
                renderItem={({item, index}) => {
                    return (
                    <View style={{flexDirection: "row", marginHorizontal: 5}}>
                        {index !== 0 && <View style={{padding: 1, marginRight: 10, borderRadius: 20, backgroundColor: colors.card}} />}
                        <Text style={[styles.text, {color: colors.text}]}>{item}</Text>
                    </View>
                    )
                }}
                style={{marginLeft: 40, flexDirection: "row", flexWrap: "wrap", marginBottom: 10}}
                />


            {item.note?.length > 0 && (
                <View style={{padding: 10, borderRadius: 10}}>
                    <Text style={[styles.text, {color: colors.text}]}>{item.note && item.note}</Text>
                </View>
            )}
            
            
        </TouchableOpacity>
    )
}

export function Header({ navigation }) {

    const { colors } = useTheme()

    return (
        <View style={{padding: 1, borderRadius: 10, backgroundColor: colors.card, padding: 20}}>
            <Text style={{color: colors.text, textAlign: "center", fontSize: 18, marginBottom: 20}}>Select Overall Mood</Text>
            <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                <TouchableOpacity onPress={() => navigation.navigate("Mood Entry", {mood: 0})} style={{justifyContent: "center", alignItems: "center"}}>
                    <Image source={require("../../../assets/emotions/face-great.png")} style={{height: 50, width: 50, marginBottom: 5}} tintColor={"green"} />
                    <Text style={{color: colors.text}}>Great</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("Mood Entry", {mood: 1})} style={{justifyContent: "center", alignItems: "center"}}>
                    <Image source={require("../../../assets/emotions/face-good.png")} style={{height: 50, width: 50, marginBottom: 5}} tintColor={"aqua"} />
                    <Text style={{color: colors.text}}>Good</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("Mood Entry", {mood: 2})} style={{justifyContent: "center", alignItems: "center"}}>
                    <Image source={require("../../../assets/emotions/face-neutral.png")} style={{height: 50, width: 50, marginBottom: 5}} tintColor={"yellow"} />
                    <Text style={{color: colors.text}}>Neutral</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("Mood Entry", {mood: 3})} style={{justifyContent: "center", alignItems: "center"}}>
                    <Image source={require("../../../assets/emotions/face-bad.png")} style={{height: 50, width: 50, marginBottom: 5}} tintColor={"orange"} />
                    <Text style={{color: colors.text}}>Bad</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("Mood Entry", {mood: 4})} style={{justifyContent: "center", alignItems: "center"}}>
                    <Image source={require("../../../assets/emotions/face-terrible.png")} style={{height: 50, width: 50, marginBottom: 5}} tintColor={"red"} />
                    <Text style={{color: colors.text}}>Terrible</Text>
                </TouchableOpacity>
            </View>
        </View>    
    )
}

export function MoodScreen({ navigation }) {

    const { colors } = useTheme()

    const moods = useMoodTrackerStore((store) => store.moods)
    const setMoods = useMoodTrackerStore((store) => store.setMoods)

    useEffect(() => {
        getMoods()
    }, [])

    async function getMoods() {
        const idToken = await auth.currentUser?.getIdToken()

        await fetch( EXPO_PUBLIC_URL + "/mood", {
            headers: {
                "Authorization": "Bearer " + idToken
            }
        })
        .then((response) => {
            if (response.ok) {
                return response.json()
            }
            throw new Error()
        })
        .then((data) => setMoods(data))
        .catch((e) => console.log("error"))
    }

    return (
        <View style={styles.container}>
           
            <FlatList
                data={moods}
                renderItem={({ item }) => <Mood item={item} navigation={navigation} />}
                ListHeaderComponent={<Header navigation={navigation}/>}
                ListHeaderComponentStyle={{marginBottom: 10}}
                ListEmptyComponent={<Text style={{ color: colors.text, fontSize: 16, opacity: 0.5, textAlign: "center", marginTop: 100}}>No Entries Yet. {"\n"} Tap A Mood Above To Start!</Text>}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10
    },
    moodContainer: {
        padding: 10,
        borderRadius: 10,
        marginBottom: 10
    },
    dateText: {
        opacity: 0.5,
        textAlign: "right",
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 5
    },
    timeText: {
        opacity: 0.5,
        textAlign: "right",
        fontSize: 14,
        fontWeight: "bold"
    },
    emotion: {
        height: 30,
        width: 30
    }
})