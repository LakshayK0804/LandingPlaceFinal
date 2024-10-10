import { useEffect, useState } from "react"
import { StyleSheet, View, useWindowDimensions } from "react-native"
import RenderHtml from 'react-native-render-html';
import { useTheme } from "@react-navigation/native";
import { ScrollView } from "react-native";
import { auth } from "../../../firebaseConfig";
import { EXPO_PUBLIC_URL } from "@env"

export function ReadArticleScreen({ route }) {

    const { colors } = useTheme()

    const [html, setHtml] = useState(null)
    const { width } = useWindowDimensions()

    useEffect(() => {
        getArticle()
    }, [])

    async function getArticle() {

        const idToken = await auth.currentUser?.getIdToken()
        await fetch(EXPO_PUBLIC_URL + "/article/" + route.params.id, {
            headers: {
                "Authorization": "Bearer " + idToken
            }
        })
        .then((response) => {
            if (response.ok) {
                return response.text()
            }
            else{
                throw new Error()
            }
        })
        .then((data) => setHtml(data))
        .catch(() => alert("Could not load article"))
    }

    const tagsStyles = {
        body: {
            color: colors.text,
            fontSize: 18,
            opacity: 0.8
        }
    }

    return (
        <ScrollView style={styles.container}>
            { html ? (
                <RenderHtml
                    contentWidth={width}
                    source={{html}}
                    tagsStyles={tagsStyles}
                />
            ) : (
                <></>
            ) }
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        margin: 12
    }
})