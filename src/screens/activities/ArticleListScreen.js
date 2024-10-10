import { useEffect, useState } from "react"
import {View, Text, FlatList, StyleSheet, TouchableOpacity, Image, TouchableWithoutFeedback} from "react-native"
import {useTheme} from "@react-navigation/native";
import { auth } from "../../../firebaseConfig"
import {MaterialIcons} from "@expo/vector-icons";
import { EXPO_PUBLIC_URL } from "@env"

function Article({item, index, navigation}) {
    console.log(item)

    const { colors } = useTheme()

    return (
      <TouchableWithoutFeedback onPress={ ()=> navigation.navigate("Read Article", {id: item.uuid})}>
        <View style={[styles.articleCard, { backgroundColor: colors.card }]}>
            <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                <Text style={{color: colors.text, fontSize: 18}}>{item.title}</Text>
                <MaterialIcons name="star" size={24} color={colors.card}/>
            </View>

            <View style={{flexDirection: "row", alignItems: "center", marginBottom: 10}}>
                <Text style={[ styles.categoryText, {color: colors.text}]}>{"Category"} • {"2m read"}</Text>
            </View>
            
            <Text style={{color: colors.text}}>This is a short description of what the article is about and what i might need to know beforehand.</Text>

        </View>
      </TouchableWithoutFeedback>
    )
}

export function ArticleListScreen({route, navigation}) {
    // route.params: id, title, author, body, imageURI

    const [articles, setArticles] = useState([]);

    useEffect(() => {
        getArticles();
    }, [])

    async function getArticles() {
        const idToken = await auth.currentUser?.getIdToken();

        await fetch(EXPO_PUBLIC_URL + "/article", {
          headers: {
            "Authorization": "Bearer " + idToken
          }
        })
        .then((response) => {
          if (response.ok) {
            return response.json()
          }
          else {
            throw new Error()
          }
        })
        .then((data) => {
            setArticles(data);
        })
        .catch((error) => {
            alert(error);
        });
    }
  
    function Thumbnail(item) {

      return (
          <TouchableOpacity style={styles.item} onPress={() => handlePress(item)} >
            <Image source={{uri: EXPO_PUBLIC_URL + "/image/" + item.thumbnail}} style={styles.thumbnail}/>
            <Text style={styles.text}>{item.title}</Text>
          </TouchableOpacity>
      );
    }
  
     return (
          <View>
              <FlatList
                  data={articles}
                  renderItem={({item, index}) => <Article item={item} index={index} navigation={navigation}/>}
                  />
          </View>
     );
}

const styles = StyleSheet.create({
    container: {
        // flex: 1,
    },
    thumbnail: {
        height: 90,
        width: 160,
        marginHorizontal: 10
    },
    header: {
      color: "white",
      fontSize: 20
    },
    text: {
      color: "white"
    },
    item: {
      width: "45%",
      marginBottom: 20,
      alignItems: "center",    
    },
    articleCard: {
      padding: 20,
      borderRadius: 10,
      margin: 10,
      justifyContent: "center" 
  },
  categoryText: {
      fontSize: 14,
      opacity: 0.5
  },
  categoryContainer: {
      alignSelf: 'flex-start',
      padding: 2,
      borderRadius: 10
  }
})