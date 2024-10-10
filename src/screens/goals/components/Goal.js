import React, { useEffect } from "react";
import { View, Text, StyleSheet, TouchableWithoutFeedback, Animated } from "react-native"
import { useGoalStore } from "../../../stores"
import { Swipeable, RectButton } from "react-native-gesture-handler"
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTheme } from '@react-navigation/native';
const AnimatedIcon = Animated.createAnimatedComponent(Ionicons)
const moment = require("moment")

export function Goal({ item, index, markComplete, deleteGoal, editGoal, openGoal }) {

    const { colors } = useTheme(); // Theming
    // Store variables
    const goalSteps = useGoalStore((store) => store.goalSteps)
    const completedGoals = useGoalStore((store) => store.completedGoals)

    function handlePress() {
      openGoal(item)
    }

    // This will render when the goal is swiped
    function renderLeftActions(progress, dragX) {

      const scale = dragX.interpolate({
        inputRange: [0, 50],
        outputRange: [0, 1],
        extrapolate: "clamp"
      })

      return (
        <Animated.View style={{width: 70}}>
          <RectButton style={styles.leftAction} onPress={() => {
            markComplete(item.goal_id)}
          }>
            
            <AnimatedIcon
              name="checkmark-done-outline"
              size={30}
              color={"white"}
              style={{transform: [{scale: scale}]}}
            />
          </RectButton>
        </Animated.View>

      )
    }

    function renderRightActions() {
      return (
        <View style={{ width: 140, flexDirection: "row"}}>
          <Animated.View style={{ flex: 1, transform: [{ translateX: 0 }] }}>
            <RectButton
              style={[styles.rightAction, { backgroundColor: "#0096FF" }]}
              onPress={() => editGoal(item.goal_id)}>
              <Ionicons name={"pencil-outline"} color={"white"} size={30}/>
            </RectButton>
          </Animated.View>

          <Animated.View style={{ flex: 1, transform: [{ translateX: 0 }] }}>
            <RectButton
              style={[styles.rightAction, { backgroundColor: "red" }]}
              onPress={() => deleteGoal(item.goal_id)}>
              <Ionicons name={"trash-outline"} color={"white"} size={30}/>
            </RectButton>
          </Animated.View>
        </View>
      );
    }

    if (item.type === "actions") {

      return (
        <TouchableWithoutFeedback onPress={() => handlePress(item.goal_id)}>
          <View style={{backgroundColor: colors.background, padding: 10, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: "gray"}}>
                <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                  <View style={{flex: 1}}>
                    <Text style={[styles.titleText, {color: colors.text, marginRight: 10}]} numberOfLines={1}>{item.title}</Text>
                    <View style={{flexDirection: "row", flex: 1}}>
                      <Text style={[styles.dateText, {color: colors.text}]} numberOfLines={1}>bruh</Text>
                    </View>
                  </View>
                  <Text style={{color: colors.text, fontSize: 18}}>bruh</Text>
                </View>
              </View>
      </TouchableWithoutFeedback>
      )
    }
    else if (item.type == "repeating") {

      // Check to see if there is any bits completed in the time frame specified
      const currDate = new Date().toLocaleDateString()

      let count = 0
      if (item.occurrence_level === "Daily") {
        for (let i = 0; i < completedGoals.length; i++) {
          if (item.goal_id === completedGoals[i].goal_id && currDate === new Date(completedGoals[i].date_completed).toLocaleDateString()) {
           count++
          }
        }
      }
      else if (item.occurrence_level === "Weekly") {
        for (let i = 0; i < completedGoals.length; i++) {
          if (item.goal_id === completedGoals[i].goal_id && moment().isAfter(moment(completedGoals[i].date_completed).startOf("week").toLocaleString()) && moment().isBefore(moment(completedGoals[i].date_completed).endOf("week").toLocaleString())) {
            count++
          }
        }
      }
      else if (item.occurrence_level === "Monthly") {
        for (let i = 0; i < completedGoals.length; i++) {
          if (item.goal_id === completedGoals[i].goal_id && moment().isAfter(moment(completedGoals[i].date_completed).startOf("month").toLocaleString()) && moment().isBefore(moment(completedGoals[i].date_completed).endOf("month").toLocaleString())) {
            count++
          }
        }
      }
      else if (item.occurrence_level === "Yearly") {
        for (let i = 0; i < completedGoals.length; i++) {
          if (item.goal_id === completedGoals[i].goal_id && moment().isAfter(moment(completedGoals[i].date_completed).startOf("year").toLocaleString()) && moment().isBefore(moment(completedGoals[i].date_completed).endOf("year").toLocaleString())) {
            count++
          }
        }
      }

      function dueText() {
        if (item.occurrence_level === "Daily") {
          return "Due " + moment(item.due_date).endOf('day').fromNow()
        }
        else if (item.occurrence_level === "Weekly") {
          return "Due " + moment(item.due_date).endOf('week').fromNow()
        }
        else if (item.occurrence_level === "Monthly") {
          return "Due " + moment(item.due_date).endOf('month').fromNow()
        }
        else if (item.occurrence_level === "Yearly") {
          return "Due " + moment(item.due_date).endOf('year').fromNow()
        }
      }
      return (
        <Swipeable
          ref={(ref) => (swipeableRow = ref)}
          renderLeftActions={renderLeftActions}
          renderRightActions={renderRightActions}
          leftThreshold={50}
          rightThreshold={10}
          friction={1}
          overshootFriction={8}
        >
          <TouchableWithoutFeedback onPress={() => handlePress(item.goal_id)}>
             <View style={{backgroundColor: colors.background, padding: 10, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: "gray"}}>
                <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                  <View style={{flex: 1}}>
                    <Text style={[styles.titleText, {color: colors.text, marginRight: 10}]} numberOfLines={1}>{item.title}</Text>
                    <View style={{flexDirection: "row", flex: 1}}>
                      <Text style={[styles.dateText, {color: colors.text}]} numberOfLines={1}>{item.occurrence_level} | {count < item.amount ? dueText() : "Nice Job!"}</Text>
                    </View>
                  </View>
                  <Text style={{color: colors.text, fontSize: 18}}>{count} / {item.amount}</Text>
                </View>
              </View>
        </TouchableWithoutFeedback>
      </Swipeable>
      )
    }
  }

  const styles = StyleSheet.create({
    titleText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "white",
      },
      dateText: {
        fontSize: 12,
        opacity: 0.5,
        fontWeight: "bold",
        marginRight: 10
      },
      leftAction: {
        flex: 1,
        backgroundColor: '#388e3c',
        justifyContent: 'center',
        alignItems: "center"
      },
      rightAction: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
      },
  })