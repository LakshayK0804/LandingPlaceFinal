import { View, Text, StyleSheet } from "react-native";
import moment from "moment";
import Ionicons from "@expo/vector-icons/Ionicons";
import { TouchableOpacity } from "react-native-gesture-handler";
const GoalCard = ({ data, tasks, numberCompleted }) => {
  return (
    <View
      style={{
        ...styles.container,
      }}
    >
      <View style={styles.header}>
        <Text style={styles.title}>{data.goal.toUpperCase()}</Text>

        {tasks.length > 0 ? (
          data.is_completed == 1 ? (
            <Text style={styles.subtitleCompleted}>Completed</Text>
          ) : (
            <Text style={styles.subtitle}>
              Task ({numberCompleted}/{tasks.length})
            </Text>
          )
        ) : (
          <></>
        )}
      </View>

      <View style={styles.subTask}>
        {tasks.length == 0 ? <Text>No Subtasks</Text> : <></>}
        {tasks
          .filter((item) => item.is_completed == 0)
          .slice(0, 3)
          .map((task, i) => {
            return (
              <View
                key={task.id}
                style={{
                  flexDirection: "row",
                  gap: 5,
                  marginTop: 2,
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    borderWidth: 2,
                    borderRadius: 10,
                    alignSelf: "center",
                    backgroundColor: "#AAA",
                  }}
                >
                  <Ionicons
                    style={{
                      textAlign: "center",
                      color: "rgba(255, 255, 255,0)",
                    }}
                    name="trash-outline"
                    size={20}
                  />
                </View>
                <Text style={styles.subTaskTitle}> {task.step} </Text>
              </View>
            );
          })}
        {tasks.filter((item) => item.is_completed == 0).length > 3 ? (
          <Text
            styles={{
              fontStyle: 50,
              marginTop: 10,
            }}
          >
            ...and more
          </Text>
        ) : (
          <></>
        )}
      </View>
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Created: {moment(new Date(data.date_created)).fromNow()}{" "}
        </Text>
        <Text style={styles.footerText}>
          Due: {moment(new Date(data.date_due)).fromNow()}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    maxHeight: 200,
    minHeight: "auto",
    flex: 1,
    padding: 10,
    overflow: "hidden",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  subtitle: {
    fontWeight: "bold",
    color: "green",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  subTask: {
    marginTop: 10,
    marginBottom: 10,
    paddingLeft: 20,
  },
  subTaskTitle: {
    fontSize: 16,
    fontWeight: "400",
  },
  footerText: {
    fontStyle: "italic",
    fontWeight: "500",
  },
});

export default GoalCard;
