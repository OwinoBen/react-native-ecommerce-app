import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {useSelector} from 'react-redux';
import navigationStrings from './navigationStrings';
import * as Screens from '../Screens';
const Stack = createNativeStackNavigator();

export default function () {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen
        name={navigationStrings.CHAT_ROOM}
        component={Screens.ChatRoom}
      />
      <Stack.Screen
        name={navigationStrings.CHAT_SCREEN}
        component={Screens.ChatScreen}
      />
    </Stack.Navigator>
  );
}
