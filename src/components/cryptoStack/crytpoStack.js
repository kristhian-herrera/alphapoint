import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import CryptoList from '../../screens/cryptoList/cryptoList';
import CryptoChart from '../../screens/cryptoChart/cryptoChart';

const stack = createNativeStackNavigator();

export default function CryptoStack() {
    return (
        <stack.Navigator screenOptions={{ headerShown: false }}>
            <stack.Screen name={'CryptoList'} component={CryptoList} />
            <stack.Screen name={'CryptoChart'} component={CryptoChart} />
        </stack.Navigator>
    );
}