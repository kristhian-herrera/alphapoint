import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Box, Icon, Text } from 'native-base';

import withPreventDoubleClick from '../withPreventDoubleClick/withPreventDoubleClick';

import { Ionicons } from '@expo/vector-icons';
import { APP_BASE } from '../../resources/constants';

import styles from '../../resources/styles';

export default function SFMenuItem(props) {
    const TouchableOpacityEx = withPreventDoubleClick(TouchableOpacity);

    return (
        <TouchableOpacityEx
            style={[styles.listContainer, { flex: 1, flexDirection: 'row' }]}
            onPress={props.onPress}>
            <Box style={{ width: '10%'}}>
                <Icon
                    as={Ionicons}
                    name={props.icon}
                    size={7}
                    color={APP_BASE} />
            </Box>
            <Text style={{ width: '70%', paddingLeft:5 }} fontSize={'md'}>
                {props.text}
            </Text>
            <Box style={{ width: '20%', alignItems: 'flex-end' }}>
                <Icon
                    as={Ionicons}
                    name={'arrow-forward-circle'}
                    size={8}
                    color={APP_BASE} />
            </Box>
        </TouchableOpacityEx>
    );
}