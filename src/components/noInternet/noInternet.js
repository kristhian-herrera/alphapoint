import React, { useContext } from "react";
import { Icon, Box, Text, Image } from "native-base";

import styles from "../../resources/styles";
import { Ionicons } from "@expo/vector-icons";

import GlobalContext from "../globalContext/globalContext";

export default function NoInternet(props) {
    const global = useContext(GlobalContext);
    const noInternetMarginTop = global.orientation == 1 ? { marginTop:50 } : { marginTop:0 };
    const noInternetHeight = global.orientation == 1 ? { height:170 } : { height:100 };
    let vContent = [];

    if (global.networkInfo != null && global.networkInfo.isInternetReachable == false) {
        vContent.push(
            <Box key={'nI1'} style={[styles.noInternet, noInternetHeight]}>
                <Box style={noInternetMarginTop}>
                    <Icon 
                        as={Ionicons} 
                        name='alert-circle' 
                        color={'#000000'}
                        size={12}
                        style={{alignSelf:'center'}} />
                    <Text style={[styles.noInternetText, {marginTop:15}]}>
                        {global.i18n.t('no-internet')}
                    </Text>
                </Box>
            </Box>
        );
    }

    return vContent;
}