import React, { useState, useContext } from 'react';

import {
  Box,
  Popover,
  Icon,
  IconButton,
  Text,
  Button
} from 'native-base';

import GlobalContext from '../globalContext/globalContext';
import SFButton from '../sfButton/sfButton';

import { APP_BLACK, APP_GRAY } from '../../resources/constants';
import { Ionicons } from "@expo/vector-icons";

import helpers from '../../resources/helpers';

export default function UserMenu(props) {
  const global = useContext(GlobalContext);
  const [show, setShow] = useState(false);

  const login = () => {
    props.navigation.navigate('Login');
    setShow(!show);
  }

  const logout = async () => {
    try {
      //Set loading
      helpers.showLoading(global, global.i18n.t('do-logout'));

      //Close menu
      setShow(!show);

      //Do logout
      global.setIsLoggedIn(false);
      global.setUser(null);

      //Go home
      helpers.hideLoading(global);
      props.navigation.replace('Login');
    } catch(error) {
      //Show error
      helpers.hideLoading(global);
      helpers.showMessage(toast, "error", global.i18n.t('error'), error.message);
    }
  }

  return (
    <Box h="100%" w="100%" alignItems="flex-end" paddingRight={3}>
      <Popover
        isOpen={show}
        onClose={setShow}
        trigger={triggerProps => {
          let vReturn = [];

          if (global.isLoggedIn == false) {
            vReturn.push(
              <IconButton
                key={"usrIcon1"}
                {...triggerProps}
                onPress={() => setShow(!show)}
                variant={'unstyled'}
                style={{marginTop:-2}}
                icon={<Icon as={Ionicons} name="person-circle" size={42} color={APP_BLACK} />}>
              </IconButton>
            );
          } else {
            vReturn.push(
              <Button 
                key={"usrIcon1"} 
                {...triggerProps}
                variant={'unstyled'}
                style={{
                  borderColor:APP_BLACK, 
                  borderWidth:4, 
                  borderRadius:100,
                  marginTop:8,
                  marginRight:10
                }}
                size={42}
                onPress={() => setShow(!show)}>
                  <Text 
                    fontSize={'md'} 
                    style={{color:APP_BLACK, fontWeight:'bold'}}>
                      {global.user && String(global.user).substring(0,1).toUpperCase()}
                  </Text>
              </Button>
            );
          }
          
          return vReturn;
        }}>
        <Popover.Content accessibilityLabel="UserMenu" w="80">
          <Popover.Arrow />
          <Popover.CloseButton />
          <Popover.Header>
            {global.user && String(global.user).toUpperCase()}
          </Popover.Header>
          
          <Popover.Footer justifyContent="flex-end">

            {global.isLoggedIn &&
              <SFButton
                variant="subtle"
                backgroundColor={APP_GRAY}
                onPress={logout}
                startIcon={"log-out"}
                text={global.i18n.t('logout')}
                iconSize={23}
                iconStyle={{ marginTop: 2, color: '#FAFAFA' }}
                textSize={18}
                textStyle={{ color: '#FAFAFA' }} />
            }

            {!global.isLoggedIn &&
              <SFButton
                variant="subtle"
                onPress={login}
                startIcon={"log-in"}
                text={global.i18n.t('login')}
                iconSize={23}
                iconStyle={{ marginTop: 2 }}
                textSize={18} />
            }

          </Popover.Footer>
        </Popover.Content>
      </Popover>
    </Box>
  );
}