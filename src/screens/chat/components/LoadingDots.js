import { useEffect } from "react"
import {View, StyleSheet, Button } from "react-native"
import Animated, { useAnimatedStyle, useSharedValue, withTiming, withRepeat, withDelay } from "react-native-reanimated"

export function LoadingDots() {

    useEffect(() => {
        changeOpacity();
    })

    const circleOpactity = useSharedValue(0.5)
    const circleOpactity1 = useSharedValue(0.5)
    const circleOpactity2 = useSharedValue(0.5)
    
    const opacity = useAnimatedStyle(() => {
        return{
            opacity: circleOpactity.value
        }
    })

    const opacity1 = useAnimatedStyle(() => {
        return{
            opacity: circleOpactity1.value
        }
    })

    const opacity2 = useAnimatedStyle(() => {
        return{
            opacity: circleOpactity2.value
        }
    })

    const changeOpacity = () => {
        circleOpactity.value = withRepeat(withTiming(1), -1, true);
        circleOpactity1.value = withDelay(100, withRepeat(withTiming(1), -1, true));
        circleOpactity2.value = withDelay(200, withRepeat(withTiming(1), -1, true));
    }
    
    return (
        <View>
            <View style={{marginLeft: 10, marginTop: 10, width: 50, flexDirection: "row", justifyContent: "space-around", backgroundColor: "#323232", padding: 5, paddingVertical: 10, borderRadius: 10}}> 
                <Animated.View style={[{height: 10, width: 10, borderRadius: 10, backgroundColor: "white"}, opacity]} />
                <Animated.View style={[{height: 10, width: 10, borderRadius: 10, backgroundColor: "white"}, opacity1]} />
                <Animated.View style={[{height: 10, width: 10, borderRadius: 10, backgroundColor: "white"}, opacity2]} />
            </View>
        </View>
        
    )
}