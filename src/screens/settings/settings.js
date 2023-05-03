import React, { useContext } from 'react';

import {
    useColorMode,
    Text,
    HStack,
    Box,
    Image
} from 'native-base';

import GlobalContext from '../../components/globalContext/globalContext';
import ScreenContainer from '../../components/screenContainer/screenContainer';
import SFPicker from '../../components/sfPicker/sfPicker';
import SFSwitch from '../../components/sfSwitch/sfSwitch';

import helpers from '../../resources/helpers';
import styles from '../../resources/styles';

export default function Settings({ navigation }) {
    const global = useContext(GlobalContext);
    const { colorMode, toggleColorMode } = useColorMode();
    const vLanguages = [
        { label: global.i18n.t('english'), value: 'en' },
        { label: global.i18n.t('spanish'), value: 'es' }
    ];

    const setLang = (val) => {
        global.setCurrentLanguage(val);
        helpers.setUserLang(val);
    }

    const setTheme = () => {
        toggleColorMode();
        helpers.setUserTheme(colorMode === "dark" ? "light" : "dark");
    }

    return (
        <ScreenContainer
            userMenu
            title={global.i18n.t('settings')}
            navigation={navigation}
            content={
                <>
                    <Box w={'85%'} alignSelf="center">
                        <Image
                            source={require("../../../assets/settings.png")}
                            resizeMethod={'scale'}
                            resizeMode={'contain'}
                            style={{ maxHeight: 300, marginTop: 10, alignSelf:'center' }}
                            alt={global.i18n.t('settings')} />

                        <Box style={{ marginTop: 10, marginBottom: 20 }}>
                            {global.currentLanguage == 'es' &&
                                <Text fontSize={'sm'} textAlign={'center'}>
                                    Personaliza tu experiencia en Alpha Point
                                </Text>
                            }
                            {global.currentLanguage == 'en' &&
                                <Text fontSize={'sm'} textAlign={'center'}>
                                    Customize your experience on Alpha Point
                                </Text>
                            }
                        </Box>

                        <HStack space={2} style={styles.listContainer}>
                            <Text style={{ width: '50%' }} fontSize={'md'}>
                                {global.i18n.t('dark-mode')}
                            </Text>
                            <Box style={{ width: '50%' }}>
                                <SFSwitch
                                    style={{ alignSelf: 'flex-end' }}
                                    isChecked={colorMode === "dark"}
                                    onToggle={setTheme} />
                            </Box>
                        </HStack>
                        <HStack space={2} style={styles.listContainer}>
                            <Text style={{ width: '50%' }} fontSize={'md'}>
                                {global.i18n.t('language')}
                            </Text>
                            <Box style={{ width: '50%' }}>
                                <SFPicker
                                    placeholder="Seleccione un idioma"
                                    prependNullValue={false}
                                    items={vLanguages}
                                    selectedValue={global.currentLanguage}
                                    onValueChange={(e) => { setLang(e); }} />
                            </Box>
                        </HStack>
                    </Box>
                </>
            } />
    );
};