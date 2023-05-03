import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import {
  APP_BLACK,
  APP_BASE,
  APP_GRAY
} from '../../resources/constants';

import { Icon } from 'native-base';
import { Ionicons } from "@expo/vector-icons";

import GlobalContext from '../globalContext/globalContext';
import CryptoStack from '../cryptoStack/crytpoStack';
import Settings from '../../screens/settings/settings';

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  const global = useContext(GlobalContext);

  return (
    <Tab.Navigator screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

       if (route.name === global.i18n.t('menu-settings')) {
          iconName = focused
            ? 'settings'
            : 'settings-sharp';
        } else if (route.name === global.i18n.t('menu-crypto')) {
          iconName = focused
            ? 'cash'
            : 'cash-outline';
        }

        return <Icon as={Ionicons} name={iconName} size={7} color={focused ? APP_BLACK : APP_GRAY} />;
      },
      tabBarStyle: {
        backgroundColor: APP_BASE,
      },
      headerShown: false,
      tabBarActiveTintColor: APP_BLACK,
      tabBarInactiveTintColor: APP_GRAY,
    })}>
      <Tab.Screen name={global.i18n.t('menu-crypto')} component={CryptoStack} />
      <Tab.Screen name={global.i18n.t('menu-settings')} component={Settings} />
    </Tab.Navigator>
  );
}