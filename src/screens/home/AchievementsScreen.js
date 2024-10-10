import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList, Image } from "react-native"
import { useTheme } from "@react-navigation/native"
import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from "react";
import { useAchievementStore, useUserStore } from "../../stores";
const achievements = require("../../../Achievements.json")

function Achievement({ item, index, setSelectedAchievement, setIsModalOpen }) {

    const { colors } = useTheme()

    const userStats = useUserStore((store) => store.stats)
    console.log(userStats)

    console.log(item)
    console.log(item.requirement.length)
    const currCompletetion = userStats[item.user_stat]
    let upperRange = ""
    let level = 1
    for (let i = 0; i < item.requirement.length; i++) {
        console.log(i, item.requirement[i])
        if (item.requirement[i] > currCompletetion) {
            upperRange = item.requirement[i]
            console.log(upperRange, item.requirement[i], "pls")
            break
        }
        level ++
    }

    return (
        <View style={[styles.achievement, {backgroundColor: colors.card, borderColor: colors.border, borderTopRightRadius: index == 0 && 10, borderTopLeftRadius: index == 0 && 10, borderBottomRightRadius: index == achievements.length - 1 && 10, borderBottomLeftRadius: index == achievements.length - 1 && 10 }]}>
            <View style={{margin: 10}}>
                <Image source={require("../../../assets/achievements/trophey.png")} style={{height: 100, width: 100}} />
                <Text style={{color: colors.text, textAlign: "center"}}>Level {level}</Text>
            </View>

            <View style={{marginLeft: 10, marginVertical: 20}}>
                <Text style={{color: colors.text, fontSize: 20, fontWeight: "bold", marginBottom: 16}}>{item.title}</Text>
                <Text style={{color: colors.text, fontSize: 16, marginBottom: 16}}>{item.locked_message}</Text>

                <View style={{flexDirection: "row", alignItems: "center"}}>
                    <View style={{width: 180, height: 14, borderRadius: 10, backgroundColor: colors.border}}>
                        <View style={{width: 180 / (upperRange / currCompletetion), height: 14, borderRadius: 10, backgroundColor: colors.primary}} />
                    </View>
                    <Text style={{color: colors.text, marginLeft: 10}}>{currCompletetion} {upperRange > currCompletetion && "/ " + upperRange}</Text>
                </View>
                
            </View>
        </View>
    )

}

export function AchievementsScreen() {

    const { colors } = useTheme()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedAchievement, setSelectedAchievement] = useState({})

    return (
        <View style={[styles.container]}>

            {/* <FlatList
                data={achievements}
                renderItem={({item}) => <Achievement item={item} setIsModalOpen={setIsModalOpen} setSelectedAchievement={setSelectedAchievement}/>}
            /> */}

            <FlatList
                data={achievements}
                renderItem={({item, index}) => <Achievement item={item} index={index} />}
                contentContainerStyle={{padding: 20}}
                />


            <Modal
                animationType="fade"
                transparent={true}
                visible={isModalOpen}
                onRequestClose={() => {
                    setModalVisible(!isModalOpen);
                }}>
                <View style={styles.centeredView} >
                    <View style={[styles.modalView, {backgroundColor: colors.card}]}>

                        <Ionicons name="medal" color={"gray"} size={100} style={{alignSelf: "center"}}/>
                        <Text style={{color: colors.text}}>{selectedAchievement.msg}</Text>

                        <TouchableOpacity style={{justifyContent: "flex-end", marginTop: 50, backgroundColor: colors.primary, paddingHorizontal: 40, paddingVertical: 10, borderRadius: 10}} onPress={() => setIsModalOpen(false)}>
                            <Text style={{color: colors.text, textAlign: 'center'}}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>

            </Modal>


        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalView: {
        margin: 20,
        borderRadius: 20,
        padding: 30,
        paddingHorizontal: 100,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    header: {
        fontSize: 22,
        fontWeight: "bold"
    },
    achievement: {
        flex: 1, 
        flexDirection: "row", 
        margin: 0,
        borderWidth: 1
    }
})
