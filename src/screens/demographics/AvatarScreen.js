import { View, StyleSheet } from "react-native"
import { auth } from "../../../firebaseConfig";
import { useUserStore } from "../../stores"
import AvatarEditor from "../../components/AvatarEditor";
import { EXPO_PUBLIC_URL } from "@env"

export function AvatarScreen({ route }) {

  const setUser = useUserStore((store) => store.setUser)
  const setAvatarsvg = useUserStore((store) => store.setAvatarsvg)
  const setStats = useUserStore((store) => store.setStats)
  let user = route.params.user
  user.uid = auth.currentUser.uid

  const u = useUserStore((store) => store.user)
  async function setAvatar(avatar) {

    user.avatar_svg =   JSON.stringify(avatar.svg)
    user.avatar_extra = JSON.stringify(avatar.extra)


    const idToken = await auth.currentUser?.getIdToken();
    
    await fetch(EXPO_PUBLIC_URL + "/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + idToken
      },
      body: JSON.stringify({user})
    })
    .then((response) => {
      if (response.ok) {
        setUser(user)
        setAvatarsvg(user.avatar_svg)
      }
      else {
        throw new Error("Network Error")
      }
    })
    .then((d) => {
      console.log(d)
    })
    .catch((e) => console.log(e))
    
  }


  return (
    <View style={styles.container}>
      
      <AvatarEditor setAvatar={setAvatar} />

    </View>
    );
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      marginBottom: 60
    },
    avatar: {
      flex: 1
    }
  })