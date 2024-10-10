import { View, Text, StyleSheet, useWindowDimensions, Dimensions, TextInput, KeyboardAvoidingView, ScrollView, Platform, TouchableWithoutFeedback, TouchableOpacity } from "react-native"
import Carousel from "react-native-snap-carousel"
import { useTheme } from "@react-navigation/native"
import { useEffect, useRef, useState } from "react"
import Ionicons from "@expo/vector-icons/Ionicons"
import { auth } from "../../../firebaseConfig"
import HeaderText from "./components/HeaderText"
import { StackActions } from '@react-navigation/native';
import showToast from "../../utils/DisplayToast";
import { EXPO_PUBLIC_URL } from "@env"

function Card({ item, index, size, text, multipleChoice, handleTextChange, handleSetMultipleChoice }) {

    const { colors } = useTheme()

    const BoldText = ({ text }) => {
        // Split the text into parts based on the '^' delimiter

        if (!text) return ""

        const parts = text.split('^');
      
        // Map over the parts and apply bold style to every other part
        const formattedText = parts.map((part, index) =>
          index % 2 === 0 ? (
            <Text key={index}>{part}</Text>
          ) : (
            <Text key={index} style={{ fontWeight: 'bold', textDecorationLine: 'underline' }}>
              {part}
            </Text>
          )
        );
      
        return <Text style={[styles.textCard, { color: colors.text }]}>{formattedText}</Text>;
      };

    function MultipleChoiceOption({content, index, key, style}) {

        const { colors } = useTheme()

        return(            
            <View style={{flexDirection: style === "horizontal" ? "row" : "column", alignItems: "center"}}>
                {/* <BoldText style={{color: colors.text, fontSize: 20}}>{content.pretext}</BoldText> */}
                {/* {content.map((option, ind) => ( */}
                    <View>
                         <TouchableOpacity onPress={() => handleSetMultipleChoice(index)}>
                         {/* borderColor: multipleChoice[index] === key ? colors.primary : colors.card, */}
                            <View style={{padding: 10, borderRadius: 10, backgroundColor: colors.card, margin: 5, flexDirection: "row", alignItems: "center", borderWidth: 1, marginBottom: 20, borderColor: multipleChoice[index] === 1 ? colors.primary : colors.card}}>
                                <Text style={{color: colors.text, fontSize: 16}}>{content}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                {/* ))} */}
            </View>
        )
    }

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
            
            <ScrollView scrollEnabled={false} keyboardShouldPersistTaps="always" keyboardDismissMode={Platform.OS === "ios" ? "interactive" : "on-drag"} contentContainerStyle={{flex: 1, justifyContent: "center", alignItems: "center"}}>

                <Text style={{color: "gray", position: "absolute", top: 20, right: 20}}>{index + 1 + " / " + size}</Text>

                {item.type === "text" &&
                    <BoldText style={[styles.textCard, { color: colors.text }]} text={item.content}/>
                }

                {item.type === "fib" && (
                    <View style={{margin: 40, justifyContent: "center"}}>

                    <View style={{flex: 1, justifyContent: "center"}}>
                        <Text style={{ color: colors.text, fontSize: 20, textAlign: "center"}}>{item.pretext}</Text>
                    </View>

                    {item.content > 1 ? (
                        <View style={{flex: 1, margin: 20}}>
                            <Text style={{color: colors.text, fontSize: 20, textAlign: "center", backgroundColor: "red", padding: 10}}>{item.content}</Text>
                            {item.content.map((itm, ind) => (
                                <TextInput
                                    key={item.key[ind]}
                                    value={text}
                                    onChangeText={(txt) => handleTextChange(item.key[ind], txt)}
                                    placeholder="Type Here"
                                    placeholderTextColor={"gray"}
                                    style={{padding: 10, borderBottomWidth: 1, borderColor: colors.border, fontSize: 20, color: colors.text}}
                                />
                            ))}
                        </View> ) : (
                        <View style={{flex: 1, justifyContent:"center", margin: 20}}>
                            {item.content.map((itm, ind) => (
                                <View key={ind} style={{flexDirection: "row", alignItems: "center", justifyContent: item.content?.length > 1 && "space-between", borderBottomWidth: 1, borderColor: colors.border}}>
                                    <Text style={{color: colors.text, fontSize: 20}}>{item.content[ind]}</Text>
                                    <TextInput
                                        key={item.key[ind]}
                                        value={text}
                                        onChangeText={(txt) => handleTextChange(item.key[ind], txt)}
                                        placeholder="Type Here"
                                        placeholderTextColor={"gray"}
                                        style={{padding: 10, fontSize: 20, color: colors.text, flexGrow: item.content?.length === 1 ? 1 : 0}}
                                    />
                                </View>
                            ))}
                        </View>
                    )}

                    <View style={{flex: 1, justifyContent: "center"}}>
                        <Text style={{color: colors.text, fontSize: 20, textAlign: "center"}}>{item.posttext}</Text>
                    </View>

                    </View>
                )}

                {item.type === "mc" && (
                    <View style={{margin: 40}}>
                        <View style={{flex: 1, justifyContent: "center"}}>
                            <BoldText style={{color: colors.text, fontSize: 20, textAlign: "center"}} text={item.pretext} />
                        </View>

                        {item.options.map((content, index) => (
                            <MultipleChoiceOption content={content} index={index} style={item.style} key={item.key[index]}/>
                        ))}

                        <View style={{flex: 1, justifyContent: "center"}}>
                            <BoldText style={{color: colors.text, fontSize: 20, textAlign: "center"}} text={item.posttext} />
                        </View>
                    </View>
                )}

            </ScrollView>
            
        </KeyboardAvoidingView>
    )
}

