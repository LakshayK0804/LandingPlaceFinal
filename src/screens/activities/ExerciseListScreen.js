import { useState, useEffect } from "react"
import {View, Text, TouchableOpacity, StyleSheet, FlatList, TouchableWithoutFeedback} from "react-native"
import { useTheme } from "@react-navigation/native"
import {MaterialCommunityIcons, MaterialIcons} from '@expo/vector-icons';
import { auth } from "../../../firebaseConfig"
import HeaderText from "./components/HeaderText";
import { EXPO_PUBLIC_URL } from "@env"


function Exercise({ item, index, navigation }) {

    const { colors } = useTheme()

    return (
        <TouchableWithoutFeedback onPress={ ()=> navigation.navigate("Complete Exercise", {id: item._id, title: item.title})}>
            <View style={[styles.meditationCard, { backgroundColor: colors.card }]}>
                <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                    <Text style={{color: colors.text, fontSize: 18}}>{item.title}</Text>
                    <MaterialIcons name="check-circle" size={24} color={colors.card}/>
                </View>

                <View style={{flexDirection: "row", alignItems: "center", marginBottom: 10}}>
                    <Text style={[ styles.categoryText, {color: colors.text}]}>{"Category"} • {"2m"}</Text>
                </View>
                
                <Text style={{color: colors.text}}>This is a short description of what the medidation is about and what i might need to know beforehand.</Text>

            </View>
        </TouchableWithoutFeedback>
    )
}

export function ExerciseListScreen({ navigation }) {

    const { colors } = useTheme()

    const [completedActivites, setCompletedActivites] = useState([])
    const [exercises, setExercises] = useState()

    useEffect(() => {
        getData()
    }, [])

    async function getData() {
        const idToken = await auth.currentUser?.getIdToken()

        await fetch(EXPO_PUBLIC_URL + "/exercise", {
            headers: {
                "Authorization": "Bearer " + idToken
            }
        })
        .then((response) => {
            if (response.ok) {
                return response.json()
            }
            throw new Error("Could not retrieve activites.")
        })
        .then((data) => setExercises(data))
        .catch((error) => alert(error))
    }

    return (
        <View>
            <FlatList
                data={exercises}
                renderItem={({ item }) => <Exercise item={item} navigation={navigation}/>}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    meditationCard: {
        padding: 20,
        borderRadius: 10,
        margin: 10,
        justifyContent: "center" 
    },
    categoryText: {
        fontSize: 14,
        opacity: 0.5
    },
    categoryContainer: {
        alignSelf: 'flex-start',
        padding: 2,
        borderRadius: 10
    }
})