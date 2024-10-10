import { useEffect, useRef, useState, useMemo } from "react"
import { View, Text, StyleSheet, TouchableOpacity, SectionList, TouchableWithoutFeedback, Alert, Modal } from "react-native"
import Ionicons from "@expo/vector-icons/Ionicons";
import { useCheckListStore } from "../../stores"
import { useTheme } from "@react-navigation/native";
import { auth } from "../../../firebaseConfig"
import { EmptyMessage } from "../../components/EmptyMessage";
const moment = require("moment")
import { EXPO_PUBLIC_URL } from "@env"

// Render item for the checklist FlatList
function ChecklistItem({ item, setSelectedChecklist }) {
  
  const { colors } = useTheme()
  const dateString = moment(item.due_date).fromNow()
  const toggleCompletion = useCheckListStore((store) => store.toggleCompletion)

  async function toggleMarkComplete() {
    const idToken = await auth.currentUser?.getIdToken();
    await fetch(EXPO_PUBLIC_URL + "/checklist/complete", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + idToken
      },
      body: JSON.stringify({
        checklist_id: item.checklist_id
      })
    })
    .then((response) => {
      if (response.ok) {
        toggleCompletion(item.checklist_id)
      }
      else {
        alert("Network Error")
      }
    })
    .catch((error) => alert("Network Error: " + error))
  }

  return (
    <TouchableOpacity onPress={() => setSelectedChecklist(item)} >
      <View style={{backgroundColor: colors.card, padding: 15, borderRadius: 10, flexDirection: "row", alignItems: "center", marginVertical: 5}}>
        <TouchableWithoutFeedback onPress={toggleMarkComplete}>
          {item.is_completed ? (
            <View style={{height: 25, width: 25, borderRadius: 5, borderWidth: 2, borderColor: colors.border, marginRight: 10, backgroundColor: colors.primary}}>
              <Ionicons name={"checkmark-outline"} size={20} color={"white"} />
            </View>
            ) : (
            <View style={{height: 25, width: 25, borderRadius: 5, borderWidth: 2, borderColor: colors.border, marginRight: 10}} />
          )}
        </TouchableWithoutFeedback>
        <Text style={{color: colors.text, fontWeight: "bold", fontSize: 16, marginRight: 10}}>{item.text}</Text>

        {!item.is_completed && (
          <View style={{backgroundColor: moment(item.due_date).isAfter(moment()) ? colors.border : "#ff3333", borderRadius: 5, padding: 2, marginRight: 10}}>
            <Text style={{color: moment(item.due_date).isAfter(moment()) ? colors.text : colors.text, opacity: dateString !== "Today" ? 0.5 : 1}}>{dateString}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  )
}

export function ChecklistScreen({ navigation }) {

  const { colors } = useTheme()
  const checklist = useCheckListStore((store) => store.checklist)
  const setChecklist = useCheckListStore((store) => store.setChecklist)
  const sectionList = useMemo(() => {
    return createSectionListData()
  }, [checklist])
  const removeChecklist = useCheckListStore((store) => store.removeChecklist)
  const [pressedItem, setPressedItem] = useState({})
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    setupHeader()
    getChecklist()
  }, [])

  async function getChecklist() {

    const idToken = await auth.currentUser?.getIdToken()

    await fetch(EXPO_PUBLIC_URL + "/checklist", {
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
    .then((data) => {
      console.log(data)
      setChecklist(data)
    })
    .catch((e) => console.log(e))
  }

  function createSectionListData() {

    const temp = [
      {
        title: "Ongoing",
        data: checklist.filter(item => item.is_completed === 0 || item.is_completed === false)
      },
      {
        title: "Completed",
        data: checklist.filter(item => item.is_completed === 1 || item.is_completed === true)
      }
    ]

    return temp
  }
  
  function setupHeader() {
    navigation.setOptions({
      headerRight: () => (
        <View>
          <TouchableOpacity style={{ paddingRight: 10 }} onPress={() => navigation.navigate("Create Checklist Item")}>
            <Ionicons name="create-outline" size={32} color={colors.text}/>
          </TouchableOpacity>
        </View>
      ),
    });
  }

  function setSelectedChecklist(item) {
    setPressedItem(item)
    setModalOpen(true)
  }

  function deleteItem() {

    Alert.alert("Delete", "Confirm Delete",[
      {
        text: 'Yes',
        onPress: async() => {
          const idToken = await auth.currentUser?.getIdToken();
          await fetch(`${EXPO_PUBLIC_URL}/checklist?id=${pressedItem.checklist_id}`, {
            method: "DELETE",
            headers: {
              "Authorization": "Bearer " + idToken
            }
          })
          .then((response) => {
            if (response.ok) {
              setModalOpen(false)
              removeChecklist(pressedItem.checklist_id)
              setPressedItem({})
            } 
            else {
              alert("Network Error")
            }
          })
          .catch((error) => alert("Network Error: " + error))

        },
        style: "destructive"
      },
      {
        text: 'No',
        style: 'cancel',
      },
    ] )
  }

  return (
    <View style={styles.container}>

      {sectionList[0].data?.length > 0 || sectionList[1].data?.length > 0 ? (
        <SectionList
          sections={sectionList}
          renderItem={({item}) => <ChecklistItem item={item} setSelectedChecklist={setSelectedChecklist}/>}
          renderSectionHeader={({section}) => {
            if (section.data.length > 0) {
              return <Text style={[styles.header, {color: colors.text}]}>{section.title}</Text>
            }
          }}
        />
      ) : (
        <EmptyMessage />
      )}

      <Modal animationType="slide" visible={modalOpen} transparent>
        <TouchableWithoutFeedback onPress={() => setModalOpen(false)} >
          <View style={{flex:1, justifyContent: "flex-end", alignContent: "center"}}>
            <TouchableWithoutFeedback>

            <View style={{height: 300, padding: 20, backgroundColor: colors.card}}>
              <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 30}}>
                <Text style={{color: colors.text, fontSize: 22, fontWeight: "bold"}}>{pressedItem.text}</Text>
                <Ionicons name={"trash"} size={26} color={"red"} onPress={deleteItem}/>
              </View>
              <View style={{margin: 10}} />
              <View style={{flexDirection: "row", justifyContent: "space-between", borderBottomWidth: 1, borderColor: colors.border, paddingBottom: 5, marginBottom: 10}}>
                <Text style={[styles.dateText, {color: colors.text}]}>Created</Text>
                <Text style={[styles.dateText, {color: colors.text}]}>{moment(pressedItem.creation_date).format("L")}</Text>
              </View>

              <View style={{flexDirection: "row", justifyContent: "space-between", borderBottomWidth: 1, borderColor: colors.border, paddingBottom: 5, marginBottom: 10}}>
                <Text style={[styles.dateText, {color: colors.text}]}>{pressedItem.is_completed ? "Completed" : "Complete By"}</Text>
                <Text style={[styles.dateText, {color: colors.text}]}>{pressedItem.is_completed ? moment(pressedItem.date_completed).format("L") : moment(pressedItem.due_date).format("L")}</Text>
              </View>

              <View style={{margin: 10}} />
              
              <View style={{justifyContent: "center", alignItems: "center"}}>
                <TouchableOpacity onPress={() => setModalOpen(false)} style={{height: 50, width: 300, backgroundColor: colors.primary, borderRadius: 10, justifyContent: "center", alignItems: "center"}}>
                  <Text style={{color: "white"}}>Close</Text>
                </TouchableOpacity>
              </View>
              
            </View>
            </TouchableWithoutFeedback>
            
          </View>
        </TouchableWithoutFeedback>
      </Modal>      
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 10
  },
  dateText: {
    fontSize: 16, 
    fontWeight: "bold", 
    opacity: 0.8
  }
})