import React from 'react';
import {
    GestureHandlerRootView,
    PanGestureHandler,
} from 'react-native-gesture-handler';
import Animated, {
    interpolate,
    useAnimatedGestureHandler,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from 'react-native-reanimated';
import { Image, Dimensions } from 'react-native';
const { height } = Dimensions.get('window');


export default function SubCategoryItems() {
    const translateX = useSharedValue(60);
    const translateY = useSharedValue(0);

    const panGestureEvent = useAnimatedGestureHandler({
        //   ----------------initial state of your view-----------
        onStart: (event, context) => {
            context.translateX = translateX.value;
            context.translateY = translateY.value;
        },
        //   ----------------onActive is show where your view is move -----------

        onActive: (event, context) => {
            // console.log(event.translationX);
            if (event.translationX >= 60) {
                //  in this user go
                translateX.value = withTiming(60);
            } else if (event.translationX <= 0) {
                translateX.value = withTiming(0);
            } else {
                translateX.value = withTiming(event.translationX + context.translateX);
            }
        },
        //   ----------------onEnd is use for end of the animation  -----------
        onEnd: (event, context) => {
            translateY.value = 0;
        },
    });
    // firstview view  animation for manage flex

    const firstview = useAnimatedStyle(() => {
        const flex = interpolate(translateX.value, [60, 0, 60], [0.3, 0.05, 0.3]);

        return {
            flex,
        };
    });
    // secondView view  animation for manage flex

    const secondView = useAnimatedStyle(() => {
        const flex = interpolate(translateX.value, [60, 0, 60], [0.7, 1, 0.7]);
        return {
            flex,
        };
    });

    // image rotate animation
    const imageStyle = useAnimatedStyle(() => {
        const rotate = interpolate(translateX.value, [60, 0, 60], [360, 180, 360]);
        return {
            transform: [{ rotateY: `${rotate}deg` }],
        };
    });
    return (
        <GestureHandlerRootView style={{ flex: 1, backgroundColor: 'white' }}>
            <PanGestureHandler onGestureEvent={panGestureEvent}>
                <Animated.View style={{ flexDirection: 'row', flex: 1 }}>
                    {/*  first view  */}

                    <Animated.View
                        style={[
                            {
                                backgroundColor: 'white',
                                elevation: 10,
                                shadowColor: 'black',
                                zIndex: 1,
                                borderTopRightRadius: 20,
                                borderBottomRightRadius: 20,
                            },
                            firstview,
                        ]}>
                        {/* use  position 'absolute'  for this image for indicator */}

                        <Animated.Image
                            source={{
                                uri: 'https://cdn5.vectorstock.com/i/1000x1000/27/24/back-icon-isolated-on-white-background-icon-vector-25322724.jpg',
                            }}
                            style={[
                                {
                                    height: 20,
                                    width: 20,
                                    position: 'absolute',
                                    right: 0,
                                    top: height / 2,
                                },
                                imageStyle,
                            ]}
                        />
                        {/* add chid view under the animated view*/}

                    </Animated.View>

                    {/*  first view  */}

                    <Animated.View
                        style={[
                            { backgroundColor: 'white', zIndex: 0 },
                            secondView,
                        ]}>
                        {/* add chid view under the animated view*/}
                    </Animated.View>
                </Animated.View>
            </PanGestureHandler>
        </GestureHandlerRootView>
    );
}