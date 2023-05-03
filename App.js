import 'react-native-gesture-handler';
import React, { useState } from 'react';
import { enableScreens } from 'react-native-screens';
enableScreens(true);

import { I18n } from 'i18n-js';
import translations from './src/resources/translations';
import { StatusBar } from "react-native";
import { DEFAULT_LANG } from './src/resources/constants';

import { NativeBaseProvider, Box } from "native-base";

import GlobalContext from './src/components/globalContext/globalContext';
import Setup from './src/boot/setup';
import SFLoading from './src/components/sfLoading/sfLoading';
import NoInternet from './src/components/noInternet/noInternet';

export default function App() {
  //Define translations
  const i18n = new I18n(translations);

  //Global variables
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isBusy, setIsBusy] = useState(false);
  const [busyText, setBusyText] = useState(i18n.t('loading'));
  const [currentLanguage, setCurrentLanguage] = useState(DEFAULT_LANG);
  const [user, setUser] = useState(null);
  const [orientation, setOrientation] = useState(null);
  const [networkInfo, setNetworkInfo] = useState(null);
  const [cryptoList, setCryptoList] = useState(null);
  const [selectedCrypto, setSelectedCrypto] = useState(null);

  //i18n config
  i18n.locale = currentLanguage;
  i18n.enableFallback = true;

  const globalSettings = {
    isLoggedIn: isLoggedIn,
    setIsLoggedIn: setIsLoggedIn,
    isBusy: isBusy,
    setIsBusy: setIsBusy,
    busyText: busyText,
    setBusyText: setBusyText,
    i18n: i18n,
    currentLanguage: currentLanguage,
    setCurrentLanguage: setCurrentLanguage,
    user: user,
    setUser: setUser,
    orientation: orientation,
    setOrientation: setOrientation,
    networkInfo: networkInfo,
    setNetworkInfo: setNetworkInfo,
    cryptoList: cryptoList,
    setCryptoList: setCryptoList,
    selectedCrypto: selectedCrypto,
    setSelectedCrypto: setSelectedCrypto
  }

  return (
    <GlobalContext.Provider value={globalSettings}>
      <StatusBar animated={true} barStyle={'dark-content'} />
      <NativeBaseProvider>
        <NoInternet />
        <SFLoading />
        <Box style={{ width: '100%', height: '100%' }}>
          <Setup />
        </Box>
      </NativeBaseProvider>
    </GlobalContext.Provider>
  );
}
