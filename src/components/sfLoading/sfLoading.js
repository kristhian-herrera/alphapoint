import React, { useContext } from 'react';
import { Box, Text, Center, Image, Spinner } from 'native-base';
import { APP_BASE, APP_BLACK } from '../../resources/constants';

import GlobalContext from '../globalContext/globalContext';

export default function SFLoading() {
    const global = useContext(GlobalContext);
    const loadingMarginTop = global.orientation == 1 ? { marginTop:150 } : { marginTop:50 };
    let vContent = [];

    if (global.isBusy) {
        vContent.push(
            <Box key={'busy1'} style={{width:'100%', height:'100%', backgroundColor:APP_BASE}}>
                <Box style={{width:'90%', alignSelf:'center'}}>
                    <Center>
                        <Spinner 
                            size={'lg'}
                            style={loadingMarginTop}
                            color={APP_BLACK}
                            accessibilityLabel={global.busyText} />
                        <Text 
                            style={{marginTop:30, color:APP_BLACK}} 
                            fontSize={'sm'}>
                                {global.busyText}
                        </Text>
                        <Image
                            source={require('../../../assets/ap-black.png')}
                            resizeMethod={'scale'}
                            resizeMode={'contain'}
                            style={{height: 30, marginTop:75, alignSelf:'center'}}
                            alt={'Koopalo'} />
                    </Center>
                 </Box>
            </Box>
        );
    }

    return vContent;
}