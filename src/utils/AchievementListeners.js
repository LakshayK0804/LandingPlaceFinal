import { useEffect, useState } from "react"
import { Modal, View, Text, StyleSheet, TouchableOpacity, Image } from "react-native"
import { useTheme } from "@react-navigation/native"
import { useUserStore } from "../stores"
import { useAchievementStore } from "../stores"
const achievements = require('../../Achievements.json')

export default function AchievementListeners() {

    const { colors } = useTheme()

    const [modalVisible, setModalVisible] = useState(false)
    const [modalData, setModalData] = useState({})

    const stats = useUserStore((store) => store.stats)
    const addAchieved = useAchievementStore((store) => store.addAchieved)
    const achieved = useAchievementStore((store) => store.achieved)

    function notInAchieved(id) {

      for (let i = 0; i < achieved.length; i++) {
        if (achieved[i].id === id) {
          return false
        }
      }

      return true
    }

    // Listener for journal achievements
    // useEffect(() => {
    //     if (stats.total_journal === 1 && notInAchieved(1)){
    //         addAchieved({id: 1, date: new Date().toISOString()})
    //         setModalData(achievements[0])
    //         setModalVisible(true)
    //     }
    // }, [stats.total_journal])

    // // Listener for mood achievements
    // useEffect(() => {
    //     if (stats.total_mood === 1 && notInAchieved(3)){
    //         addAchieved({id: 3, date: new Date().toISOString()})
    //         setModalData(achievements[2])
    //         setModalVisible(true)
    //     }
    // }, [stats.total_mood])

    // // Listener for mood achievements
    // useEffect(() => {
    //     if (stats.total_checklist === 1 && notInAchieved(5)){
    //         addAchieved({id: 5, date: new Date().toISOString()})
    //         setModalData(achievements[4])
    //         setModalVisible(true)
    //     }

    // }, [stats.total_checklist, stats.total_checklist_completed])

    // // Listener for goal achievements
    // useEffect(() => {
    //     if (stats.total_goal === 1 && notInAchieved(8)){
    //         addAchieved({id: 8, date: new Date().toISOString()})
    //         setModalData(achievements[7])
    //         setModalVisible(true)
    //     }
    // }, [stats.total_goal, stats.total_goal_completed])

    return ( 
        <View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}>
                <View style={styles.centeredView}>
                <View style={[styles.modalView, {backgroundColor: colors.card}]}>
                    <Text style={[styles.modalHeader, {color: colors.text}]}>Congrats!</Text>
                    <Image source={require("../../assets/achievements/trophey.png")} style={{height: 130, width: 130, marginBottom: 20}} />
                    <Text style={[styles.modalText, {color: colors.text}]}>{modalData.unlocked_message}</Text>
                    <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary }]} onPress={() => setModalVisible(!modalVisible)}>
                        <Text style={{color: colors.text, textAlign: "center"}}>Confirm</Text>
                    </TouchableOpacity>
                </View>
                </View>
            </Modal>
        </View>
    )
    
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        paddingHorizontal: 40,
        backgroundColor: 'white',
        borderRadius: 20,
        height: 350,
        width: 300,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    button: {
        margin: 10,
        borderRadius: 10,
        padding: 10,
        elevation: 2,
        width: 200,
        textAlign: "center"
    },
    buttonOpen: {
        backgroundColor: '#F194FF',
    },
    buttonClose: {
        backgroundColor: '#2196F3',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
        fontSize: 18
    },
    modalHeader: {
        fontSize: 28,
        paddingTop: 30,
        marginBottom: 10
    },
    image: {
        padding: 30
    }
})