import { useState, useEffect } from "react";
import { View, Text, StyleSheet, SectionList, TouchableOpacity, FlatList} from "react-native";
import { useTheme } from "@react-navigation/native";
import { EXPO_PUBLIC_URL } from "@env"

export function HobbiesScreen({ navigation, route }) {
  const [hobbies, setHobbies] = useState([]);
  const [selectedHobbies, setSelectedHobbies] = useState([]);
  let user = route.params.user
  const { colors } = useTheme()

  useEffect(() => {
    getHobbies()
  }, [])

  async function getHobbies() {

    const list = user.categories.join(",")

    fetch(`${EXPO_PUBLIC_URL}/hobbies?categories=${list}`)
      .then((response) => {
        if (response.ok) {
          return response.json()
        }
        else {
          throw new Error()
        }
      })
      .then((data) => {

        // We build a list with this format [{category: "", hobbies[]}, {category: "", hobbies[]}]
        let temp = []
        let tempCat = ""
        let tempList = []
        for (let i = 0; i < data.length; i++) {
          if (tempCat != data[i].category) {
            if (tempList.length > 0) {
              temp.push({"title": tempCat, "data": tempList})
              tempList = []
            }
            tempCat = data[i].category
          }
          tempList.push(data[i].name)
        }

        if (tempList.length > 0) {
          temp.push({"title": tempCat, "data": tempList})
        }

        setHobbies(temp)

      })
      .catch((error) => alert("Network Error " + error))
      
  }

  function Hobby({item}) {
    return (
      <TouchableOpacity onPress={() => toggleSelected(item)} 
        style={{flexGrow: 1, margin: 5, backgroundColor: colors.card, padding: 10, borderWidth: 1, borderColor: selectedHobbies.indexOf(item) > -1 ? colors.primary : colors.card, borderRadius: 10, width: "auto"}}>
        <Text style={{color: colors.text}}>{item}</Text>
      </TouchableOpacity>
    );
  }

  function toggleSelected(item) {
    if (selectedHobbies.indexOf(item) > -1) {
      const temp = selectedHobbies.filter(tmp => tmp !== item)
      setSelectedHobbies(temp)
    }
    else {
      setSelectedHobbies(selectedHobbies => [...selectedHobbies, item])
    }
    
    
  }

  function saveHobbies() {

    user.hobbies = selectedHobbies
    navigation.navigate("Avatar", {user: user})

  }

  return (
    <View style={styles.container}>
      <SectionList
        sections={hobbies}
        renderItem={() => null}
        stickySectionHeadersEnabled={false}
        contentContainerStyle={{padding: 20}}
        renderSectionHeader={({section}) => (
          <>
            <Text style={{color: colors.text}}>{section.title}</Text>
            <FlatList
              data={section.data}
              renderItem={({ item }) => <Hobby item={item} />}
              numColumns={3}
              columnWrapperStyle={{flexWrap: "wrap"}}
              />            
          </>
        )}        
        
      />

      <View style={{padding: 20}}>
        <TouchableOpacity onPress={saveHobbies}
          style={{borderRadius: 10, height: 50, backgroundColor: "#5468ff", justifyContent: "center", alignItems: "center"}}>
          <Text style={{color: "white"}}>Next</Text>
        </TouchableOpacity>
      </View>
    
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 40,
  },
});
