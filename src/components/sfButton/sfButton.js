import React from 'react';
import { Button, Icon, Text } from 'native-base';
import { APP_BASE, APP_BLACK } from '../../resources/constants';

import { Ionicons } from '@expo/vector-icons';

export default function SFButton(props) {
    let vStartIcon = [];
    let vEndIcon = [];
    let vBackgroundColor = props.backgroundColor ? props.backgroundColor : APP_BASE;

    if (props.startIcon && String(props.startIcon).trim() != "") {
        vStartIcon.push(
            <Icon 
                key={"icon1"}
                as={Ionicons} 
                name={props.startIcon} 
                size={props.iconSize} 
                style={props.iconStyle}
                color={APP_BLACK} />
        );
    }

    if (props.endIcon && String(props.endIcon).trim() != "") {
        vEndIcon.push(
            <Icon 
                key={"icon2"}
                as={Ionicons} 
                name={props.endIcon} 
                size={props.iconSize} 
                style={props.iconStyle}
                color={APP_BLACK} />
        );
    }

    return (
        <Button
            variant={props.variant}
            backgroundColor={vBackgroundColor}
            leftIcon={vStartIcon}
            endIcon={vEndIcon}
            style={props.style}
            onPress={() => props.onPress()}>
                <Text color={APP_BLACK} fontSize={props.textSize} style={props.textStyle}>
                    {props.text}
                </Text>
        </Button>
    );
}