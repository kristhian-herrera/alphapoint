import React, { useContext, useEffect, useState } from 'react';
import { Text, Box } from 'native-base';
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

    const [crypto, setCrypto] = useState(null);
    const [data, setData] = useState([]);
    const [timeData, setTimeData] = useState([]);
    const [nextRefresh, setNextRefresh] = useState(CHART_TIMEOUT / 1000);
    let chartTimer = 0;
    let resetTimer = 0;

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
            vData.push(response[0].price_usd * Math.random());
            setData(vData);

            //Set time data
            let vTimeData = timeData;
            vTimeData.push(helpers.formatTime(new Date()));
            setTimeData(vTimeData);

            //Clear interval
            if (data.length > CHART_CALLS) {
                clearInterval(chartTimer);
            }

            //Hide loading
            helpers.hideLoading(global);
        } catch (error) {
            //Redirect, hide loading and show error
            helpers.serviceError(global, error, navigation, toast);
        }
    }

    //Reset timer
    const resetCallTimer = () => {
        //Reset next refresh
        setNextRefresh(CHART_TIMEOUT / 1000);

        //Clear
        clearInterval(resetTimer);

        //Reset timer
        /*
        resetTimer = setInterval(() => {
            setNextRefresh(nextRefresh - 1);
        }, 1000);
        */
    }

    //On crypto change
    useEffect(() => {
        if (global.selectedCrypto != null) {
            //First call
            doGetCryptoDetail();
            resetCallTimer();

            //Set interval
            chartTimer = setInterval(() => {
                //Do call
                doGetCryptoDetail();
                resetCallTimer();
            }, CHART_TIMEOUT);
        }
    }, [global.selectedCrypto]);

    return (
        <ScreenContainer
            userMenu
            backButton
            title={crypto != null ? crypto.name + ' (' + crypto.symbol + ')' : ''}
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

                    <Text style={{marginTop:20}}>
                        {global.i18n.t('next-refresh')}: {nextRefresh} {global.i18n.t('seconds')}
                    </Text>
                
                </Box>
            } />
    );
};