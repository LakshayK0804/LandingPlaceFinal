import { Image, View, Text, StyleSheet, TouchableWithoutFeedback } from "react-native"
import { useEffect, useState, useRef } from "react";
import Ionicons from '@expo/vector-icons/Ionicons';
import { MaterialIcons } from '@expo/vector-icons';
import Slider from "@react-native-community/slider";
import { Audio } from "expo-av"
import { useTheme } from "@react-navigation/native";
import { auth } from "../../../firebaseConfig"
import { EXPO_PUBLIC_URL } from "@env"

export function PlayAudioScreen({ navigation, route }) {

    const { colors } = useTheme()

    const img = route.params.image
    const title = route.params.title
    const id = route.params.id


    const [play, setPlay] = useState(true)
    const [audioData, setAudioData] = useState({})
    const [position, setPosition] = useState("")
    const [sliderValue, setSliderValue] = useState(null)
    const [pausedPlayPostition, setPausedPlayPosition] = useState(null)

    const audio = useRef(new Audio.Sound());

    useEffect(() => {
        loadSound()
        return () => {
            // Unload the audio when the component unmounts
            audio.current.unloadAsync();
          };
    }, [])

    if (sliderValue === 1) {
        setPlay(false)
    }

    async function loadSound() {

        const idToken = await auth.currentUser?.getIdToken()

        try {
            await audio.current.loadAsync({ 
                uri: EXPO_PUBLIC_URL + '/audio?id=' + id,
                headers: {Authorization: "Bearer " + idToken}

            })
            await audio.current.getStatusAsync().then((result) => setAudioData(result))
            await audio.current.playAsync();
            audio.current.setOnPlaybackStatusUpdate(updatePlaybackStatus);
        } 
        catch (error) {
            alert(error);
        }
    }

    function updatePlaybackStatus(playbackStatus) {
        if (!playbackStatus.isPlaying) {
            setPlay(false)
        }
        else {
            setPlay(true)
        }

        if (playbackStatus.isPlaying) {
            const min = Math.floor(playbackStatus.positionMillis / 60000).toString();
            const sec = ((playbackStatus.positionMillis % 60000) / 1000).toFixed(0).toString().padStart(2, '0');
            const pos = min + ":" + sec
            setPosition(pos);

            if (sliderValue !== null && playbackStatus.durationMillis > 0 && playbackStatus.positionMillis > 0) {
                let tmp = playbackStatus.positionMillis / playbackStatus.durationMillis
                setSliderValue(tmp)
            }
        }
    }

    async function togglePlay() {
        const result = await audio.current.getStatusAsync();

        if (result.isLoaded) {
            if (result.isPlaying === true) {
                await audio.current.pauseAsync();
                setPlay(false)
            }
            else {
                if (pausedPlayPostition) {
                    await audio.current.playFromPositionAsync(pausedPlayPostition)
                    setPausedPlayPosition(null)
                }
                else {
                    audio.current.playAsync();
                }
                setPlay(true)
            }
        }
    }

    function convert(millis) {
        const minutes = Math.trunc(millis / 60000)
        const seconds = Math.trunc(((millis % 60000) / 1000))

        return minutes + ":" + seconds.toString().padStart(2, '0');
    }

    async function jumpTime(time) {
        const status = await audio.current.getStatusAsync();
        if (time > 0) {
            if (status.positionMillis + time > status.durationMillis) {
                setSliderValue(1)
                audio.current.pauseAsync()
            }
            else {
                await audio.current.playFromPositionAsync(status.positionMillis + time)
            }
        }
        else if (time < 0) {

            if (status.positionMillis + time < 0) {
                setSliderValue(0)
                audio.current.pauseAsync()
                audio.current.replayAsync()
            }
            else {
                await audio.current.playFromPositionAsync(status.positionMillis + time)
            }
        }
        
    }

    async function handleSlidingComplete(val) {
        try {
            await audio.current.pauseAsync()
            if (val == 1.0) {
                await audio.current.stopAsync()
                setPosition(convert(audioData.durationMillis))
            }
            else {
                if (play) {
                    await audio.current.setPositionAsync(Math.floor(val * audioData.durationMillis))
                    await audio.current.playAsync()
                }
                else {
                    setPausedPlayPosition(val * audioData.durationMillis)
                }
            }
        }
        catch(error) {
            alert(error)
        }
    }

    return (
        <View style={styles.container}>
            <Image source={{uri: EXPO_PUBLIC_URL + "/image/audio/" + img}} style={styles.img} resizeMode="center"/>
            
            <Text style={[styles.text, {color: colors.text}]}>{title}</Text>

            <Slider 
                style={{width: "100%", height: 40, alignSelf: "center", marginTop: 10}}
                minimumValue={0}
                maximumValue={1}
                minimumTrackTintColor={colors.primary}
                // maximumTrackTintColor="grey"
                thumbTintColor={colors.primary}
                value={sliderValue}
                onSlidingStart={async() => await audio.current.pauseAsync()}
                onValueChange={(val) => setPosition(convert( val * audioData.durationMillis))}
                onSlidingComplete={(val) => handleSlidingComplete(val)}
            />
            
            <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                <Text style={{color: colors.text}}>{position}</Text>
                <Text style={{color: colors.text}}>{convert(audioData.durationMillis)}</Text>
            </View>

            <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-around", paddingHorizontal: 40,  marginTop: 20}}>

                <TouchableWithoutFeedback onPress={() => jumpTime(-10000)} >
                    <MaterialIcons name="replay-10" size={50} color={colors.text} />
                </TouchableWithoutFeedback>

                <TouchableWithoutFeedback onPress={togglePlay}>
                    <View style={{backgroundColor: "white", alignSelf: "center", alignItems: "center", justifyContent: "center", borderColor: "white", width: 60, height: 60, borderRadius: 50}}>
                        {
                            play ? (
                                <Ionicons name={"pause"} size={30} color={colors.background}/>
                            ) : (
                                <Ionicons name={"play"} size={30} color={colors.background} style={{position: 'relative', top: 0, left: 2}}/>

                            )
                        }
                    </View>
                </TouchableWithoutFeedback>

                <TouchableWithoutFeedback onPress={() => jumpTime(10000)} >
                    <MaterialIcons name="forward-10" size={50} color={colors.text} />
                </TouchableWithoutFeedback>
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20
    },
    img: {
        height: 400,
        width: "100%",
    },
    text: {
        fontSize: 20,
        marginTop: 40,            
    },
})


