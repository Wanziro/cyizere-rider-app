import {View, Text, ScrollView, Pressable, Linking} from 'react-native';
import React from 'react';
import {APP_COLORS} from '../../../constants/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {viewFlexSpace} from '../../../constants/styles';
import Icon2 from 'react-native-vector-icons/FontAwesome';

const HelpAndSupport = () => {
  const handleCall = () => {
    Linking.openURL(`tel:0791593322`);
  };
  const openLink = async (url: string) => {
    if (await Linking.canOpenURL(url)) {
      await Linking.openURL(url);
    } else {
      console.log(`Unable to open URL: ${url}`);
      //@ts-ignore
      alert(`Unable to open URL: ${url}`);
      //@ts-ignore
    }
  };
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: APP_COLORS.BACKGROUND_COLOR,
        paddingVertical: 20,
      }}>
      <ScrollView showsHorizontalScrollIndicator={false}>
        <View
          style={[
            viewFlexSpace,
            {
              borderBottomColor: APP_COLORS.BORDER_COLOR,
              borderBottomWidth: 1,
              padding: 10,
            },
          ]}>
          <Icon name="email" size={20} color={APP_COLORS.BLACK} />
          <Text style={{flex: 1, marginLeft: 10, color: APP_COLORS.BLACK}}>
            info@cyizere.rw
          </Text>
        </View>
        <Pressable onPress={handleCall}>
          <View
            style={[
              viewFlexSpace,
              {
                borderBottomColor: APP_COLORS.BORDER_COLOR,
                borderBottomWidth: 1,
                padding: 10,
              },
            ]}>
            <Icon name="phone" size={20} color={APP_COLORS.BLACK} />
            <Text style={{flex: 1, marginLeft: 10, color: APP_COLORS.BLACK}}>
              0791593322
            </Text>
          </View>
        </Pressable>
        <Pressable onPress={() => openLink('https://cyizere.rw/contact.html')}>
          <View
            style={[
              viewFlexSpace,
              {
                borderBottomColor: APP_COLORS.BORDER_COLOR,
                borderBottomWidth: 1,
                padding: 10,
              },
            ]}>
            <Icon name="message" size={20} color={APP_COLORS.BLACK} />
            <Text style={{flex: 1, marginLeft: 10, color: APP_COLORS.BLACK}}>
              Contact Us
            </Text>
            <Icon2 name="angle-right" size={20} color={APP_COLORS.BLACK} />
          </View>
        </Pressable>
        <Pressable onPress={() => openLink('https://cyizere.rw/privacy.html')}>
          <View
            style={[
              viewFlexSpace,
              {
                borderBottomColor: APP_COLORS.BORDER_COLOR,
                borderBottomWidth: 1,
                padding: 10,
              },
            ]}>
            <Icon
              name="application-cog-outline"
              size={20}
              color={APP_COLORS.BLACK}
            />
            <Text style={{flex: 1, marginLeft: 10, color: APP_COLORS.BLACK}}>
              Privacy Policy
            </Text>
            <Icon2 name="angle-right" size={20} color={APP_COLORS.BLACK} />
          </View>
        </Pressable>
        <Pressable onPress={() => openLink('https://cyizere.rw/faq.html')}>
          <View
            style={[
              viewFlexSpace,
              {
                borderBottomColor: APP_COLORS.BORDER_COLOR,
                borderBottomWidth: 1,
                padding: 10,
              },
            ]}>
            <Icon
              name="approximately-equal-box"
              size={20}
              color={APP_COLORS.BLACK}
            />
            <Text style={{flex: 1, marginLeft: 10, color: APP_COLORS.BLACK}}>
              FAQ
            </Text>
            <Icon2 name="angle-right" size={20} color={APP_COLORS.BLACK} />
          </View>
        </Pressable>
      </ScrollView>
    </View>
  );
};

export default HelpAndSupport;
