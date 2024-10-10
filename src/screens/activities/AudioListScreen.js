import { useState, useEffect} from "react";
import {View, Text, StyleSheet, TouchableWithoutFeedback, FlatList, TextInput} from "react-native";
import { useTheme} from "@react-navigation/native";
import { auth } from "../../../firebaseConfig"
import {MaterialIcons} from "@expo/vector-icons";
import { EXPO_PUBLIC_URL } from "@env"

function Meditation({ item, index, navigation }) {

    const { colors } = useTheme()

    return (
        <TouchableWithoutFeedback onPress={ ()=> navigation.navigate("Play Audio", {id: item.id})}>
            <View style={[styles.meditationCard, { backgroundColor: colors.card }]}>
                <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                    <Text style={{color: colors.text, fontSize: 18}}>{item.title}</Text>
                    <MaterialIcons name="star" size={24} color={colors.card}/>
                </View>

                <View style={{flexDirection: "row", alignItems: "center", marginBottom: 10}}>
                    <Text style={[ styles.categoryText, {color: colors.text}]}>{"Category"} • {"2m"}</Text>
                </View>
                
                <Text style={{color: colors.text}}>This is a short description of what the medidation is about and what i might need to know beforehand.</Text>

            </View>
        </TouchableWithoutFeedback>
    )
}

export function AudioListScreen({ navigation }) {

    const { colors } = useTheme()
    const [audio, setAudio] = useState([])

    useEffect(() => {
        getData()
    }, []);

    async function getData() {
        const idToken = await auth.currentUser?.getIdToken()

        fetch(EXPO_PUBLIC_URL + "/audio/all", {
            headers: {
                "Authorization": "Bearer " + idToken
            }
        })
        .then((response) => {
            if (response.ok) {
                return response.json()
            }
            else {
                throw new Error()
            }
        })
        .then((data) => setAudio(data))
        .catch((error) => alert(error))
    }

    return (
        <View>
            <FlatList
                data={audio}
                renderItem={({item, index}) => <Meditation item={item} index={index} navigation={navigation}/>}
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