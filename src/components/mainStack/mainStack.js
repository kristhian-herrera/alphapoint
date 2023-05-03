import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import MainTabs from '../mainTabs/mainTabs';
import Login from '../../screens/login/login';

const stack = createNativeStackNavigator();

export default function MainStack() {
    return (
        <NavigationContainer>
            <stack.Navigator screenOptions={{ headerShown: false }}>
                <stack.Screen name={'Login'} component={Login} />
                <stack.Screen name={'MainTabs'} component={MainTabs} />
            </stack.Navigator>
        </NavigationContainer>
    );
}