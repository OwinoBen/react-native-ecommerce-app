import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import * as Screens from '../Screens';
import navigationStrings from './navigationStrings';
const Stack = createNativeStackNavigator();

export default function () {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen
                name={navigationStrings.POST_CATEGORY}
                component={Screens.P2pOndemandPostCategory}
            />
            <Stack.Screen
                name={navigationStrings.ATTRIBUTE_INFORMATION}
                component={Screens.P2pOndemandAttributeInformation}
            />
        </Stack.Navigator>
    );
}
