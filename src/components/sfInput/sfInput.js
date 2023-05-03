import React, { useState, useEffect, useContext } from 'react';
import { Input, Icon, Pressable, Box, Text } from 'native-base';
import { APP_BASE, ERROR_COLOR } from '../../resources/constants';

import { Ionicons } from '@expo/vector-icons';

import GlobalContext from '../globalContext/globalContext';

export default function SFInput(props) {
    const global = useContext(GlobalContext);
    const [text, onChangeText] = useState(null);
    const [showValue, setShowValue] = useState(false);
    const [error, setError] = useState(false);
    const [errorList, setErrorList] = useState([]);
    
    let vReturn = [];
    let vIcon = [];

    //Sets errors
    useEffect(() => {
        //Skips the onload validation
        if (props.triggerValidation > 0) {
            //No error by default
            let vErrorList = [];
            let vError = false;
            setError(vError);
            setErrorList([]);

            //Required
            if (props.isRequired) { 
                if ((String(text).trim() == "" || text == null)) {
                    vError = true;
                    setError(vError);
                    vErrorList.push(
                        <Text key={"err1"} fontSize={'xs'} style={{color:ERROR_COLOR}}>
                            {"* "} {global.i18n.t('field-required')}
                        </Text>
                    );
                }
            }

            //Formats
            if (props.validate) {
                //Email
                if (String(props.validate).trim().toLowerCase() == 'email') {
                    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,3}$/g;
                    if (String(text).trim().match(emailRegex) == null) {
                        vError = true;
                        setError(vError);
                        vErrorList.push(
                            <Text key={"err2"} fontSize={'xs'} style={{color:ERROR_COLOR}}>
                                {"* "} {global.i18n.t('format-error-email')}
                            </Text>
                        );
                    }
                }
            }

            //If errors, then show them
            if (vErrorList.length > 0) {
                setErrorList(vErrorList);
            }

            //Rise error on parent
            props.onError(vError);
        }
    }, [props.triggerValidation]);

    //Changes text on parent
    useEffect(() => {
        if (text != null) {
            props.onChangeText(text);
        }
    }, [text]);

    //Sets initial value
    useEffect(() => {
        if (props.value != null) {
            onChangeText(props.value);
        }
    }, [props.value]);

    //Main icon
    if (props.icon && String(props.icon).trim() != "") {
        vIcon.push(
            <Icon 
                key={"icon1"}
                as={Ionicons} 
                name={props.icon} 
                size={7} 
                color={APP_BASE} />
        );
    }

    //Password
    if (props.type && String(props.type).trim() == "password") {
        vReturn.push(
            <Box key={"text1"}>
                <Input
                    type={showValue ? "text" : "password"}
                    style={[
                        {
                            width:'100%', 
                            height:50, 
                            marginLeft:10,
                        }, 
                        props.style
                    ]}
                    variant="underlined" 
                    size={'xl'}
                    placeholder={props.placeholder}
                    InputRightElement={
                        <Pressable onPress={() => setShowValue(!showValue)}>
                            <Icon 
                                as={Ionicons} 
                                name={showValue ? "eye" : "eye-off"} 
                                size={7} 
                                color={APP_BASE} />
                        </Pressable>
                    }
                    InputLeftElement={vIcon}
                    maxLength={props.maxLength}
                    autoCapitalize={'none'}
                    autoComplete={props.autoComplete}
                    value={text}
                    onChangeText={(text) => onChangeText(text)}
                />
                {error && <Box>{errorList}</Box>}
            </Box>
        );
    }

    //Text
    if (props.type && String(props.type).trim() == "text") {
        vReturn.push(
            <Box key={"text1"}>
                <Input
                    type={"text"}
                    style={[{width:'100%', height:50, marginLeft:10}, props.style]}
                    variant="underlined" 
                    size={'xl'}
                    placeholder={props.placeholder}
                    InputLeftElement={vIcon}
                    maxLength={props.maxLength}
                    value={text}
                    autoCapitalize={props.autoCapitalize}
                    autoComplete={props.autoComplete}
                    keyboardType={props.keyboardType}
                    onChangeText={(text) => onChangeText(text)}
                />
                {error && <Box>{errorList}</Box>}
            </Box>
        );
    }
                
    return vReturn;
}