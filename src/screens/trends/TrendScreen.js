import { useEffect } from "react"
import { View, Text, Button, StyleSheet, ScrollView } from "react-native"
import { useAchievementStore, useUserStore, useMoodTrackerStore } from "../../stores"
import { auth } from "../../../firebaseConfig"
import { useTheme } from "@react-navigation/native"
import { EXPO_PUBLIC_URL } from "@env"
const moment = require("moment")

function MoodBlock() {

    const { colors } = useTheme()
    const user = useUserStore((store) => store.user)
    const moods = useMoodTrackerStore((store) => store.moods)
    const setMoods = useMoodTrackerStore((store) => store.setMoods)

    useEffect(() => {
        if (moods?.length < 1) {
            getMoods()
        }
        console.log(moods)
    }, [])

    async function getMoods() {
        const idToken = await auth.currentUser?.getIdToken()

        await fetch(EXPO_PUBLIC_URL + "/mood", {
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
        .then((data) => setMoods(data[0]))
        .catch((e) => console.log(e))
    }


    return (
        <View style={[styles.textSection, { borderColor: colors.border }]}>
            <Text style={{color: colors.text, fontSize: 16}}>Moods Entered</Text>
            <Text style={{color: colors.text, fontSize: 16}}>{user.total_mood}</Text>
        </View>
    )
}

export function TrendScreen() {

    const { colors } = useTheme()

    const user = useUserStore((store) => store.user)

    return (
        <ScrollView style={styles.container}>

            <View style={[styles.section, { backgroundColor: colors.card }]}>
                <Text style={{color: colors.text, fontSize: 20, fontWeight: "bold", marginBottom: 10}}>Moods</Text>
                {/* <LineChart
                    data={chartData}
                    width={340}
                    height={220}
                    yAxisLabel="%"
                    chartConfig={{
                        backgroundGradientFrom: colors.card,
                        backgroundGradientTo: colors.card,
                        color: (opacity = 1) => `rgba(25, 150, 25, ${opacity})`,
                        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    }}
                    bezier
                    style={{
                        marginVertical: 8,
                        borderRadius: 16,
                    }}
                />  */}

                <MoodBlock />
            </View>

            <View style={[styles.section, {backgroundColor: colors.card }]}>
                <Text style={{color: colors.text, fontSize: 20, fontWeight: "bold", marginBottom: 10}}>Checklist</Text>
                <View style={[styles.textSection, { borderColor: colors.border }]}>
                    <Text style={{color: colors.text, fontSize: 16}}>Created</Text>
                    <Text style={{color: colors.text, fontSize: 16}}>{user.total_checklist_created}</Text>
                </View>
                <View style={[styles.textSection, { borderColor: colors.border }]}>
                    <Text style={{color: colors.text, fontSize: 16}}>Completed</Text>
                    <Text style={{color: colors.text, fontSize: 16}}>{user.total_checklist_completed}</Text>
                </View>
                <View style={[styles.textSection, { borderColor: colors.border }]}>
                    <Text style={{color: colors.text, fontSize: 16}}>Latest Created</Text>
                    <View style={{flexDirection: "row"}}>
                        <Text style={{color: colors.text, fontSize: 16}}>{user.last_goal_created_date ? user.last_checklist_date : "N/A"}</Text>
                    </View>
                </View>
                <View style={[styles.textSection, { borderColor: colors.border }]}>
                    <Text style={{color: colors.text, fontSize: 16}}>Latest Completed</Text>
                    <View style={{flexDirection: "row"}}>
                        <Text style={{color: colors.text, fontSize: 16}}>{user.last_goal_created_date ? user.last_checklist_completed_date : "N/A"}</Text>
                    </View>
                </View>
            </View>

            <View style={[styles.section, {backgroundColor: colors.card }]}>
                <Text style={{color: colors.text, fontSize: 20, fontWeight: "bold", marginBottom: 10}}>Goals</Text>
                <View style={[styles.textSection, { borderColor: colors.border }]}>
                    <Text style={{color: colors.text, fontSize: 16}}>Total</Text>
                    <Text style={{color: colors.text, fontSize: 16}}>{user.total_goal_created}</Text>
                </View>
                <View style={[styles.textSection, { borderColor: colors.border }]}>
                    <Text style={{color: colors.text, fontSize: 16}}>Completed</Text>
                    <View style={{flexDirection: "row"}}>
                        <Text style={{color: colors.text, fontSize: 16}}>{user.total_goal_completed}</Text>
                    </View>
                </View>
                <View style={[styles.textSection, { borderColor: colors.border }]}>
                    <Text style={{color: colors.text, fontSize: 16}}>Latest Created</Text>
                    <View style={{flexDirection: "row"}}>
                        <Text style={{color: colors.text, fontSize: 16}}>{user.last_goal_created_date ? user.last_goal_created_date : "N/A"}</Text>
                    </View>
                </View>
                <View style={[styles.textSection, { borderColor: colors.border }]}>
                    <Text style={{color: colors.text, fontSize: 16}}>Latest Created</Text>
                    <View style={{flexDirection: "row"}}>
                        <Text style={{color: colors.text, fontSize: 16}}>{user.last_goal_created_date ? user.last_goal_completed_date : "N/A"}</Text>
                    </View>
                </View>
            </View>

            <View style={[styles.section, {backgroundColor: colors.card }]}>
                <Text style={{color: colors.text, fontSize: 20, fontWeight: "bold", marginBottom: 10}}>Journal</Text>
                <View style={[styles.textSection, { borderColor: colors.border }]}>
                    <Text style={{color: colors.text, fontSize: 16}}>Total</Text>
                    <Text style={{color: colors.text, fontSize: 16}}>{user.total_journal}</Text>
                </View>
                <View style={[styles.textSection, { borderColor: colors.border }]}>
                    <Text style={{color: colors.text, fontSize: 16}}>Latest</Text>
                    <View style={{flexDirection: "row"}}>
                        <Text style={{color: colors.text, fontSize: 16}}>{user.last_goal_created_date ? user.last_goal_created_date : "N/A"}</Text>
                    </View>
                </View>
            </View>

        </ScrollView>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginVertical: 10
    },
    section: {
        margin: 10,
        borderRadius: 10,
        padding: 20
    },
    textSection: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 10,
        borderBottomWidth: 1,
        paddingBottom: 5
    }
})