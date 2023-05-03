import React, { useState, useEffect, useContext } from 'react';
import { View, TouchableOpacity, Modal, TextInput, ScrollView, Platform } from 'react-native';
import { Icon, Text, useColorMode } from 'native-base';

import { APP_BLACK, APP_GRAY, APP_BASE } from '../../resources/constants';

import GlobalContext from '../globalContext/globalContext';
import withPreventDoubleClick from '../withPreventDoubleClick/withPreventDoubleClick';

import { Ionicons } from "@expo/vector-icons";

import styles from '../../resources/styles';


export default function SFPicker(props) {
    const global = useContext(GlobalContext);
    const TouchableOpacityEx = withPreventDoubleClick(TouchableOpacity);

    const [pickerSearchText, setPickerSearchText] = useState('');
    const [pickerModalVisible, setPickerModalVisible] = useState(false);
    const [pickerItems, setPickerItems] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const { colorMode } = useColorMode();

    const vBackStyle = Platform.OS == 'ios' 
                        ? {fontSize:17, marginTop:-48, color:APP_BLACK, textAlign:'right'}
                        : {fontSize:17, textAlign:'right', color:APP_GRAY};

    const mainContainerColor = colorMode == 'light' ? { backgroundColor: '#FFFFFF' } : { backgroundColor: '#0f172a' };
    const modalMarginTop = global.orientation == 1 ? { marginTop:120 } : { marginTop:70 };

    //Close modal
    const closeModal = () => {
        setPickerModalVisible(false);
    }

    //Set picker items
    useEffect(() => {
        setPickerItems(props.items);
    }, [props.items]);

    //Set selected value
    useEffect(() => {
        if (pickerItems && pickerItems.length > 0) {
            setDefaultValue(props.selectedValue);
        }
    }, [pickerItems, props.selectedValue]);

    //Reset search text
    useEffect(() => {
        setPickerSearchText('');
    }, [pickerModalVisible]);

    //Set default object
    const setDefaultValue = (val) => {
        let vFound = false;

        for (let i in pickerItems) {
            if (String(pickerItems[i].value) == String(val)) {
                vFound = true;
                setSelectedItem(pickerItems[i]);
                break;
            }
        }

        if (!vFound) {
            setSelectedItem(null);
        }
    }

    //Build list
    const buildItemList = () => {
        let vReturn = [];

        //Null value
        if (props.prependNullValue) {
            vReturn.push(
                <TouchableOpacityEx 
                    key={-1}
                    style={{padding:10, borderBottomWidth:1, borderColor:'#e0e0e0'}} 
                    onPress={() => selectItem(null)}>
                        <Text style={{fontSize:13}}>- {String(props.placeholder).trim().toUpperCase()} -</Text>
                </TouchableOpacityEx>
            );
        }

        //Values
        for (let i in pickerItems) {
            if (String(pickerSearchText).trim() == '' 
                || String(pickerItems[i].label).trim().toLowerCase().includes(String(pickerSearchText).trim().toLowerCase())) {
                    let vSelectedIcon = [];
                    if (selectedItem 
                        && String(selectedItem.value).trim().toLowerCase() == String(pickerItems[i].value).trim().toLowerCase()) {
                            vSelectedIcon.push(
                                <Icon 
                                    as={Ionicons} 
                                    key={"isel" + i} 
                                    name="checkmark-circle" 
                                    style={[{color: colorMode == 'light' ? APP_BLACK : APP_BASE}]} 
                                    size={7} />
                            );
                    }
                    vReturn.push(
                        <TouchableOpacityEx 
                            key={i}
                            style={{padding:10, paddingTop:16, paddingBottom:16, borderBottomWidth:1, borderColor:'#e0e0e0'}} 
                            onPress={() => selectItem(pickerItems[i])}>
                                <View style={{flexDirection:'row'}}>
                                    <Text style={{fontSize:14, width:'90%'}}>{pickerItems[i].label}</Text>
                                    {vSelectedIcon}
                                </View>
                        </TouchableOpacityEx>
                    );
            }
        }

        return vReturn;
    }

    //Search
    const doSearch = (text) => {
        setPickerSearchText(text);
    }

    //Select item
    const selectItem = (item) => {
        if (item) {
            setSelectedItem(item);
            props.onValueChange(item.value);
        } else {
            setSelectedItem(null);
            props.onValueChange(null);
        }
        
        closeModal();
    }

    return (
        <View>
            <Modal
                animationType="slide"
                hardwareAccelerated={true}
                transparent={true}
                supportedOrientations={['portrait', 'landscape']}
                visible={pickerModalVisible}>
                <View style={[styles.modalView, props.modalStyle, mainContainerColor, modalMarginTop]}>
                    <TouchableOpacityEx onPress={() => closeModal()}>
                        <Text style={[vBackStyle]}>{global.i18n.t('back')}</Text>
                    </TouchableOpacityEx>
                    <TextInput
                        placeholder={global.i18n.t('search') + '...'}
                        placeholderTextColor="#b1b1b1"
                        style={[{
                            width:'100%', 
                            padding:10,
                            paddingLeft:0,
                            borderTopWidth:0, 
                            borderLeftWidth:0, 
                            borderRightWidth:0, 
                            borderBottomColor:'#d4d4d8', 
                            borderBottomWidth:1,
                            color: colorMode == 'dark' ? '#fafafa' : '#333333'
                        }]}
                        onChangeText={(text) => doSearch(text)} />
                    <ScrollView style={{paddingTop:15}}>
                        <View style={{paddingBottom:150}}> 
                            {buildItemList()}
                        </View>
                    </ScrollView>
                </View>
                
            </Modal>

            <TouchableOpacityEx style={[{borderRadius:5, borderWidth:1, borderColor:'#e0e0e0'}, props.style]} onPress={()=>{ setPickerModalVisible(true); }}>
                <View style={[{padding:15, flex:1, flexDirection:'row'}]}>
                    <View style={{width:'90%'}}>
                        {selectedItem && 
                            <Text style={{fontSize:16}}>{selectedItem.label}</Text>
                        }
                        {!selectedItem && 
                            <Text style={{fontSize:16}}>- {props.placeholder} -</Text>
                        }
                    </View>
                    <View style={{width:'10%', alignItems:'flex-end'}}>
                        <Icon as={Ionicons} name="caret-down" size={5}/>
                    </View>
                </View>
            </TouchableOpacityEx>
        </View>
    );

}