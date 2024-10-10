import { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  Keyboard,
} from "react-native";
import { KeyboardAwareFlatList } from "react-native-keyboard-aware-scroll-view";
import Ionicons from "@expo/vector-icons/Ionicons";
import { auth } from "../../../firebaseConfig";
import { LoadingDots } from "./components/LoadingDots";
import { useChatStore } from "../../stores";
import { useTheme } from "@react-navigation/native";
import { Platform } from "react-native";
import { ActivityIndicator } from "react-native";
const moment = require("moment")
import { EXPO_PUBLIC_URL } from "@env"

function Message(props) {

  const { colors } = useTheme()

  return (
    props?.role == "user" ? (
      <View>
        <View style={{flexDirection: "row", justifyContent: "flex-end"}}>
          <View style={{backgroundColor: colors.primary, padding: 10, margin: 10, borderRadius: 10, maxWidth: "66%"}}>
            <Text style={[styles.text, {color: colors.text}]}>{props.content}</Text>
          </View>
        </View>
        
        <Text style={{textAlign: "right", color: "gray", marginHorizontal: 10, paddingHorizontal: 10, marginTop: -5, marginBottom: 5}}>{moment(props.date).calendar()}</Text>

      </View>
    ) : (
      <View>
        <View style={{backgroundColor: colors.card, padding: 10, margin: 10, borderRadius: 10, maxWidth: "66%"}}>
          <Text style={[styles.text, {color: colors.text}]}>{props.content}</Text>
        </View>

        <Text style={{textAlign: "left", color: "gray", marginHorizontal: 10, paddingHorizontal: 10, marginTop: -5, marginBottom: 5}}>{moment(props.date).calendar()}</Text>

      </View>
    )
  )
}

export function ChatScreen({ route }) {
  const { colors } = useTheme()

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isNewChat, setIsNewChat] = useState(route.params.isNew);
  const [isWaiting, setIsWaiting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const addChat = useChatStore((store) => store.addChat)

  useEffect(() => {
    if (!isNewChat) {
      getMessages();
    }
    setIsLoading(false)
  }, [])

  // When user clicks send, we update the messages useState variable,
  // Which invokes this method
  useEffect(() => {
    if (message?.length > 0) {
      sendMessage();
    }
  }, [messages ?? []]);

  async function getMessages() {

    const idToken = await auth.currentUser?.getIdToken();
    await fetch(`${EXPO_PUBLIC_URL}/chat/messages/${route.params.uuid}`, {
      headers: {
        "Authorization": "Bearer " + idToken
      }
    })
      .then((response) => {
        if (response.ok) {
          return response.json()
        }
        else {
          alert("Error fetching messages")
        }
      })
      .then((data) => {
        if (data && Array.isArray(data)) {
          setMessages(data)
        }
      })
      .catch((error) => alert("Error" + error));

  }

  async function sendMessage() {
    // TODO: add indicator incase the message fails to send
    setMessage("") // Clear the TextInput field

    setTimeout(
      () => {
        setIsWaiting(true);
      },
      500,
      []
    );

    const idToken = await auth.currentUser?.getIdToken();
    console.log("isNewChat sent", isNewChat);
    await fetch(EXPO_PUBLIC_URL + "/chat", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + idToken,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        messages: JSON.stringify(messages),
        isNew: isNewChat,
        chat_id: route.params.uuid,
      })
    })
    .then((response) => {
      if (response.ok) {
        return response.json()
      }
      else {
        throw new Error("Network Error")
      }
    })
    .then((data) => {
      setMessages([...messages, { role: data.role, content: data.content }])
      if (isNewChat) {
        addChat(route.params.uuid, messages[0].content, new Date().toISOString())
      }
      setIsNewChat(false);
    })
    .catch((error) => alert(error));

    setIsWaiting(false);
  }  

  if (isLoading) {
    return (
      <ActivityIndicator size={"large"} style={{flex: 1}} />
    )
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 50 : 0}
    >
      {messages?.length == 0 && (
        <View style={styles.center}>
          <Text style={[styles.hiddenText, {color: colors.text}]}>
            Start chatting by sending a message{'\n'}
            For best results try to be as specific as possible
          </Text>
        </View>
      )}

      <KeyboardAwareFlatList
        data={messages}
        renderItem={({ item }) => (
          <Message role={item.role} content={item.content} date={item.date_sent} />
        )}
        inverted
        contentContainerStyle={{ flexGrow: 1, flexDirection: "column-reverse" }}
        ListFooterComponent={isWaiting && LoadingDots}
        keyboardDismissMode={Platform.OS === "ios" ? "interactive" : "on-drag"}
      />

      <View style={styles.inputArea}>
        <View
          style={{ borderWidth: 1, borderColor: colors.card, marginBottom: 10 }}
        />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <TextInput
            placeholder="Message"
            placeholderTextColor={"grey"}
            style={[styles.textbox, {backgroundColor: colors.card, color: colors.text}]}
            value={message}
            onChangeText={(txt) => setMessage(txt)}
            multiline
            textAlignVertical="center"
          />

          <TouchableOpacity
            onPress={() => setMessages([...messages, { role: "user", content: message }])}
            disabled={message?.trim().length == 0}
          >
            <Ionicons
              name={"arrow-up-circle-outline"}
              size={35}
              color={message?.trim().length > 0 ? colors.primary : "grey"}
            />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    marginTop: "45%",
    alignItems: "center",
  },
  text: {
    fontSize: 16,
  },
  hiddenText: {
    opacity: 0.5,
  },
  textbox: {
    borderRadius: 15,
    borderColor: "white",
    paddingHorizontal: 10,
    paddingTop: 12,
    paddingBottom: 12,
    color: "white",
    width: "90%",
    fontSize: 16,
  },
  inputArea: {
    paddingBottom: 10,
    paddingTop: 10,
    paddingHorizontal: 10,
    marginBottom: 50,
    paddingHorizontal: 10,
  },
  view: {
    width: 5,
    height: 5,
    backgroundColor: "white",
  },
});