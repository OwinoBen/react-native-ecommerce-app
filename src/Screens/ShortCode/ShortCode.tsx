import React, {FC, useCallback, useEffect, useRef, useState} from 'react';
import {Image, View} from 'react-native';
import {getBundleId} from 'react-native-device-info';
import {useDarkMode} from 'react-native-dynamic';
import {MaterialIndicator} from 'react-native-indicators';
import Video from 'react-native-video';
import {useSelector} from 'react-redux';
import imagePath from '../../constants/imagePath';
import actions from '../../redux/actions';
import colors from '../../styles/colors';
import {moderateScale} from '../../styles/responsiveSize';
import {MyDarkTheme} from '../../styles/theme';
import {appIds} from '../../utils/constants/DynamicAppKeys';
import {getCurrentLocation, showError} from '../../utils/helperFunctions';
import {getItem} from '../../utils/utils';
import {getAppCode} from './getAppCode';
import {IRootState} from './interfaces';
import styles from './styles';
import {chekLocationPermission} from '../../utils/permissions';

interface locationInterface {
  latitude: number;
  longitude: number;
  address: string;
}

const ShortCode: FC = () => {
  const {deepLinkUrl, auth, themeColor, themeToggle} = useSelector(
    (state: IRootState) => state?.initBoot || {},
  );
  const theme = themeColor;
  const toggleTheme = themeToggle;
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  let apiRes: any = useRef(null); // we using useRef to get latest values immediately

  const [loadingScreen, setLoadingScreen] = useState(true);

  useEffect(() => {
    chekLocationPermission(true)
      .then(result => {
        if (result !== 'goback' && result == 'granted') {
          getCurrentLocation('home')
            .then(curLoc => {
              initApiHit(curLoc);
              return;
            })
            .catch(err => {
              initApiHit(null);
              return;
            });
        }
      })
      .catch(error => {
        initApiHit(null);
      });
  }, []);

  const initApiHit = async (locData: locationInterface | null) => {
    const lang = await getItem('setPrimaryLanguage');
    const prevCode = await getItem('saveShortCode');
    // const appCode = !!prevCode ? prevCode : getAppCode();
    const appCode = '3f7cc9';

    let header = {};

    if (!!lang?.primary_language?.id) {
      header = {
        code: appCode,
        language: lang?.primary_language?.id,
      };
    } else {
      header = {
        code: appCode,
      };
    }

    actions
      .initApp(locData, header, false, null, null, true)
      .then(res => {
        console.log('header response--->', res);
        actions.saveShortCode(appCode);
        apiRes = res; // save response in reference to get the latest value immediately
        if (
          getBundleId() == appIds.masa ||
          getBundleId() == appIds.muvpod ||
          getBundleId() == appIds.hezniTaxi ||
          getBundleId() == appIds.parcelworks ||
          getBundleId() == appIds.stabex
        ) {
          setLoadingScreen(false);
        } else {
          setLoadingScreen(false);
          navigateToNextScreen(res);
        }
      })
      .catch(error => {
        console.log(error, 'error>>>>>error');
        setTimeout(() => {
          showError(error?.message || error?.error);
        }, 500);
      });
  };
  const navigateToNextScreen = useCallback(
    (res: any) => {
      getItem('firstTime').then(el => {
        if (!el && !!res?.data && res?.data?.dynamic_tutorial.length > 0) {
          actions.setAppSessionData('app_intro');
        } else {
          
            actions.setAppSessionData('on_login');
          
        }
      });
    },
    [auth, deepLinkUrl],
  );
  const _renderSplash = useCallback(() => {
    switch (getBundleId()) {
      case appIds.masa:
        return animatedSplash();
      case appIds.muvpod:
        return animatedSplash();
      case appIds.hezniTaxi:
        return animatedSplash();
      case appIds.parcelworks:
        return animatedSplash();
      case appIds.stabex:
        return animatedSplash();
      default:
        return imageSplash();
    }
  }, []);
  const animationVideo = useCallback(() => {
    switch (getBundleId()) {
      case appIds?.masa:
        return imagePath.masa;
      case appIds?.muvpod:
        return imagePath.muvpod;
      case appIds?.hezniTaxi:
        return imagePath.HezniSplash;
      case appIds?.parcelworks:
        return imagePath.parcelWorksSplash;
      case appIds?.stabex:
        return imagePath.Stabex;
    }
  }, []);
  const imageSplash = useCallback(() => {
    return (
      <View style={{flex: 1}}>
        <View style={styles.splashStyle}>
          <View style={{position: 'absolute', bottom: moderateScale(100)}}>
            {loadingScreen && (
              <MaterialIndicator size={50} color={colors.greyMedium} />
            )}
          </View>
        </View>
        <Image source={{uri: 'Splash'}} style={{flex: 1, zIndex: -1}} />
      </View>
    );
  }, [loadingScreen]);

  const animatedSplash = () => {
    return (
      <View style={styles.videoView}>
        <Video
          source={animationVideo()}
          style={styles.videoStyle}
          resizeMode={getBundleId() == appIds.muvpod ? 'contain' : 'cover'}
          onEnd={onVideoDurationEnded}
          muted={true}
        />
      </View>
    );
  };
  const onVideoDurationEnded = useCallback(() => {
    checkNavigationState(true);
  }, []);
  const checkNavigationState = (videoEnd: boolean) => {
    if (videoEnd) {
      navigateToNextScreen(apiRes);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: isDarkMode
          ? MyDarkTheme.colors.background
          : colors.white,
      }}>
      {_renderSplash()}
    </View>
  );
};

export default ShortCode;
