import { useEffect, useRef, useState } from "react"
import { View, StyleSheet, Text, TouchableOpacity, ScrollView} from "react-native"
import { useTheme } from "@react-navigation/native"
import { createAvatar } from '@dicebear/core';
import { personas } from '@dicebear/collection';
import { personasOptions } from "./AvatarOptions";
import { SvgXml } from 'react-native-svg';
import Ionicons from "@expo/vector-icons/Ionicons";

export default function AvatarEditor({setAvatar, currentAvatar}) {

    const { colors } = useTheme()

    if (currentAvatar) {
        currentAvatar = JSON.parse(currentAvatar)
    }

    const [personasAttributes, setPersonasAttributes] = useState({
        skinColor: 0,
        body: 0,
        clothingColor: 0,
        eyes: 0,
        hair: 0,
        hairColor: 0,
        nose: 0,
        mouth: 0,
        facialHair: 0,
    })

    // If editing avatar, we find the position of the options in the options list
    useEffect(() => {
        if (currentAvatar) {
            let tempSkinColor, tempBody, tempClothingColor, tempEyes, tempHair, tempHairColor, tempNose, tempMouth, tempFacialHair
            tempSkinColor = personasOptions.skinColor.indexOf(currentAvatar.skinColor.split("#")[1])
            tempBody = personasOptions.body.indexOf(currentAvatar.body)
            tempClothingColor = personasOptions.clothingColor.indexOf(currentAvatar.clothingColor.split("#")[1])
            tempEyes = personasOptions.eyes.indexOf(currentAvatar.eyes)
            tempHair = personasOptions.hair.indexOf(currentAvatar.hair)
            tempHairColor = personasOptions.hairColor.indexOf(currentAvatar.hairColor.split("#")[1])
            tempNose = personasOptions.nose.indexOf(currentAvatar.nose)
            tempMouth = personasOptions.mouth.indexOf(currentAvatar.mouth)
            tempFacialHair = personasOptions.facialHair.indexOf(currentAvatar.facialHair)

            setPersonasAttributes({
                skinColor: tempSkinColor, body: tempBody, clothingColor: tempClothingColor, eyes: tempEyes, hair: tempHair, hairColor: tempHairColor, nose: tempNose, mouth: tempMouth, facialHair: tempFacialHair
            })
        }
    },[])

    const avatar = createAvatar(personas, {
        skinColor: [personasOptions.skinColor[personasAttributes.skinColor]],
        body: [personasOptions.body[personasAttributes.body]],
        clothingColor: [personasOptions.clothingColor[personasAttributes.clothingColor]],
        eyes: [personasOptions.eyes[personasAttributes.eyes]],
        hair: [personasOptions.hair[personasAttributes.hair]],
        hairColor: [personasOptions.hairColor[personasAttributes.hairColor]],
        nose: [personasOptions.nose[personasAttributes.nose]],
        mouth: [personasOptions.mouth[personasAttributes.mouth]],
        facialHairProbability: personasOptions.facialHairProbability[personasAttributes.facialHairProbability],
        facialHair: [personasOptions.facialHair[personasAttributes.facialHair]],
    })
    const avatarJson = avatar.toJson();

    // Input: The option to change and the value (1, -1) to move the index
    function setOption(option, val) {
        if (!(personasAttributes[option] + val >= personasOptions[option]?.length || personasAttributes[option] + val < 0)) {
            setPersonasAttributes( prevState => {
                return {...prevState, [option]: prevState[option] + val}
            })
        }
    }

    function setProbability(option, val) {
        setPersonasAttributes( prevState => {
            return {...prevState, [option]: val}
        })
    }

    return (
        <View style={styles.container}>

            <View style={[styles.avatarContainer, {backgroundColor: colors.card}]}>
                <SvgXml xml={avatarJson.svg} />
            </View>

            <View style={styles.buttonsContainer}>
            
                <ScrollView showsVerticalScrollIndicator={false}>

                    <View style={[styles.buttonGroup, { backgroundColor: colors.card }]}>
                        <Ionicons name={"arrow-back-circle-outline"} size={36} color={colors.text} onPress={() => setOption("skinColor", -1)} />
                        <View style={{flexDirection: "column", alignItems: "center"}}>
                            <Text style={{color: colors.text, fontSize: 16}}>Skin Color</Text>
                            <Text style={{color: colors.text, fontSize: 12}}>{personasAttributes.skinColor + 1}</Text>
                        </View>
                        <Ionicons name={"arrow-forward-circle-outline"} size={36} color={colors.text} onPress={() => setOption("skinColor", 1)} />
                    </View>

                    <View style={[styles.buttonGroup, { backgroundColor: colors.card }]}>
                        <Ionicons name={"arrow-back-circle-outline"} size={36} color={colors.text} onPress={() => setOption("body", -1)} />
                        <View style={{flexDirection: "column", alignItems: "center"}}>
                            <Text style={{color: colors.text, fontSize: 16}}>Body</Text>
                            <Text style={{color: colors.text, fontSize: 12}}>{personasAttributes.body + 1}</Text>
                        </View>
                        <Ionicons name={"arrow-forward-circle-outline"} size={36} color={colors.text} onPress={() => setOption("body", 1)} />
                    </View>

                    <View style={[styles.buttonGroup, { backgroundColor: colors.card }]}>
                        <Ionicons name={"arrow-back-circle-outline"} size={36} color={colors.text} onPress={() => setOption("clothingColor", -1)} />
                        <View style={{flexDirection: "column", alignItems: "center"}}>
                            <Text style={{color: colors.text, fontSize: 16}}>Clothing Color</Text>
                            <Text style={{color: colors.text, fontSize: 12}}>{personasAttributes.clothingColor + 1}</Text>
                        </View>
                        <Ionicons name={"arrow-forward-circle-outline"} size={36} color={colors.text} onPress={() => setOption("clothingColor", 1)} />
                    </View>

                    <View style={[styles.buttonGroup, { backgroundColor: colors.card }]}>
                        <Ionicons name={"arrow-back-circle-outline"} size={36} color={colors.text} onPress={() => setOption("eyes", -1)} />
                        <View style={{flexDirection: "column", alignItems: "center"}}>
                            <Text style={{color: colors.text, fontSize: 16}}>Eyes</Text>
                            <Text style={{color: colors.text, fontSize: 12}}>{personasAttributes.eyes + 1}</Text>
                        </View>
                        <Ionicons name={"arrow-forward-circle-outline"} size={36} color={colors.text} onPress={() => setOption("eyes", 1)} />
                    </View>

                    <View style={[styles.buttonGroup, { backgroundColor: colors.card }]}>
                        <Ionicons name={"arrow-back-circle-outline"} size={36} color={colors.text} onPress={() => setOption("hair", -1)} />
                        <View style={{flexDirection: "column", alignItems: "center"}}>
                            <Text style={{color: colors.text, fontSize: 16}}>Hair</Text>
                            <Text style={{color: colors.text, fontSize: 12}}>{personasAttributes.hair + 1}</Text>
                        </View>
                        <Ionicons name={"arrow-forward-circle-outline"} size={36} color={colors.text} onPress={() => setOption("hair", 1)} />
                    </View>

                    <View style={[styles.buttonGroup, { backgroundColor: colors.card }]}>
                        <Ionicons name={"arrow-back-circle-outline"} size={36} color={colors.text} onPress={() => setOption("hairColor", -1)} />
                        <View style={{flexDirection: "column", alignItems: "center"}}>
                            <Text style={{color: colors.text, fontSize: 16}}>Hair Color</Text>
                            <Text style={{color: colors.text, fontSize: 12}}>{personasAttributes.hairColor + 1}</Text>
                        </View>
                        <Ionicons name={"arrow-forward-circle-outline"} size={36} color={colors.text} onPress={() => setOption("hairColor", 1)} />
                    </View>

                    <View style={[styles.buttonGroup, { backgroundColor: colors.card }]}>
                        <Ionicons name={"arrow-back-circle-outline"} size={36} color={colors.text} onPress={() => setOption("nose", -1)} />
                        <View style={{flexDirection: "column", alignItems: "center"}}>
                            <Text style={{color: colors.text, fontSize: 16}}>Nose</Text>
                            <Text style={{color: colors.text, fontSize: 12}}>{personasAttributes.nose + 1}</Text>
                        </View>
                        <Ionicons name={"arrow-forward-circle-outline"} size={36} color={colors.text} onPress={() => setOption("nose", 1)} />
                    </View>

                    <View style={[styles.buttonGroup, { backgroundColor: colors.card }]}>
                        <Ionicons name={"arrow-back-circle-outline"} size={36} color={colors.text} onPress={() => setOption("mouth", -1)} />
                        <View style={{flexDirection: "column", alignItems: "center"}}>
                            <Text style={{color: colors.text, fontSize: 16}}>Mouth</Text>
                            <Text style={{color: colors.text, fontSize: 12}}>{personasAttributes.mouth + 1}</Text>
                        </View>
                        <Ionicons name={"arrow-forward-circle-outline"} size={36} color={colors.text} onPress={() => setOption("mouth", 1)} />
                    </View>

                    <View style={[styles.buttonGroup, { backgroundColor: colors.card }]}>
                        <Ionicons name={"arrow-back-circle-outline"} size={36} color={colors.text} onPress={() => setProbability("facialHairProbability", 0)} />
                        <View style={{flexDirection: "column", alignItems: "center"}}>
                            <Text style={{color: colors.text, fontSize: 16}}>Facial Hair</Text>
                            <Text style={{color: colors.text, fontSize: 12}}>{personasAttributes.facialHairProbability === 0 ? "No" : "Yes"}</Text>
                        </View>
                        <Ionicons name={"arrow-forward-circle-outline"} size={36} color={colors.text} onPress={() => setProbability("facialHairProbability", 100)} />
                    </View>


                    <View style={[styles.buttonGroup, { backgroundColor: colors.card }]}>
                        <Ionicons name={"arrow-back-circle-outline"} size={36} color={colors.text} onPress={() => setOption("facialHair", -1)} />
                        <View style={{flexDirection: "column", alignItems: "center"}}>
                            <Text style={{color: colors.text, fontSize: 16}}>Facial Hair Style</Text>
                            <Text style={{color: colors.text, fontSize: 12}}>{personasAttributes.facialHair + 1}</Text>
                        </View>
                        <Ionicons name={"arrow-forward-circle-outline"} size={36} color={colors.text} onPress={() => setOption("facialHair", 1)} />
                    </View>

                    <View style={{margin: 10}} />

                    <TouchableOpacity onPress={() => setAvatar(avatarJson)} style={{borderRadius: 10, height: 50, backgroundColor: colors.primary, justifyContent: "center", alignItems: "center"}}>
                        <Text style={{color: colors.text}}>Finish</Text>
                    </TouchableOpacity>

                    <View style={{margin: 5}} />
                </ScrollView>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 10
    },
    avatarContainer: {
        flex: 1,
        borderRadius: 10,
        marginHorizontal: 20
    },
    buttonsContainer: {
        flex: 2,
        paddingHorizontal: 20,
        paddingVertical: 5
    },
    buttonGroup: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderRadius: 10,
        padding: 5,
        marginBottom: 5,
    }
})