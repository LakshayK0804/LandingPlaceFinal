import { useEffect, useState } from "react";
import {
  Text,
  StyleSheet,
  View,
  FlatList,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import showToast from "../../utils/DisplayToast";
import { EXPO_PUBLIC_URL } from "@env"

export function CategoriesScreen({ navigation, route }) {
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const { colors } = useTheme()
  let user = route.params.user

  useEffect(() => {
    getCategories()
  }, []);

  async function getCategories() {
    let fetchURL = EXPO_PUBLIC_URL + "/categories";
    console.log("fetchURL", fetchURL);
    // await fetch(EXPO_PUBLIC_URL + "/categories")
    await fetch(fetchURL)
    .then((response) => {
      if (response.ok) {
        console.log("categories ok");
        return response.json()
      }
      else {
        alert("Network Error")
      }
    })
    .then((data) => {
      setCategories(data);
      console.log("categories", categories);
    })
    .catch((error) => alert("Network Error " + error))
  }

  function saveCategories() {
    // TODO write data
    if (selectedCategories.length == 0) {
      showToast(
        "error",
        "",
        "Please select at least one category"
      );
      return;
    }

    user.categories = selectedCategories
    navigation.navigate("Hobbies", {user: user})
  }

  function Card({name}) {
    return (
      <TouchableWithoutFeedback onPress={() => {
        if (selectedCategories.indexOf(name) === -1) {
          // Add category to list
          setSelectedCategories(selectedCategories => [...selectedCategories, name])
        }
        else {
          // Remove category from list
          const temp = selectedCategories.filter(item => item !== name)
          setSelectedCategories(temp)
        }

      }}>
        <View style={{borderWidth: 1, borderColor: selectedCategories.indexOf(name) > -1 ? colors.primary : colors.card, backgroundColor: colors.card, paddingHorizontal: 10, paddingVertical: 20, marginBottom: 10, borderRadius: 10, flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
          <Text style={{color: colors.text}}>{name}</Text>
          { selectedCategories.indexOf(name) > -1 
            ? <View style={{width: 20, height: 20, backgroundColor: colors.primary, borderRadius: 20}}/>
            : <View style={{width: 20, height: 20, borderWidth: 1, borderColor: "gray", borderRadius: 20}}/>
          }
        </View>
      </TouchableWithoutFeedback>
    )
  }
  return (
    <View style={styles.container}>
      <FlatList
        data={categories}
        renderItem={({item}) => <Card name={item.name}/>}
        render
      />

      <TouchableOpacity onPress={saveCategories}
        style={{borderRadius: 10, height: 50, backgroundColor: colors.primary, justifyContent: "center", alignItems: "center"}}>
        <Text style={{color: colors.text}}>Next</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
 container: {
  flex: 1,
  padding: 20,
  marginBottom: 40
 },
});
