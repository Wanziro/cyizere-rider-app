import {View, Text, Pressable} from 'react-native';
import React, {useEffect, useState} from 'react';
import {APP_COLORS} from '../../../constants/colors';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../../reducers';
import {IUserReducer} from '../../../reducers/user';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Icon2 from 'react-native-vector-icons/Octicons';
import Icon4 from 'react-native-vector-icons/Entypo';
import {viewFlexCenter, viewFlexSpace} from '../../../constants/styles';
import {INavigationProp, TOAST_MESSAGE_TYPES} from '../../../../interfaces';
import FullPageLoader from '../../../components/full-page-loader';
import DocumentPicker from 'react-native-document-picker';
import {
  fetchUserStatusSilent,
  setUserIdNumberDocument,
} from '../../../actions/user';
import {toastMessage} from '../../../helpers';
import {app} from '../../../constants/app';
import UpdateIDNo from './update-id-no';

const VerificationDetails = ({navigation}: INavigationProp) => {
  const dispatch = useDispatch();
  const {isVerified, verificationMessage, verificationStatus, token} =
    useSelector((state: RootState) => state.user) as IUserReducer;
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    dispatch(fetchUserStatusSilent());
  }, []);

  const handleDocumentSelect = async () => {
    try {
      const results = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.images, DocumentPicker.types.pdf],
        allowMultiSelection: false,
      });
      const doc = {
        uri: results?.uri,
        type: results?.type,
        name: results?.name,
      };
      const formData = new FormData();
      formData.append('file', doc);
      setIsLoading(true);
      const url = app.BACKEND_URL + '/suppliers/doc/';
      var xhr = new XMLHttpRequest();
      xhr.open('PUT', url);
      xhr.onload = function () {
        setIsLoading(false);
        try {
          const response = JSON.parse(xhr.response);
          if (xhr.status === 200) {
            const {idNumberDocument} = response;
            dispatch(setUserIdNumberDocument(idNumberDocument));
            toastMessage(TOAST_MESSAGE_TYPES.SUCCESS, response.msg);
          } else {
            toastMessage(TOAST_MESSAGE_TYPES.ERROR, response.msg);
          }
        } catch (error) {
          toastMessage(TOAST_MESSAGE_TYPES.ERROR, xhr.response);
        }
      };
      xhr.setRequestHeader('token', token);
      xhr.send(formData);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }
  };

  return (
    <View style={{flex: 1, backgroundColor: APP_COLORS.WHITE}}>
      <View style={[viewFlexCenter, {padding: 15}]}>
        {isVerified ? (
          <>
            <Icon name="verified" size={100} color={APP_COLORS.ORANGE} />
            <Text
              style={{marginTop: 10, fontSize: 16, color: APP_COLORS.ORANGE}}>
              Account Verified
            </Text>
          </>
        ) : (
          <>
            <Icon2 name="unverified" size={100} color={APP_COLORS.BLACK} />
            <Text
              style={{marginTop: 10, fontSize: 16, color: APP_COLORS.BLACK}}>
              Account Not Verified
            </Text>
          </>
        )}
      </View>
      <View style={{marginTop: 20}}>
        <View
          style={[
            viewFlexSpace,
            {
              padding: 10,
              borderBottomColor: APP_COLORS.BORDER_COLOR,
              borderBottomWidth: 1,
            },
          ]}>
          <Text style={{color: APP_COLORS.BLACK, fontWeight: 'bold'}}>
            Verification Status:
          </Text>
          <Text>{verificationStatus}</Text>
        </View>
        <View
          style={{
            padding: 10,
            borderBottomColor: APP_COLORS.BORDER_COLOR,
            borderBottomWidth: 1,
          }}>
          <Text style={{color: APP_COLORS.BLACK, fontWeight: 'bold'}}>
            Verification Review Comment:
          </Text>
          <Text style={{color: APP_COLORS.TEXT_GRAY}}>
            {verificationMessage?.trim() === ''
              ? 'No comment added yet.'
              : verificationMessage}
          </Text>
        </View>
        <Pressable onPress={() => navigation.navigate('DocumentPreview')}>
          <View
            style={[
              viewFlexSpace,
              {
                padding: 10,
                borderBottomColor: APP_COLORS.BORDER_COLOR,
                borderBottomWidth: 1,
              },
            ]}>
            <Text style={{color: APP_COLORS.TEXT_GRAY}}>
              View Submitted Document
            </Text>
            <Icon4
              name="chevron-right"
              size={25}
              color={APP_COLORS.TEXT_GRAY}
            />
          </View>
        </Pressable>
        {!isVerified && (
          <>
            <Pressable onPress={() => handleDocumentSelect()}>
              <View
                style={[
                  viewFlexSpace,
                  {
                    padding: 10,
                    borderBottomColor: APP_COLORS.BORDER_COLOR,
                    borderBottomWidth: 1,
                  },
                ]}>
                <Text style={{color: APP_COLORS.TEXT_GRAY}}>
                  Update Submitted Document (ID/Passport)
                </Text>
                <Icon4
                  name="chevron-right"
                  size={25}
                  color={APP_COLORS.TEXT_GRAY}
                />
              </View>
            </Pressable>
            <Pressable onPress={() => setShowModal(true)}>
              <View
                style={[
                  viewFlexSpace,
                  {
                    padding: 10,
                    borderBottomColor: APP_COLORS.BORDER_COLOR,
                    borderBottomWidth: 1,
                  },
                ]}>
                <Text style={{color: APP_COLORS.TEXT_GRAY}}>
                  Update Submitted ID/Passport Number
                </Text>
                <Icon4
                  name="chevron-right"
                  size={25}
                  color={APP_COLORS.TEXT_GRAY}
                />
              </View>
            </Pressable>
          </>
        )}
      </View>
      <UpdateIDNo showModal={showModal} setShowModal={setShowModal} />
      <FullPageLoader isLoading={isLoading} />
    </View>
  );
};

export default VerificationDetails;
