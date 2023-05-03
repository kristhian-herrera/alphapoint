import React from 'react';
import { ScrollView } from 'react-native-gesture-handler';

import {
    APP_BASE,
    APP_TITLE,
    APP_BLACK
} from '../../resources/constants';

import {
    Box,
    HStack,
    Image,
    IconButton,
    Icon,
    Text
} from 'native-base';

import { Ionicons } from "@expo/vector-icons";

import UserMenu from '../userMenu/userMenu';

export default function ScreenContainer(props) {
    const vBackButton = props.backButton ? true : false;
    const vUserMenu = props.userMenu ? true : false;

    return (
        <Box safeAreaTop style={{ backgroundColor: APP_BASE }}>
            
            {vBackButton &&
                <HStack space={3} style={{ width: '100%', height: 60, paddingLeft: '2%' }}>
                    <Box style={{ width: '19%', alignItems: 'flex-start' }}>
                        <IconButton
                            variant={'unstyled'}
                            icon={<Icon as={Ionicons} name="arrow-back-circle" size={39} color={APP_BLACK} style={{marginTop:5}} />}
                            onPress={() => props.navigation.goBack()}>
                        </IconButton>
                    </Box>
                    <Box style={{ width: '60%' }}>
                        <Text fontSize="xl" textAlign={'center'} style={{ marginTop:16, marginLeft:-23, color: APP_BLACK }}>
                            {props.title}
                        </Text>
                    </Box>
                    {vUserMenu &&
                        <Box style={{ width: '19%', alignItems: 'flex-end', marginTop: 5, paddingRight: '2%' }}>
                            <UserMenu navigation={props.navigation} />
                        </Box>
                    }
                </HStack>
            }
            {!vBackButton &&
                <HStack space={2} style={{ width: '100%', height: 60, paddingLeft: '2%' }}>
                    <Box style={{ width: '50%', alignItems: 'flex-start' }}>
                        <Image
                            source={require("../../../assets/ap-black.png")}
                            size={120}
                            style={{ marginTop: -30, marginLeft: 10 }}
                            resizeMode="contain"
                            alt={APP_TITLE} />
                    </Box>
                    {vUserMenu &&
                        <Box style={{ width: '50%', alignItems: 'flex-end', marginTop: 2, paddingRight: '2%' }}>
                            <UserMenu navigation={props.navigation} />
                        </Box>
                    }
                </HStack>
            }
            
            <Box
                _dark={{ bg: "blueGray.900" }}
                _light={{ bg: "blueGray.50" }}
                style={{ width: '100%', height: '100%' }}>
                <ScrollView style={{ width: '100%', height: '100%' }}>
                    <Box style={{ width: '100%', height: '100%', padding: 15, paddingBottom: 200 }}>
                        {props.content}
                    </Box>
                </ScrollView>
            </Box>
        </Box>
    );
}