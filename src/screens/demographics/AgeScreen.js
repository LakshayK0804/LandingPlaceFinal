import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from "react-native";
import { useTheme } from "@react-navigation/native";
import { TextInput } from "react-native-gesture-handler";

export function AgeScreen({ navigation, route }) {
  const { colors } = useTheme();
  const [age, setAge] = useState("");
  
  const user = route.params.user

  function nextScreen() {
    if (isNaN(age) || age.length === 0) {
      alert("Please enter a number")
    }
    else {
      user.age = age
      navigation.navigate("Sex", {user: user})
    }
    
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false} keyboardDismissMode={Platform.OS === "ios" ? "interactive" : "on-drag"}>
    <View style={styles.container}>
      <Text style={{ color: colors.text }}>1 of 14</Text>
      <TextInput
        placeholder="17"
        placeholderTextColor={"gray"}
        style={{ backgroundColor: colors.card, fontSize: 50, color: colors.text, width: "100%", height: 100, textAlign: "center" }}
        onChangeText={(txt) => setAge(txt)}
        value={age}
        keyboardType="number-pad"
        maxLength={2}
      />

      <View style={{margin: 25}} />

      <TouchableOpacity
        onPress={nextScreen}
        style={[styles.button, { backgroundColor: colors.primary }]}
      >
        <Text style={{ color: "white" }}>Next</Text>
      </TouchableOpacity>
    </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginBottom: 50,
  },
  button: {
    borderRadius: 10,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
});
