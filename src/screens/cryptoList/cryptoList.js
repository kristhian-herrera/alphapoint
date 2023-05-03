import React, { useContext, useEffect, useState } from 'react';
import { Text, Box, useToast } from 'native-base';

import GlobalContext from '../../components/globalContext/globalContext';
import ScreenContainer from '../../components/screenContainer/screenContainer';

import SFMenuItem from '../../components/sfMenuItem/sfMenuItem';
import SFInput from '../../components/sfInput/sfInput';

import CryptoServices from '../../services/cryptoServices';

import helpers from '../../resources/helpers';

export default function CryptoList({ navigation }) {
    const global = useContext(GlobalContext);
    const toast = useToast();

    const [list, setList] = useState(null);
    const [minChange, setMinChange] = useState('');

    //Select crypto
    const selectCrypto = (crypto) => {
        //Allow only if there is internet access
        if (global.networkInfo != null 
            && global.networkInfo.isInternetReachable == true) {
                global.setSelectedCrypto(crypto);
                navigation.navigate('CryptoChart');
        }
    }

    //Build crypto list
    const buildCryptoList = () => {
        let vReturn = [];

        if (list != null) {
            for (let i in list) {
                vReturn.push(
                    <SFMenuItem 
                        key={i}
                        icon={'caret-forward'}
                        text={
                            <Text>
                                {list[i].symbol} - {list[i].name}
                                {"\n"}
                                <Text fontSize={'2xs'} style={{lineHeight:15, paddingLeft:10}}>
                                    {global.i18n.t('rank')}: {list[i].rank}
                                </Text>
                                {"\n"}
                                <Text fontSize={'2xs'} style={{lineHeight:15, paddingLeft:10}}>
                                    {global.i18n.t('min-24-change')}: {list[i].percent_change_24h}
                                </Text>
                            </Text>
                        }
                        onPress={() => selectCrypto(list[i].id)} />
                );
            }
        }

        return vReturn;
    }

    //Get crypto list
    const doGetCryptoList = async () => {
        //Set loading
        helpers.showLoading(global, global.i18n.t('do-get-crypto-list'));

        try {
            //Do get list
            const response = await CryptoServices.getCryptoList(global);

            //Set list data
            const vList = helpers.sortAscArrayByKey(response, 'rank');
            global.setCryptoList(vList);
            setList(vList)

            //Hide loading
            helpers.hideLoading(global);
        } catch (error) {
            //Redirect, hide loading and show error
            helpers.serviceError(global, error, navigation, toast);
        }
    }

    //On load
    useEffect(() => {
        //Get profile
        if (global.cryptoList == null) {
            doGetCryptoList();
        }
    }, []);

    //Do filter
    const doFilter = (val) => {
        if (global.cryptoList) {
            if (isNaN(val) || String(val).trim() == '') {
                setList(global.cryptoList);
            } else {
                const vVal = parseFloat(val);
                const vFiltered = [];
                for (let i in global.cryptoList) {
                    if (parseFloat(global.cryptoList[i].percent_change_24h) >= vVal) {
                        vFiltered.push(global.cryptoList[i]);
                    }
                };
                setList(vFiltered);
            }
        }
    }

    return (
        <ScreenContainer
            userMenu
            navigation={navigation}
            content={
                <Box w={'95%'} alignSelf="center">

                    <Box>
                        <SFInput
                            type="text"
                            icon="search"
                            placeholder={global.i18n.t('min-24-change')}
                            value={minChange}
                            onChangeText={(val) => { setMinChange(val); doFilter(val); }} />
                    </Box>
                    
                    <Box style={{marginTop:20}}>
                        {buildCryptoList()}
                    </Box>
                </Box>
            } />
    );
};