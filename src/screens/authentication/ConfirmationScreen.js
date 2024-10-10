import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export function ConfirmationScreen({navigation}) {

  function changeNavigation() {
    //navigation.navigate("")
  }
  return (
    <View>
      <Text style={styles.container}>Account Created Successfully!</Text>
      <Text style={styles.text}>
        We need a few more things from you to create a personalized experience
      </Text>

      <TouchableOpacity style={styles.button} onPress={() => changeNavigation()}>
        <Text style={styles.text}>Lets Go!</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
  },
  text: {
    color: "white",
    textAlign: "center",
    fontSize: 30,
  },
  button: {
    alignSelf: "center",
    marginTop: "50%",
    backgroundColor: "#242424",
    width: "50%",
    padding: 10,
    borderRadius: 5,
  },
});
