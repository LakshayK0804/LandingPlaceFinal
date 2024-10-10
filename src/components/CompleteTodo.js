import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTheme } from "@react-navigation/native";

let months = [
  "Jan",
  "Feb",
  "March",
  "April",
  "May",
  "June",
  "July",
  "Aug",
  "Sept",
  "Oct",
  "Nov",
  "Dec",
];

// This is the todo component
export default function CompleteTodo(props) {

  const { colors } = useTheme()
  // Trim out the unnecessary information from the dates
  let creationDaySubstring = props.date.substring(8, 10);
  let creationMonthSubstring = months[props.date.substring(5, 7) - 1];

  // Trim leading zero if the day has one
  if (creationDaySubstring < 10) {
    creationDaySubstring = creationDaySubstring[1];
  }

  return (
    <View style={styles.item}>
      <View style={styles.itemLeft}>
        <View>
          <Text numberOfLines={1} style={styles.itemText}>
            {props.text}
          </Text>
          <Text style={[styles.dateText, { color: colors.text }]}>
            Created {creationMonthSubstring} {creationDaySubstring}
          </Text>
          <Text style={[styles.dateText, { color: colors.text }]}>
            Completed {creationMonthSubstring} {creationDaySubstring}
          </Text>
        </View>
      </View>
      <TouchableOpacity onPress={() => props.deleteTodo(props.index)}>
        <View style={styles.trash}>
          <Ionicons
            name="trash-bin-outline"
            size={20}
            color={colors.text}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    padding: 10,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  square: {
    width: 24,
    height: 24,
    borderWidth: 1,
    opacity: 0.4,
    borderRadius: 5,
    marginRight: 15,
  },
  itemText: {
    maxWidth: "90%",
  },
  dateText: {
    fontSize: 12,
    opacity: 0.5,
  },
});
