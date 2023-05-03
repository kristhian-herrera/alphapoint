import { StackActions } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { 
    DEFAULT_THEME, 
    DEFAULT_LANG
} from '../resources/constants';

import { 
    Alert, 
    VStack, 
    HStack, 
    IconButton, 
    CloseIcon, 
    Text 
} from 'native-base';

/* LOCAL VARIABLES */
const ToastAlert = ({
    id,
    status,
    variant,
    title,
    description,
    isClosable,
    toast,
    ...rest
}) => <Alert maxWidth="90%" alignSelf="center" flexDirection="row" status={status ? status : "info"} variant={variant} {...rest}>
        <VStack space={1} flexShrink={1} w="100%">
            <HStack flexShrink={1} alignItems="center" justifyContent="space-between">
                <HStack space={2} flexShrink={1} alignItems="center">
                    <Alert.Icon />
                    <Text fontSize="md" fontWeight="medium" flexShrink={1} color={variant === "solid" ? "lightText" : variant !== "outline" ? "darkText" : null}>
                        {title}
                    </Text>
                </HStack>
                <IconButton variant="unstyled" icon={<CloseIcon size="3" />} _icon={{
                    color: variant === "solid" ? "lightText" : "darkText"
                }} onPress={() => toast.close(id)} />
            </HStack>
            {description && String(description).trim() != '' &&
                <Text px="6" color={variant === "solid" ? "lightText" : variant !== "outline" ? "darkText" : null}>
                    {description}
                </Text>
            }
        </VStack>
    </Alert>;

/* STRING FUNCTIONS */
const capitalize = (str) => {
    let vReturn = '';
    let strArray = String(str).trim().split(' ');

    strArray.forEach((el) => {
        vReturn += el.charAt(0).toUpperCase() + el.slice(1).toLowerCase() + ' ';
    });
    vReturn = vReturn.trim();

    return vReturn;
}

const getUserInicials = (user) => {
    if (user !=  null) {
        return (
                String(user.first_name).substring(0,1) 
                + String(user.last_name).substring(0,1)
            ).toUpperCase();
    } else {
        return '';
    }
}

/* SET/GET FROM LOCAL STORAGE */
const clearLocalStorage = async () => {
    await AsyncStorage.clear();
}

const setUserTheme = (value) => {
    AsyncStorage.setItem('@app-theme', value);
}

const getUserTheme = async () => {
    try {
        const vValue = await AsyncStorage.getItem('@app-theme');
        if (vValue != null) {
            return vValue;
        }
    } catch (e) { }

    return DEFAULT_THEME;
}

const setUserLang = (value) => {
    AsyncStorage.setItem('@app-lang', value);
}

const getUserLang = async () => {
    try {
        const vValue = await AsyncStorage.getItem('@app-lang');
        if (vValue != null) {
            return vValue;
        }
    } catch (e) { }

    return DEFAULT_LANG;
}

/* INFORM USER */
const showMessage = (toast, type, title, description) => {
    let vTitle = [];
    let vDescription = description;

    //If description, then split and put the code in the title
    if (vDescription 
        && vDescription != null 
        && String(vDescription).trim() != '') {
            const vDescriptionArray = vDescription.split('||');
            if (vDescriptionArray.length > 1) {
                vDescription = vDescriptionArray[0].trim();
                vTitle.push(
                    <Text key={'errT1'}>
                        {title} 
                        <Text fontSize={9}>  ({vDescriptionArray[1].trim()})</Text>
                    </Text>
                );
            }
    }

    //If no title, then push the title parameter
    if (vTitle.length == 0) {
        vTitle.push(title);
    }
    
    //Show the error
    toast.show({
        render: ({ id }) => {
            return (
                <ToastAlert
                    id={id}
                    toast={toast}
                    variant={"left-accent"} //solid, left-accent, top-accent, outline, subtle, outline-light
                    status={type} //success, error, info, warning
                    title={vTitle}
                    description={vDescription} />
            )
        }
    });
}

const showLoading = (global, message) => {
    global.setBusyText(message);
    global.setIsBusy(true);
}

