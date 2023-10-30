import {useFocusEffect} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import Geocoder from 'react-native-geocoding';
import {useSelector} from 'react-redux';
import GooglePlaceInput from '../../../Components/GooglePlaceInput';
import Header from '../../../Components/Header';
import WrapperContainer from '../../../Components/WrapperContainer';
import imagePath from '../../../constants/imagePath';
import strings from '../../../constants/lang/index';
import navigationStrings from '../../../navigation/navigationStrings';
import colors from '../../../styles/colors';
import commonStylesFun from '../../../styles/commonStyles';
import {
  moderateScale,
  moderateScaleVertical,
} from '../../../styles/responsiveSize';
import stylesFun from './styles';

export default function PickupLocation({navigation, route}) {
  const paramData = route?.params;

  const {appData, themeColors, appStyle} = useSelector(
    (state) => state?.initBoot,
  );

  const fontFamily = appStyle?.fontSizeData;
  const [state, setState] = useState({
    pickUpLocation: '',
    dropOffLocation: '',
    pickUpLocationFocus: true,
    dropOffLocationFocus: false,
    dot: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    suggestions: [],
    // suggestions: [
    //   {
    //     name: 'Sam’s place',
    //     address: '2972 Westheimer Rd. Santa Ana, Illinois 88...',
    //   },
    //   {
    //     name: 'Mike’s',
    //     address: '2118 Thornridge Cir. Syracuse, Connecticut ...',
    //   },
    //   {name: 'Inglewood', address: '8502 Preston Rd. Inglewood, Maine 98380'},
    // ],
  });
  const {
    pickUpLocation,
    dropOffLocation,
    pickUpLocationFocus,
    dropOffLocationFocus,
    dot,
    suggestions,
  } = state;

  useEffect(() => {
    Geocoder.init(profile?.preferences?.map_key, {language: 'en'}); // set the language
  }, []);

  const updateState = (data) => setState((state) => ({...state, ...data}));
  const styles = stylesFun({fontFamily, themeColors});
  const commonStyles = commonStylesFun({fontFamily});
  const {profile} = appData;
  const _onChangeText = (key) => (val) => {
    updateState({[key]: val});
  };

  const _onFocus = (type) => {
    updateState({[type]: true});
    // navigation.navigate(navigationStrings.LOCATION, {
    //   type: 'Pickup',
    //   addressType: type,
    // });
  };

  useFocusEffect(
    React.useCallback(() => {
      if (paramData?.details && paramData?.details?.formatted_address) {

        const address = paramData?.details?.formatted_address;

        if (paramData?.addressType == 'pickup') {
          updateState({
            pickUpLocation: address,
            pickUpLocationFocus: false,
          });
        }
        if (paramData?.addressType == 'dropoff') {
          updateState({
            dropOffLocation: address,
            dropOffLocationFocus: false,
          });
        }
      }
    }, [paramData?.details, paramData?.addressType]),
  );
  /*************************** On Text Change
   */ const addressHelper = (results) => {
    let clonedArrayData = {...state};
    clonedArrayData = {...clonedArrayData, ...results, showDialogBox: false};
    updateState(clonedArrayData);
  };

  const handleAddressOnKeyUp = (text, type) => {
    // updateState({address: text});
    updateState({[type]: text});
  };

  const showListOutside = (results, type, dataSource) => {
    //
    //
    // setTimeout(() => {
    //   updateState({suggestions:dataSource})
    // }, 100);
  };

  const _renderBottomComponent = () => {
    return (
      <View
        style={{
          padding: moderateScale(10),
          marginHorizontal: moderateScale(10),
          height: moderateScaleVertical(50),
          flexDirection: 'row',
          alignItems: 'center',
          zIndex: -1000,
        }}>
        <View style={{flex: 0.09}}>
          <Image source={imagePath.locationCourier} />
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate(navigationStrings.SETLOACTIONMAP)}
          style={{flex: 0.75}}>
          <Text style={styles.addresssLableName}>
            {strings.SETLOCATIONONMAP}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const _rendorCustomRow = (itm) => {
    return (
      <View
        style={{
          padding: moderateScale(2),
          flexDirection: 'row',
          // alignItems: 'center',
          // backgroundColor: 'yellow',
        }}>
        <View style={{flex: 0.2, marginRight: 10}}>
          <Image source={imagePath.locationCourier} />
        </View>
        <View style={{flex: 0.7}}>
          <Text style={styles.address}>{itm.description}</Text>
        </View>
      </View>
    );
  };

  const updateTheAddress = (details, addressType) => {
    const address = details?.formatted_address;

    if (addressType == 'pickup') {
      updateState({
        pickUpLocation: address,
        pickUpLocationFocus: false,
      });
    }
    if (addressType == 'dropoff') {
      updateState({
        dropOffLocation: address,
        dropOffLocationFocus: false,
      });
    }
  };
  return (
    <WrapperContainer bgColor={colors.white} statusBarColor={colors.white}>
      <Header
        leftIcon={imagePath.backArrowCourier}
        centerTitle={strings.WHERETOPICKUP}
        // rightIcon={imagePath.cartShop}
        headerStyle={{
          backgroundColor: colors.white,
          marginVertical: moderateScaleVertical(10),
        }}
      />

      <View style={{flex: 1}}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <View
            style={{
              flex: 0.15,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <View style={{height: 60}}>
              <Image source={imagePath.radioLocation} />
              <View
                style={{height: 40, overflow: 'hidden', alignItems: 'center'}}>
                {dot.map((item, index) => {
                  return <View style={styles.dots}></View>;
                })}
              </View>
              <Image source={imagePath.radioLocation} />
            </View>
          </View>
          <View
            style={{
              flex: 0.7,
              zIndex: -1000,
              // backgroundColor: 'red',
              paddingVertical: 10,
            }}>
            <View style={{height: 48, alignItems: 'center'}}>
              <GooglePlaceInput
                autoFocus={pickUpLocationFocus}
                getDefaultValue={pickUpLocation}
                type={'Pickup'}
                navigation={navigation}
                addressType={'pickup'}
                placeholder={strings.PICKUPADDRESS}
                googleApiKey={profile?.preferences?.map_key}
                textInputContainer={styles.textGoogleInputContainerAddress}
                listView={
                  stylesFun({fontFamily, themeColors, type: 'pickup'}).listView
                }
                textInput={styles.textInput2}
                addressHelper={(results) => addressHelper(results)}
                handleAddressOnKeyUp={(text) =>
                  handleAddressOnKeyUp(text, 'pickUpLocation')
                }
                showList={true}
                showListOutside={(results, dataSource) =>
                  showListOutside(results, 'pickUpLocation', dataSource)
                }
                rowStyle={styles.address}
                renderCustomRow={(itm) => _rendorCustomRow(itm)}
                updateTheAddress={(details, addressType) =>
                  updateTheAddress(details, addressType)
                }
              />
            </View>
            <View style={{height: 5}}></View>
            <View style={{height: 48, alignItems: 'center'}}>
              <GooglePlaceInput
                autoFocus={dropOffLocationFocus}
                getDefaultValue={dropOffLocation}
                type={'Pickup'}
                navigation={navigation}
                addressType={'dropoff'}
                placeholder={strings.DROPOFFADDRESS}
                googleApiKey={profile?.preferences?.map_key}
                textInputContainer={styles.textGoogleInputContainerAddress}
                listView={styles.listView}
                textInput={styles.textInput2}
                addressHelper={(results) => addressHelper(results)}
                handleAddressOnKeyUp={(text) =>
                  handleAddressOnKeyUp(text, 'dropOffLocation')
                }
                showList={true}
                showListOutside={(results, dataSource) =>
                  showListOutside(results, 'dropOffLocation', dataSource)
                }
                rowStyle={styles.address}
                renderCustomRow={(itm) => _rendorCustomRow(itm)}
                updateTheAddress={(details, addressType) =>
                  updateTheAddress(details, addressType)
                }
              />
            </View>

            {/* <TextInputLocation
              containerStyle={{
                height: moderateScaleVertical(49),
                overflow: 'hidden',
              }}
              label={'Pick up'}
              onChangeText={_onChangeText('pickUpLocation')}
              placeholder={strings.PICKUPADDRESS}
              value={pickUpLocation}
              multiline={false}
              isFocus={pickUpLocationFocus}
              onFocus={() => _onFocus('pickup')}
              // numberOfLines={1}
              textInputStyle={{height: moderateScaleVertical(40)}}
              color={pickUpLocation != '' ? colors.blackC : colors.textGreyJ}
              //   onFocus={() => updateState({pickUpLocationFocus: true})}
              onBlur={() => updateState({pickUpLocationFocus: false})}
            /> */}

            {/* <TextInputLocation
              containerStyle={{
                height: moderateScaleVertical(49),
                overflow: 'hidden',
              }}
              label={'Drop-off'}
              onChangeText={_onChangeText('dropOffLocation')}
              placeholder={strings.DROPOFFADDRESS}
              value={dropOffLocation}
              multiline={false}
              color={dropOffLocation != '' ? colors.blackC : colors.textGreyJ}
              isFocus={dropOffLocationFocus}
              onFocus={() => _onFocus('dropoff')}
              // numberOfLines={1}
              textInputStyle={{height: moderateScaleVertical(40)}}
              //   onFocus={() => updateState({dropOffLocationFocus: true})}
              onBlur={() => updateState({dropOffLocationFocus: false})}
            /> */}
          </View>
          <View style={{flex: 0.1, paddingVertical: 10}}>
            <View style={{height: moderateScale(48)}} />
            <View style={{height: moderateScale(5)}} />
            <TouchableOpacity
              onPress={() =>
                navigation.navigate(navigationStrings.MULTISELECTCATEGORY)
              }
              style={{
                height: moderateScale(48),
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Image source={imagePath.plus} />
            </TouchableOpacity>
          </View>
        </View>
        {/* All the available suggestions */}
        <View style={styles.shadowStyle} />
        {/* <View style={styles.suggestions}>
          {suggestions.map((itm, index) => {
            return (
              <View
                style={{mi
                  padding: moderateScale(10),
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <View style={{flex: 0.15}}>
                  <Image source={imagePath.locationCourier} />
                </View>
                <View style={{flex: 0.85}}>
                  <Text style={styles.address}>{itm.description}</Text>
                </View>
              </View>
            );
          })}
        </View> */}
        {_renderBottomComponent()}
      </View>
    </WrapperContainer>
  );
}
