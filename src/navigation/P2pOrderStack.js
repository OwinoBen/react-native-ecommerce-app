import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { useSelector } from 'react-redux';
import { MyOrders, OrderDetail, P2pMyOrders, P2pOrderDetail, RentTypeList } from '../Screens';
import navigationStrings from './navigationStrings';

const Stack = createNativeStackNavigator();
export default function ({ navigation }) {
    const { appData, appStyle } = useSelector((state) => state?.initBoot);

    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}>
            <Stack.Screen name={navigationStrings.MY_ORDERS} component={P2pMyOrders} />
            <Stack.Screen
                name={navigationStrings.RENT_TYPE_LISTING}
                component={RentTypeList}
            />
            <Stack.Screen
                name={navigationStrings.P2P_ORDER_DETAIL}
                component={P2pOrderDetail}
            />
        </Stack.Navigator>
    );
}