export function CompleteActivityScreen({ navigation, route }) {

    const { colors } = useTheme()

    const [cards, setCards] = useState([])
    // const { width } = useWindowDimensions();
    const screen = Dimensions.get('screen');
    const width = screen.width;
    const headerButton = useRef(null)
    const [headerDisabled, setHeaderDisabled] = useState(true)

    const [text, setText] = useState()
    const [multipleChoice, setMultipleChoice] = useState();

    // Fetch the activity by id passed from the library screen
    useEffect(() => {

        async function getActivity() {
            const idToken = await auth.currentUser?.getIdToken();

            console.log(EXPO_PUBLIC_URL + "/exercise/" + route.params.id)

            await fetch(EXPO_PUBLIC_URL + "/exercise/" + route.params.id, {
                headers: {
                    "Authorization": "Bearer " + idToken
                }
            })
            .then((response) => {
                if (response.ok) {
                    //console.log("response", response.json);
                    return response.json()
                }
                else {
                    alert("Network Error")
                }
            })
            .then((data) => {
                setText(new Array(data.inputs.fib).fill(""))
                setMultipleChoice(new Array(data.inputs.mc).fill(-1))
                setCards(data.cards)
            })
            .catch((error) => alert("Network Error: " + error))
        }
        getActivity()
        
    },[])

    useEffect(() => {
        console.log("cards", cards);
        console.log("mc", cards[5]);
    }, [cards]);

    const handleTextChange = (ind, value) => {
        const newArray = [...text];
        newArray[ind] = value;
        setText(newArray);
      };

    const handleSetMultipleChoice = (value) => {
        console.log("handle", multipleChoice, "value", value);
        // let newArray = [...multipleChoice];
        // newArray[value] = 1;
        // setMultipleChoice(newArray);
        // console.log("done handle", multipleChoice);
        let mc = [...multipleChoice];
        mc[value] = 1;
        setMultipleChoice(mc);
        console.log("done handle", multipleChoice);
    };

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity ref={headerButton} disabled={headerDisabled} onPress={completedActivity} style={{opacity: headerDisabled ? 0.5 : 1, marginRight: 5, marginTop: 5}}>
                    <Ionicons name={"checkmark-outline"} color={colors.text} size={25}/>
                </TouchableOpacity>
            )
        });
    })

    async function completedActivity() {

        const idToken = await auth.currentUser?.getIdToken();

        console.log("multipleChoice", multipleChoice);

        await fetch(EXPO_PUBLIC_URL + "/exercise/complete", {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + idToken,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: route.params.id,
                fib: text,
                mc: multipleChoice
            })
        })
        .then((response) => {
            if (response.ok) {
                showToast("success", "Thank You!", "Submission Successful", colors.card)
                navigation.dispatch(StackActions.pop(1))
            }
            else {
                showToast("error", "Network Error", "Something went wrong", colors.card)
            }
        })
        .catch((error) => alert("Network Error: " + error))
    }

    function handleSnapToItem(index) {
        if (index + 1 == cards.length) {
            setHeaderDisabled(false)
        }
    }

    return (
        <View style={styles.container}>
            {cards.length > 1 && (
                <Carousel
                    data={cards}
                    renderItem={({ item, index }) => <Card item={item} index={index} size={cards.length} text={text} setText={setText} handleTextChange={handleTextChange} multipleChoice={multipleChoice} handleSetMultipleChoice={handleSetMultipleChoice}/>}
                    layout="default"
                    layoutCardOffset={18}
                    sliderWidth={width}
                    itemWidth={width}
                    onSnapToItem={handleSnapToItem}
                />
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    cardContainer: {
        flex: 1,
    },
    textCard: {
        fontSize: 20, 
        textAlign: "center",
        margin: 40
    }
})