const hideLoading = (global) => {
    global.setIsBusy(false);
}

/* ERROR MANAGEMENT */
const errorMessage = (error) => {
    let vError = '';

    if (error
        && error.response
        && error.response.data
        && error.response.data.message) {
            vError = error.response.data.message;
    } else {
        if (error.message) {
            vError = String(error.message);
        } else {
            vError = String(error);
        }
    }

    return vError;
}

const validateNotAuthorized = (error) => {
    if (error 
        && error.response
        && error.response.status
        && error.response.status == '401') {
            return true;
    }

    return false;
}

const validateStatus200 = (response) => {
    if (response 
        && response.status 
        && response.status == 200) {
            return true;
    }

    return false;
}

const serviceError = (global, error, navigation, toast) => {
    let vErrorTitle = global.i18n.t('error');
    let vErrorMessage = error.message;

    if (error.message == global.i18n.t('session-expired')) {
        //Redirect
        const popAction = StackActions.pop(1);
        navigation.dispatch(popAction);
        navigation.navigate('Login');
        vErrorTitle = error.message;
        vErrorMessage = null;
    }

    //Hide loading
    toast.closeAll();
    hideLoading(global);

    //Inform user
    showMessage(toast, "error", vErrorTitle, vErrorMessage);
}

const securedEndpointError = async (global, error, errorCode, loginServices) => {
    //Not authorized error
    if (validateNotAuthorized(error)) {
        //Do logout
        await loginServices.logout(global);

        //Log
        //console.log(errorMessage(global, error));
        
        //Return session expired error
        return new Error(global.i18n.t('session-expired'));
    }

    //Return error
    return new Error(errorMessage(error) + '||' + errorCode);
} 

/* GENERAL */
const sortAscArrayByKey = (array, key) => {
    return array.sort(function(a, b) {
        var x = a[key]; 
        var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}

const formatTime = (val) => {
    let vDate = new Date(val);
    
    let vReturn = (vDate.getHours() < 10 ? '0' : '') + vDate.getHours().toString()
        + ':'
        + ((vDate.getMinutes()) < 10 ? '0' : '') + (vDate.getMinutes()).toString();
  
    return vReturn;
}

const formatFloat = (num) => {
    var vNum = (Math.round(num * 100) / 100).toFixed(2);
    var parts = vNum.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  }

const helpers = {
    /* STRING FUNCTIONS */
    capitalize: function (str) {
        return capitalize(str);
    },
    getUserInicials: function(user) {
        return getUserInicials(user);
    },

    /* SET/GET FROM LOCAL STORAGE */
    clearLocalStorage: async function() {
        return await clearLocalStorage();
    },
    setUserTheme: function (value) {
        return setUserTheme(value);
    },
    getUserTheme: async function () {
        return await getUserTheme();
    },
    setUserLang: function (value) {
        return setUserLang(value);
    },
    getUserLang: async function () {
        return await getUserLang();
    },

    /* INFORM USER */
    showMessage: function (toast, status, title, description) {
        return showMessage(toast, status, title, description);
    },
    showLoading: function(global, message) {
        return showLoading(global, message);
    },
    hideLoading: function(global) {
        return hideLoading(global);
    },
    
    /* ERROR MANAGEMENT */
    errorMessage: function(error) {
        return errorMessage(error);
    },
    validateNotAuthorized: function(error) {
        return validateNotAuthorized(error);
    },
    validateStatus200: function(response) {
        return validateStatus200(response);
    },
    serviceError: function(global, error, navigation, toast) {
        return serviceError(global, error, navigation, toast);
    },
    securedEndpointError: async function(global, error, errorCode, loginServices) {
        return await securedEndpointError(global, error, errorCode, loginServices);
    },

    /* GENERAL */
    sortAscArrayByKey: function(array, key) {
        return sortAscArrayByKey(array, key);
    },
    formatTime: function(val) {
        return formatTime(val);
    },
    formatFloat: function(num) {
        return formatFloat(num);
    }
};

export default helpers;