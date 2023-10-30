import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { P2pChatRoom, P2pChatScreen } from '../Screens';
import navigationStrings from './navigationStrings';
const Stack = createNativeStackNavigator();

export default function () {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen
                name={navigationStrings.CHAT_ROOM}
                component={P2pChatRoom}
            />
            <Stack.Screen
                name={navigationStrings.CHAT_SCREEN}
                component={P2pChatScreen}
            />
        </Stack.Navigator>
    );
}
