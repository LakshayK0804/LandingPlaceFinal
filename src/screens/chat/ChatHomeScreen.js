import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet, TextInput } from "react-native";
import "react-native-get-random-values";
import uuid from "react-native-uuid";
import { auth } from "../../../firebaseConfig";
import Ionicons from '@expo/vector-icons/Ionicons';
const moment = require("moment");
import { useIsFocused, useTheme } from "@react-navigation/native";
import { EmptyMessage } from "../../components/EmptyMessage";
import { useChatStore } from "../../stores";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { EXPO_PUBLIC_URL } from "@env"

function Chat({ item, navigation }) {
    console.log("Chat item", item);
    // if (!item || !item.title || !item.date) {
    //     return null;
    // }
    if (!item || !item.last_chat_date) {
        return null;
    }
    const { colors } = useTheme()
    const [editing, setEditing] = useState(false)
    const [blurVal, setBlurVal] = useState(-1)
    const [newTitle, setNewTitle] = useState(item.title)
    const removeChat = useChatStore((store) => store.removeChat)
    const { showActionSheetWithOptions } = useActionSheet();  

    // Deletes a chat
    async function deleteChat() {   

        const idToken = await auth.currentUser?.getIdToken();
  
        await fetch(EXPO_PUBLIC_URL + "/chat/" + item.chat_id, {
            method: "DELETE",
            headers: {
                "Authorization": "Bearer " + idToken
            }
        })
        .then((response) => {
            if (response.ok) {
                removeChat(item.chat_id)
            } else {
                throw new Error("Network Error")
            }
        })
        .catch((error) => alert(error))
    }

    // Invoked by holding down on a chat component
    function openOptions() {
    
        const options = ['Delete', 'Cancel'];
        const cancelButtonIndex = 1;

        showActionSheetWithOptions({
            options,
            cancelButtonIndex,
            destructiveButtonIndex: 0
        }, (selectedIndex) => {
            if (selectedIndex == 0) {
                deleteChat()
            }
        })
    }

    return (
        <TouchableOpacity style={styles.chatItem} onLongPress={openOptions}
            onPress={() => {
                navigation.navigate("Chat Screen", { uuid: item.chat_id, isNew: false} )
            }}
        >
            {/* <Text style={{color: colors.text, fontSize: 18}}>{item.title}</Text> */}
            <Text style={[styles.dateText, {color: colors.text}]}>{moment(item.last_chat_date).calendar()}</Text>
        </TouchableOpacity>      
    );
}

export function ChatHomeScreen({ navigation }) {

    const { colors } = useTheme()
    const chats = useChatStore((store) => store.chats)
    const setChats = useChatStore((store) => store.setChats)
    const isFocused = useIsFocused();

    useEffect(() => {
        if (isFocused) {
            console.log("Component mounted");
            setupHeader()
            getChats();
        }
    }, [isFocused]);

    // useEffect(() => {
    //     console.log("Theme changed:", colors);
    // }, [colors]);

    function onNewChat() {
        let id = uuid.v4();
        navigation.navigate("Chat Screen", { uuid: id, isNew: true });
    }

    function setupHeader() {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity style={{ paddingRight: 10 }} onPress={onNewChat}>
                    <Ionicons name="create-outline" size={32} color={colors.text} />
                </TouchableOpacity>
            )
        });
    }

    async function getChats() {

        const idToken = await auth.currentUser?.getIdToken();
        console.log("getchats");

        await fetch(EXPO_PUBLIC_URL + "/chat/", {
            headers: {
                "Authorization": "Bearer " + idToken
            }
        })
        .then((response) => {
            // console.log("getChats response");
            if (response.ok) {
                console.log("ok");
                return response.json()
            } else {
                console.log("network error");
                throw new Error("Network Error")
            }
        })
        .then((data) => {
            if (data) {
                setChats(data)
                // console.log("setChats(data)", chats);
            }
        })
        .catch((error) => alert("Error " + error));
    }

    console.log("chats?.length > 0", chats?.length > 0);

    return (
        <View style={styles.container}>
            {
                (chats?.length > 0 ? (
                    <FlatList
                        data={chats}
                        renderItem={({ item }) => <Chat item={item} navigation={navigation} />}
                        // keyExtractor={(item, index) => index.toString()}
                        keyExtractor={item => item.chat_id}
                        contentContainerStyle={{paddingHorizontal: 10}}
                    />
                ) : (
                    <EmptyMessage />
                ))
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    text: {
        fontSize: 16,
    },
    dateText: {
        opacity: 0.5,
    },
    chatItem: {
        marginVertical: 5,
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: "gray"
    },
});
