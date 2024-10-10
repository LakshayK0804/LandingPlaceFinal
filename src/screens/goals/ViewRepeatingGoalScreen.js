import { useMemo, useState, useRef, useEffect } from "react"
import { TouchableWithoutFeedback, View, Text, StyleSheet, Alert } from "react-native"
import { useGoalStore, useUserStore } from "../../stores"
import { useTheme } from "@react-navigation/native"
import { CalendarList } from "react-native-calendars";
import PieChart from 'react-native-pie-chart'
import { auth } from "../../../firebaseConfig"
import { TouchableOpacity } from "react-native-gesture-handler";
import {dotColor} from "react-native-calendars/src/style";
const moment = require("moment")
import { EXPO_PUBLIC_URL } from "@env"

export function ViewRepeatingGoalScreen({ route }) {

    const goal = route.params.goal
    const updateStats = useUserStore((store) => store.updateStats)
    // const userStats = useUserStore((store) => store.stats)

    const { colors } = useTheme()

    const frequency = getFrequency()
    const completedGoals = useGoalStore((store) => store.completedGoals)
    const addCompletedGoal = useGoalStore((store) => store.addCompletedGoal)
    const removeCompletedGoal = useGoalStore((store) => store.removeCompletedGoal)
    const thisCompletedGoals = useMemo(() => {
        return getCompletedGoals(goal)
    }, [completedGoals])
    const [selectedDate, setSelectedDate] = useState(new Date())
    const data = useMemo(() => {
        return getData(goal, thisCompletedGoals)
    }, [completedGoals, selectedDate])
    const streak = useMemo(() => {
        return calculateStreak()
    }, [thisCompletedGoals])
    const range = useRef(moment().format("l"))
    const pieFraction = useRef("")
    const pieSeries = useRef([])
    const piePercent = useMemo(() => {
        return getPiePercent()
    }, [selectedDate, thisCompletedGoals])

    // This selects the current day to start the user off and sets the title
    useEffect(() => {
        ShowDetails({dateString: moment().format("YYYY-MM-DD")})
    }, [])

    // Returns when the goal is due
    // Value is printed under Current Streak and Total Entries
    function getFrequency() {
        if (goal.occurrence_level === "Daily") {
            return "Days"
        }
        else if (goal.occurrence_level === "Weekly") {
            return "Weeks"
        }
        else if (goal.occurrence_level === "Monthly") {
            return "Months"
        }
        else if (goal.occurrence_level === "Yearly") {
            return "Years"
        }
    }

    function calculateStreak() {

        // Terminate early if there is no goals to loop through
        if (thisCompletedGoals.length === 0) {
            return 0
        }
        let timeframe
        if (goal.occurrence_level === "Daily") {
            timeframe = "day"
        }
        else if (goal.occurrence_level === "Weekly") {
            timeframe = "week"
        }
        else if (goal.occurrence_level === "Monthly") {
            timeframe = "month"
        }
        else if (goal.occurrence_level === "Yearly") {
            timeframe = "year"
        }

        let count = 0
        let thisTimeframeCount = 0
        let index = thisCompletedGoals.length - 1
        let currDate = moment().startOf(timeframe)
        let currGoalDate = moment(thisCompletedGoals[index].date_completed).startOf(timeframe)
        let brokeFree = false

        while (true) {
            // This loop will count how many entries there are within the current timeframe
            // Breaks when the next entry is not within the timeframe
            while(currDate.isSame(currGoalDate)) {
                brokeFree = false
                thisTimeframeCount++
                if (index > 0) {
                    currGoalDate = moment(thisCompletedGoals[--index].date_completed).startOf(timeframe)
                }
                else {
                    // end of the goal list
                    brokeFree = true;
                    break;
                }
            }
 
            if (thisTimeframeCount >= goal.amount) {
                count++
            }
            
            if (brokeFree === false) {
                brokeFree = true
                // Move the currDate to the next timeframe
                currDate = moment(currDate).subtract(1, timeframe)
            }
            else {
                break
            }
            
        }

        return count
    }

    function getCompletedGoals(goal) {
        // Get all the completed goals associated with this gaol
        let tmp = []
        for (let i = 0; i < completedGoals.length; i++) {
            if (completedGoals[i].goal_id === goal.goal_id) {
                tmp.push(completedGoals[i])
            }
        }

        // Sort by date_completed
        const sorted = tmp.sort((a, b) => {
            const dateA = new Date(a.date_completed);
            const dateB = new Date(b.date_completed);

            return dateA - dateB;
        })

       return sorted
    }

    // Loops through all the completed goals for the selected goal and builds the data for the calendar to mark
    // Returns an object of all completed goals
    function getData(goal, thisCompletedGoals) {

        // Fill an array from the beginning of the start date month to end of the current month
        // to use to color and mark the calendar
        // (Ex) mark all the days the goal is due, color the day if a goal was completed on that day
        const calendarData = []
        const startDate = moment(goal.start_date).startOf("month").format("YYYY-MM-DD")
        const endDate = moment().endOf("month").format("YYYY-MM-DD")
        const len = moment(endDate).diff(startDate, "days") + 1

        let thisCompletedGoalsIndex = 0 // Iterator so we don't have to loop the entire list every time
        for (let i = 0; i < len; i++) {

            let shouldSelect = false, shouldMark = false; // Select if we have a goal completed on that day, mark if goal is due that day
            let currDay = moment(startDate).add(i, "days").format("YYYY-MM-DD")

            if (thisCompletedGoalsIndex < thisCompletedGoals.length) {

                // We loop in case there is multiple goal completions on one day
                while(thisCompletedGoalsIndex < thisCompletedGoals.length) {
                   
                    let currCompletedGoal = moment(thisCompletedGoals[thisCompletedGoalsIndex].date_completed).format("YYYY-MM-DD")

                    // Check if the goal was completed on the current day in index
                    if (moment(currCompletedGoal).isSame(moment(currDay))) {
                        shouldSelect = true
                        thisCompletedGoalsIndex++
                    }
                    else {
                        break
                    }
                }
            }

            if (goal.complete_on == null) {
                tmp = [goal.sunday, goal.monday, goal.tuesday, goal.wednesday, goal.thursday, goal.friday, goal.saturday]
                goal.complete_on = tmp
            }

            // Check if the goal is due on the current day in index
            if (goal.complete_on[moment(currDay).weekday()].length > 0) {
                shouldMark = true
            }

            let options = {
                selected: shouldSelect,
                selectedColor: "green",
                marked: shouldMark,
                dotColor: colors.background
            }

            calendarData.push({ [moment(currDay).format("YYYY-MM-DD")]: options})
        }

        calendarData.push({ [selectedDate]: {dotColor: "rgb(200,200,200)"} })
        console.log(calendarData)
        console.log("-")
        console.log(selectedDate)


        // Takes it from array to object form
        // Needed to input in markedDays for the calendar library
        const dataObject = calendarData.reduce((acc, curr) => {
            return { ...acc, ...curr };
        }, {});

        return dataObject
    }

    // Called by pressing on a calendar day
    // Shows the details of the time period based off the selected day
    function ShowDetails(day) {

        let timeframe // Prints on screen
        if (goal.occurrence_level === "Daily") {
            range.current = moment(day.dateString).format("l").toString()
            timeframe = "day"
        }
        else if (goal.occurrence_level === "Weekly") {
            range.current= `${moment(day.dateString).startOf("week").format("l").toString()} - ${moment(day.dateString).endOf("week").format("l").toString()}`
            timeframe = "week"
        }
        else if (goal.occurrence_level === "Monthly") {
            range.current= `${moment(day.dateString).startOf("month").format("l").toString()} - ${moment(day.dateString).endOf("month").format("l").toString()}`
            timeframe =  "month"
        }
        else if (goal.occurrence_level === "Yearly") {
            range.current= `${moment(day.dateString).startOf("year").format("l").toString()} - ${moment(day.dateString).endOf("year").format("l").toString()}`
            timeframe = "year"
        }

        setSelectedDate(day.dateString)

    }

    // FlatList renderItem that shows the list of completed goals in the selected goal range
    function CompletedGoalCard({ item }) {

        const date = moment(item.date_completed).format("LL").split(",")[0]
        const time = moment(item.date_completed).format("LT")

        function showAlert() {
            Alert.alert(date, time,
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => RemoveCompletedGoal(item)
                }
            ])
        }

        return (
            <TouchableOpacity onLongPress={() => showAlert()} style={{flex: 1, borderRadius: 10, backgroundColor: colors.card, width: 100}}>
                    <View style={{flex: 1, margin: 10, alignItems: "center", justifyContent: "center"}}>
                        <Text style={{color: colors.text}}>{date} @</Text>
                        <Text style={{color: colors.text}}>{time}</Text>
                    </View>
            </TouchableOpacity>
        )
    }

    // Sets the pie percentage, x/y entries, and fills the pie chart
    // Returns the pie percentage
    function getPiePercent() {

        let timeframe
        if (goal.occurrence_level === "Daily") {
            timeframe = "day"
        }
        else if (goal.occurrence_level === "Weekly") {
            timeframe = "week"
        }
        else if (goal.occurrence_level === "Monthly") {
            timeframe = "month"
        }
        else if (goal.occurrence_level === "Yearly") {
            timeframe = "year"
        }

        let tmp = thisCompletedGoals.filter((thisCompletedGoal) => moment(thisCompletedGoal.date_completed).startOf(timeframe).isSame(moment(selectedDate).startOf(timeframe)))
        pieFraction.current = tmp.length + "/" + goal.amount
        pieSeries.current = [tmp.length, goal.amount - tmp.length < 0 ? 0 : goal.amount - tmp.length]

        return Math.trunc(tmp.length / goal.amount * 100)
        
    }

    // Send POST to add a new completed goal
    async function AddCompletedGoal() {

        if (moment(selectedDate).isAfter(moment().startOf("day"))) {
            alert("Cannot Add Entry In The Future")
            return
        }

        // Add the current time to the selectedDate string and convert to ISO
        var selectedDateIso = moment(selectedDate, "YYYY-MM-DD");

        // Get the current hour and minute
        var currentHour = moment().format("HH");
        var currentMinute = moment().format("mm");
        var currentSecond = moment().format("ss");

        // Set the current hour and minute to the parsed date
        selectedDateIso.set({ hour: currentHour, minute: currentMinute, second: currentSecond });
        const idToken = await auth.currentUser?.getIdToken();
        await fetch(EXPO_PUBLIC_URL + "/goal/complete", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + idToken
            },
            body: JSON.stringify({
                goal_id: goal.goal_id,
                date_completed: selectedDateIso,
                log_num: thisCompletedGoals.length,
                note: null
            })
        })
        .then((response) => {
            if (response.ok) {
                updateStats("total_goal_completed")
                addCompletedGoal(goal.goal_id, selectedDateIso, thisCompletedGoals.length, null)
            }
            else {
                alert("Something went wrong. Try again later")
            }
        })
        .catch((error) => {
            alert("Network Error: " + error)
        })
    }

    // Finish this, i might have to add a uuid to each goal step so it can be delete, but uid and date_completed should be unique so we may be able to use that
    async function RemoveCompletedGoal(item) {

        const idToken = await auth.currentUser?.getIdToken();

        await fetch(EXPO_PUBLIC_URL + "/goal/repeat", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + idToken
            },
            body: JSON.stringify({
                goal_id: item.goal_id,
                date_completed: item.date_completed,
            })
        })
        .then((response) => {
            if (response.ok) {
                // We need to remove the entry from the zustand store, thisCompletedGoals, and the goals completed on the selected date range
                removeCompletedGoal(item.goal_id, item.date_completed)
            }
            else {
                alert("Something went wrong. Try again later")
            }
        })
        .catch((error) => {
            alert("Network Error: " + error)
        })

    }


    const pastScrollRange = moment().startOf("month").diff(moment(goal.start_date).startOf("month"), "months")

    return (
        <View style={styles.container}>

            <CalendarList
                horizontal={true}
                pagingEnabled={true}
                style={{
                    height: 350
                }}
                theme={{
                    backgroundColor: "transparent",
                    calendarBackground: "transparent",
                    textSectionTitleColor: colors.text,
                    selectedDayBackgroundColor: colors.card,
                    selectedDotColor: "orange",
                    selectedDayTextColor: colors.text,
                    todayTextColor: "#5468ff",
                    dayTextColor: colors.text,
                    textDisabledColor: "gray",
                    monthTextColor: colors.text,
                    dotColor: colors.text,
                }}
                current={new Date().toISOString().split("T")[0]}
                onDayPress={day => {
                    setSelectedDate(day.dateString)
                    ShowDetails(day)
                }}
                markedDates={data}
                pastScrollRange={pastScrollRange}
                futureScrollRange={1}
            />

            <View style={{flexDirection: "row", justifyContent: "space-between", marginTop: 10, marginHorizontal: 20, alignItems: "center"}}>

                <Text style={{color: colors.text, fontSize: 18, fontWeight: "bold"}}>{range.current}</Text>

                <TouchableWithoutFeedback onPress={AddCompletedGoal}>
                    <View style={{backgroundColor: colors.card, paddingHorizontal: 5, borderRadius: 10}}>
                        <Text style={{color: colors.text, fontSize: 18}}>Add +</Text>
                    </View>
                </TouchableWithoutFeedback>
            </View>

            <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 5}}>
                <View style={{flex: 1, alignItems: "center"}}>
                    <Text style={{color: colors.text}}>Current Streak</Text>
                    <Text style={{color: colors.text, fontSize: 25}}>{streak}</Text>
                    <Text style={{color: "gray"}}>{frequency}</Text>

                </View>
                <View style={{flex: 1, alignItems: "center"}}>
                    <PieChart
                        widthAndHeight={125}
                        series={pieSeries.current}
                        sliceColor={["green", colors.card]}
                        coverRadius={0.77}
                        style={{marginTop: 5}}
                    />
                    <View style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={{color: colors.text, fontSize: 25}}>{piePercent}%</Text>
                        <Text style={{color: "gray"}}>{pieFraction.current} Entries</Text>
                    </View>
                </View>
                

                <View style={{flex: 1, alignItems: "center"}}>
                    <Text style={{color: colors.text}}>Total Entries</Text>
                    <Text style={{color: colors.text, fontSize: 25}}>{thisCompletedGoals.length}</Text>
                    <Text style={{color: "gray"}}>{frequency}</Text>
                </View>
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})