import React from 'react';
import { Switch } from 'native-base';
import { APP_BASE } from '../../resources/constants';

export default function SFSwitch(props) {
    return (
        <Switch
            key={"switch1"}
            style={props.style}
            isChecked={props.isChecked}
            onToggle={props.onToggle}
            onTrackColor={APP_BASE}
        />
    );
}