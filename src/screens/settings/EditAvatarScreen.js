import { useState, useEffect } from "react"
import { View, StyleSheet, Alert } from "react-native"
import AvatarEditor from "../../components/AvatarEditor"
import { useUserStore } from "../../stores"
import { auth } from "../../../firebaseConfig"
import showToast from "../../utils/DisplayToast";
import { EXPO_PUBLIC_URL } from "@env"

export function EditAvatarScreen({ navigation }) {

    const user = useUserStore((store) => store.user)
    const updateAvatar = useUserStore((store) => store.setAvatar)
    const setAvatarsvg = useUserStore((store) => store.setAvatarsvg)

    const avatarExtra = user.avatar_extra
    // const avatarSvg = user.avatar_svg

    async function setAvatar(avatar) {

        const idToken = await auth.currentUser?.getIdToken();

        await fetch(EXPO_PUBLIC_URL + "/user/avatar", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + idToken
            },
            // credentials
            body: JSON.stringify({
                avatarExtra: JSON.stringify(avatar.extra),
                avatarSvg: JSON.stringify(avatar.svg)
            })
        })
        .then((response) => {
            if (response.ok) {
                updateAvatar(avatar)
                setAvatarsvg(JSON.stringify(avatar.svg))
                // insert toast here and pop the navigation
                showToast("success", "Avatar changed successfully!")
                navigation.pop()
            }
            else{
                throw new Error()
            }
        })
        .catch((error) => alert(error))
        
    }


    return (
        <View style={styles.container}>
            <AvatarEditor setAvatar={setAvatar} currentAvatar={avatarExtra} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})