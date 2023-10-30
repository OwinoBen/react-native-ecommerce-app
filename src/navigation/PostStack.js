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
        name={navigationStrings.POST_CATEGORY}
        component={Screens.Post}
      />
      <Stack.Screen
        name={navigationStrings.ATTRIBUTE_INFORMATION}
        component={Screens.AttributeInformation}
      />
    </Stack.Navigator>
  );
}
