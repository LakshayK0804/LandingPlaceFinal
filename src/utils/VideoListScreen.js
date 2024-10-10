import { useState, useEffect } from "react";
import { StyleSheet, Text, FlatList, View, TouchableOpacity } from "react-native";
import { EXPO_PUBLIC_URL } from "@env"

export function VideoListScreen ({ navigation }) {
    const [videos, setVideos] = useState([])

    useEffect(() => {
        getVideos();
    }, [])

    const getVideos = async () => {
      const idToken = await auth.currentUser?.getIdToken();

      await fetch(EXPO_PUBLIC_URL + "/video", {
        "Authorization": "Bearer " + idToken
      })
        .then((response) => {
          if (response.ok) {
            return response.json()
          }
          else {
            alert("Error")
          }
        })
        .then((data) => {
          setVideos(data);
        })
        .catch((error) => {
          alert(error.message)
        })
    };

    function handlePress(item) {
      navigation.navigate("PlayVideo", {videoId: item.id, videoTitle: item.title});
    }

    function Thumbnail(item) {
        
        return (
            <TouchableOpacity style={styles.item} onPress={() => handlePress(item)} >
              <View style={{width: 160, height: 90, backgroundColor: "white"}}/>
              <Text style={styles.text}>{item.title}</Text>
            </TouchableOpacity>
        );
    }


   return (
      <FlatList
        data={videos}
        renderItem={({item}) => Thumbnail(item)}
        numColumns={2}
        columnWrapperStyle={{justifyContent: "space-around"}}
      />
   );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
      color: "white",
    },
    item: {
      width: "45%",
      marginBottom: 20,
      alignItems: "center"
    },
})