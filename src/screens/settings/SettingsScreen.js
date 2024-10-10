import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from "react-native";
import { auth } from "../../../firebaseConfig";
import { useTheme } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useUserStore } from "../../stores"
import { CommonActions } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AvatarSvg from "../../components/AvatarSvg";
export function SettingsScreen({ navigation }) {

  const { colors } = useTheme()

  const deleteUser = useUserStore((store) => store.deleteUser)
  const settings = useUserStore((store) => store.settings)
  const updateSettings = useUserStore((store) => store.updateSettings)
  const user = useUserStore((store) => store.user)

  function signOut() {
    auth.signOut().then(() => {
      // Sign out success
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [
            { name: 'Home' },
          ],
        })
      );
    })
    .catch((error) => {
      alert(error)
    });
    deleteUser()
  }

  return (
    <ScrollView style={styles.container}>

      <View style={{margin: 10}} />

        <TouchableOpacity onPress={() => navigation.navigate("Edit Avatar")} style={[styles.singleOption, {backgroundColor: colors.card}]}>
          {/*<MaterialCommunityIcons name="account-reactivate" color={"gray"} size={24} style={styles.iconStyle} />*/}
          {/*<View style={{}}>*/}
            <AvatarSvg style={[styles.iconStyle, {left: -185, top: 3, padding: 20}]}/>
          {/*</View>*/}
          <Text style={[styles.text, {color: colors.text}]}>Update Avatar</Text>
        </TouchableOpacity>

        {/*<TouchableOpacity onPress={() => alert("Change Interests Here")} style={[styles.singleOption, {backgroundColor: colors.card}]}>*/}
        {/*    <MaterialCommunityIcons name="account-search-outline" color={"gray"} size={24} style={styles.iconStyle} />*/}
        {/*    <Text style={[styles.text, {color: colors.text}]}>Update Demographics</Text>*/}
        {/*</TouchableOpacity>*/}

        <View style={{margin: 10}} />

        {/*<TouchableOpacity onPress={() => navigation.navigate("Color Picker")} style={[styles.doubleOption, {backgroundColor: colors.card, borderTopWidth: StyleSheet.hairlineWidth}]}>*/}
        {/*    <Ionicons name={"color-palette"} color={"gray"} size={24} style={styles.iconStyle}/>*/}
        {/*    <Text style={[styles.text, {color: colors.text}]}>System Color</Text>*/}
        {/*    <View style={{backgroundColor: colors.primary, width: 30, height: 20, borderRadius: 10, marginRight: 10}} />*/}
        {/*</TouchableOpacity>*/}
        <TouchableOpacity onPress={() => updateSettings("haptics", !settings.haptics)} style={[styles.doubleOption, {backgroundColor: colors.card, borderTopWidth: StyleSheet.hairlineWidth}]}>
          <MaterialCommunityIcons name={settings.haptics ? "vibrate" : "vibrate-off"} color={"gray"} size={24} style={styles.iconStyle} />
          <Text style={[styles.text, {color: colors.text}]}>Haptics</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => updateSettings("notifications", !settings.notifications)} style={[styles.doubleOption, {backgroundColor: colors.card, borderTopWidth: StyleSheet.hairlineWidth}]}>
          <Ionicons name={settings.notifications ? "notifications" : "notifications-off"} color={"gray"} size={24} style={styles.iconStyle} />
          <Text style={[styles.text, {color: colors.text}]}>Notifications</Text>
        </TouchableOpacity>

        <View style={{margin: 10}} />

        <TouchableOpacity onPress={() => navigation.navigate("About Screen")} style={[styles.singleOption, {backgroundColor: colors.card, borderTopWidth: StyleSheet.hairlineWidth}]}>
          <Ionicons name={"newspaper"} color={"gray"} size={24} style={styles.iconStyle} />
          <Text style={[styles.text, {color: colors.text}]}>Terms of Service</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Report Bug")} style={[styles.singleOption, {backgroundColor: colors.card, borderTopWidth: StyleSheet.hairlineWidth}]}>
          <Ionicons name={"bug"} color={"gray"} size={24} style={styles.iconStyle} />
          <Text style={[styles.text, {color: colors.text}]}>Report Bug</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Feedback")} style={[styles.singleOption, {backgroundColor: colors.card, borderTopWidth: StyleSheet.hairlineWidth}]}>
          <Ionicons name={"chatbox-ellipses"} color={"gray"} size={24} style={styles.iconStyle} />
          <Text style={[styles.text, {color: colors.text}]}>Give Feedback</Text>
        </TouchableOpacity>

        <View style={{margin: 10}} />

        <Text style={styles.headerText}></Text>
        <TouchableOpacity onPress={signOut} style={[styles.singleOption, {backgroundColor: colors.card}]}>
            <MaterialCommunityIcons name={"exit-to-app"} color={"gray"} size={24} style={styles.iconStyle} />
            <Text style={[styles.text, {color: colors.text}]}>Sign Out</Text>
        </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    fontWeight: "bold",
    marginLeft: 35.
  },
  iconStyle: {
    position: "absolute",
    alignSelf: "center",
    marginLeft: 10
  },
  singleOption: {
    paddingVertical: 20,
    paddingHorizontal: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    borderWidth: StyleSheet.hairlineWidth, 
    borderTopWidth: 0
  },
  doubleOption: {
    paddingVertical: 20,
    paddingHorizontal: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    borderWidth: StyleSheet.hairlineWidth,
    borderTopWidth: 0
  }
});
