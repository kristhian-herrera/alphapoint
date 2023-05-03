import React, { useContext, useState, useEffect } from 'react';
import { StackActions } from '@react-navigation/native';
import { Text, Box, Image, useToast } from 'native-base';

import GlobalContext from '../../components/globalContext/globalContext';
import ScreenContainer from '../../components/screenContainer/screenContainer';
import SFInput from '../../components/sfInput/sfInput';
import SFButton from '../../components/sfButton/sfButton';

import helpers from '../../resources/helpers';

export default function Login({ navigation }) {
    const global = useContext(GlobalContext);
    const toast = useToast();
    const [user, setUser] = useState('');
    const [triggerValidation, setTriggerValidation] = useState(0);
    const [validated, setValidated] = useState(0);
    const [formError, setFormError] = useState(false);

    const doLogin = async () => {
        try {
            let vRedirect = 'MainTabs';
            let vDetail = '';

            //Set loading
            helpers.showLoading(global, global.i18n.t('do-login'));

            //Do login
            global.setIsLoggedIn(true);
            global.setUser(String(user).trim());

            //User name
            vDetail = global.i18n.t('loggedin-as') 
            + ' ' 
            + helpers.capitalize(String(user).trim());

            //Hide loading and redirect
            navigation.replace(vRedirect);
            helpers.hideLoading(global);

            //Welcome user
            helpers.showMessage(
                toast, 
                "success", 
                global.i18n.t('welcome'), 
                vDetail
            );
        } catch (error) {
            //Show error
            toast.closeAll();
            helpers.hideLoading(global);
            helpers.showMessage(toast, "error", global.i18n.t('error'), error.message);
        }
    }

    //Triggers all validations
    const validateForm = () => {
        //Reset form error to no error
        setFormError(false);

        //Triggers all validations
        setTriggerValidation(triggerValidation + 1);
    }

    //On error
    const onError = (err) => {
        //If error on field, then form has error
        if (err == true) {
            setFormError(true);
        }

        //Triggers actions after validations
        setValidated(validated + 1);
    }

    //When validation has triggered
    useEffect(() => {
        //if form has been validated
        if (validated > 0) {
            if (formError == true) {
                //Shows generic form error
                helpers.showMessage(toast, "warning", global.i18n.t('warning'), global.i18n.t('please-check-error'));
            } else {
                doLogin();
            }
        }
    }, [validated]);

    //On load
    useEffect(() => {
        //reset list
        global.setCryptoList(null);
        global.setSelectedCrypto(null);
    }, []);

    return (
        <ScreenContainer
            title={global.i18n.t('login')}
            navigation={navigation}
            content={
                <Box w={'85%'} alignSelf="center">
                    <Image
                        source={require("../../../assets/login.png")}
                        resizeMethod={'scale'}
                        resizeMode={'contain'}
                        style={{ maxHeight: 300, marginTop: 10, alignSelf: 'center' }}
                        alt={global.i18n.t('login')} />

                    <Box style={{ marginTop: 10, marginBottom: 20 }}>
                        {global.currentLanguage == 'es' &&
                            <Text fontSize={'sm'} textAlign={'center'}>
                                Ingresa tus credenciales de Alpha Point
                            </Text>
                        }
                        {global.currentLanguage == 'en' &&
                            <Text fontSize={'sm'} textAlign={'center'}>
                                Type your Alpha Point credentials
                            </Text>
                        }
                    </Box>

                    <Box>
                        <SFInput
                            type="text"
                            icon="person"
                            placeholder={global.i18n.t('user')}
                            value={user}
                            onChangeText={(val) => setUser(val)}
                            onError={onError}
                            triggerValidation={triggerValidation}
                            autoComplete={'username'}
                            autoCapitalize={'none'}
                            maxLength={100}
                            isRequired />
                    </Box>

                    <Box style={{ marginTop: 20 }}>
                        <SFButton
                            variant="subtle"
                            endIcon={"log-in"}
                            iconSize={30}
                            iconStyle={{ marginTop: 3 }}
                            onPress={validateForm}
                            text={global.i18n.t('login')}
                            textSize={18} />
                    </Box>
                </Box>
            } />
    );
};