import React, { useEffect, useContext } from 'react';
import { useColorMode } from "native-base";
import { Asset } from 'expo-asset';
import * as ScreenOrientation from 'expo-screen-orientation';
import NetInfo from "@react-native-community/netinfo";

import GlobalContext from '../components/globalContext/globalContext';
import App from '../app';

import helpers from '../resources/helpers';

export default function Setup() {
  const global = useContext(GlobalContext);
  const { setColorMode } = useColorMode();

  //User defaults
  const setUserDefaults = async () => {
    //Set user theme
    setColorMode(await helpers.getUserTheme());

    //Get user lang
    global.setCurrentLanguage(await helpers.getUserLang());
  }

  //Initial load
  useEffect(() => {
    //User defaults
    setUserDefaults();

    //Get initial orientation
    getInitialOrientation();

    //Set orientation change
    ScreenOrientation.addOrientationChangeListener(onOrientationChange);

    //Subscribe networkInfo
    const unsubscribeNetInfo = NetInfo.addEventListener(info => {
      global.setNetworkInfo(info);
    });

    //Preload images
    Asset.fromModule(require("../../assets/ap-black.png")).downloadAsync();
    Asset.fromModule(require("../../assets/ap-white.png")).downloadAsync();
    Asset.fromModule(require("../../assets/ap-icon.png")).downloadAsync();
    Asset.fromModule(require("../../assets/ap-splash.png")).downloadAsync();
    Asset.fromModule(require("../../assets/login.png")).downloadAsync();
    Asset.fromModule(require("../../assets/settings.png")).downloadAsync();

    return () => {
      //Unsubscribe networkInfo
      unsubscribeNetInfo();
    }
  }, []);

  const getInitialOrientation = async () => {
    const vOrientation = await ScreenOrientation.getOrientationAsync();
    global.setOrientation(vOrientation);
  }

  const onOrientationChange = (o) => {
    global.setOrientation(o.orientationInfo.orientation);
  }

  return <App />;
}