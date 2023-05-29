import React, {useState} from 'react';
import {View, Text, Pressable} from 'react-native';
import {useDispatch} from 'react-redux';
import Icon from 'react-native-vector-icons/Entypo';
import {Menu, MenuItem, MenuDivider} from 'react-native-material-menu';
import {setShowClearAllNotificatonsConfirmation} from '../../../../actions/notifications';
import {APP_COLORS} from '../../../../constants/colors';

const NotificationsHeader = () => {
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);
  const hideMenu = () => setVisible(false);
  const showMenu = () => setVisible(true);
  return (
    <View style={{paddingRight: 10}}>
      <Menu
        visible={visible}
        anchor={
          <Text onPress={showMenu}>
            <Icon
              name="dots-three-vertical"
              size={25}
              color={APP_COLORS.WHITE}
            />
          </Text>
        }
        onRequestClose={hideMenu}>
        <MenuItem
          textStyle={{color: APP_COLORS.BLACK}}
          onPress={() => {
            dispatch(setShowClearAllNotificatonsConfirmation(true));
            hideMenu();
          }}>
          Clear all notifications
        </MenuItem>
      </Menu>
    </View>
  );
};

export default NotificationsHeader;
