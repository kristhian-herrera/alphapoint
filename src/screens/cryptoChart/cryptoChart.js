import React, { useContext, useEffect, useState } from 'react';
import { Text, Box, useToast } from 'native-base';
import { LineChart, Grid, YAxis, XAxis } from 'react-native-svg-charts';

import GlobalContext from '../../components/globalContext/globalContext';
import ScreenContainer from '../../components/screenContainer/screenContainer';

import CryptoServices from '../../services/cryptoServices';
import helpers from '../../resources/helpers';

import { 
    CHART_TIMEOUT, 
    CHART_CALLS 
} from '../../resources/constants';

export default function CryptoChart({ navigation }) {
    const global = useContext(GlobalContext);
    const toast = useToast();

    const [crypto, setCrypto] = useState(null);
    const [data, setData] = useState([]);
    const [timeData, setTimeData] = useState([]);
    const [nextRefresh, setNextRefresh] = useState(0);
    let chartTimer = 0;
    let resetTimer = 0;
    let countTimer = parseInt(CHART_TIMEOUT / 1000);

    //Get crypto detail
    const doGetCryptoDetail = async () => {
        //Set loading
        if (data.length == 0) {
            helpers.showLoading(global, global.i18n.t('do-get-crypto-detail'));
        }

        try {
            //Do get detail
            const response = await CryptoServices.getCryptoDetail(global, global.selectedCrypto);

            //Set crypto
            setCrypto(response[0]);

            //Set data
            let vData = data;
            vData.push(response[0].price_usd);
            setData(vData);

            //Set time data
            let vTimeData = timeData;
            vTimeData.push(helpers.formatTime(new Date()));
            setTimeData(vTimeData);

            //Clear intervals
            if (data.length > CHART_CALLS) {
                destroyTimers();
            }

            //Hide loading
            helpers.hideLoading(global);
        } catch (error) {
            //Redirect, hide loading and show error
            helpers.serviceError(global, error, navigation, toast);
        }
    }

    //Destroy timers
    const destroyTimers = () => {
        clearInterval(resetTimer);
        clearInterval(chartTimer);
    }

    //Timer
    useEffect(() => {
        resetTimer = setInterval(() => {
            setNextRefresh(countTimer--);
        }, 1000);
    
        return () => {
            destroyTimers();
        }
    }, []);

    //On crypto change
    useEffect(() => {
        if (global.selectedCrypto != null) {
            //Allow only if there is internet access
            if (global.networkInfo != null 
                && global.networkInfo.isInternetReachable == true) {
                    //First call
                    doGetCryptoDetail();
                    //Reset count timer
                    countTimer = parseInt(CHART_TIMEOUT / 1000);
            }

            //Set interval
            chartTimer = setInterval(() => {
                //Allow only if there is internet access
                if (global.networkInfo != null 
                    && global.networkInfo.isInternetReachable == true) {
                        //Do call
                        doGetCryptoDetail();
                        //Reset count timer
                        countTimer = parseInt(CHART_TIMEOUT / 1000);
                }
            }, CHART_TIMEOUT);
        }
    }, [global.selectedCrypto]);

    return (
        <ScreenContainer
            userMenu
            backButton
            title={crypto != null ? crypto.symbol + ' - ' + crypto.name : ''}
            navigation={navigation}
            content={
                <Box w={'95%'} alignSelf="center">
                    
                    <Text fontSize={'xl'} textAlign={'center'} style={{marginTop:20}}>
                        {global.i18n.t('current-price')}: USD {crypto != null && helpers.formatFloat(data[data.length-1])}
                    </Text>

                    <Box style={{ flexDirection:'row', marginTop:20, paddingLeft:10, height: 300, backgroundColor:'#ffffff' }}>
                        <YAxis
                            data={data}
                            contentInset={{ top: 40, bottom: 40 }}
                            svg={{
                                fill: 'grey',
                                fontSize: 7,
                            }}
                            numberOfTicks={10}
                            formatLabel={(value) => `USD ${helpers.formatFloat(value)}`}
                        />
                    

                        <Box style={{ padding:20, height: 300, width:'80%', backgroundColor:'#ffffff' }}>
                            <LineChart
                                style={{ flex: 1 }}
                                data={data}
                                gridMin={0}
                                svg={{ stroke: 'rgb(134, 65, 244)', strokeWidth: 2 }}
                                contentInset={{ top: 20, bottom: 20 }}
                            >
                                <Grid />
                            </LineChart>
                            <XAxis
                                style={{ marginHorizontal: -10 }}
                                data={data}
                                formatLabel={(value, index) => timeData[index]}
                                contentInset={{ left: 10, right: 10 }}
                                svg={{ fontSize: 7, fill: 'black' }}
                            />
                        </Box>
                    </Box>

                    {data.length < CHART_CALLS &&
                        <Text style={{marginTop:20, textAlign:'right', paddingRight:5}} fontSize={'xs'}>
                            {global.i18n.t('next-refresh')}: {nextRefresh} {String(global.i18n.t('seconds')).toLowerCase()}
                        </Text>
                    }

                </Box>
            } />
    );
};