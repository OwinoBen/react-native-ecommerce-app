import {
  createDrawerNavigator
} from '@react-navigation/drawer';
import React from 'react';
import { Image } from 'react-native';
import { useSelector } from 'react-redux';
import CustomDrawerContent from '../Components/CustomDrawerContent';
import imagePath from '../constants/imagePath';
import strings from '../constants/lang';
import staticStrings from '../constants/staticStrings';
import BrandStack from './BrandStack';
import CartStack from './CartStack';
import CelebrityStack from './CelebrityStack';
import navigationStrings from './navigationStrings';
import TabRoutes from './TabRoutes';
import TabRoutesEcommerce from './TabRoutesEcommerce';
import TabRoutesP2p from './TabRoutesP2p';
import TaxiTabRoutes from './TaxiTabRoutes';
import { WebLinks } from '../Screens';

const Drawer = createDrawerNavigator();
export default function DrawerRoutes(props) {

  const appMainData = useSelector((state) => state?.home?.appMainData);
  const {appStyle, appData } = useSelector((state) => state?.initBoot);  const businessType = appStyle?.homePageLayout;

  const allCategory = appMainData?.categories;
  const checkForCeleb = appData?.profile?.preferences?.celebrity_check;

  const checkForBrand =
    allCategory &&
    allCategory.find((x) => x?.redirect_to == staticStrings.BRAND);

  var celebTab = null;
  var brandTab = null;
  var gestureEnabled = true;
  var swipeEnabled = true;
  if (checkForCeleb) {
    celebTab = (
      <Drawer.Screen
        component={CelebrityStack}
        name={navigationStrings.CELEBRITY}
        options={{
          gestureEnabled: gestureEnabled,
          swipeEnabled: swipeEnabled,
          drawerLabel: strings.CELEBRITY,
          drawerIcon: ({ focused }) => (
            <Image
              source={focused ? imagePath.tabDActive : imagePath.tabDInActive}
            />
          ),
        }}
      />
    );
  }

  if (checkForBrand) {
    brandTab = (
      <Drawer.Screen
        component={BrandStack}
        name={navigationStrings.BRANDS}
        options={{
          gestureEnabled: gestureEnabled,
          swipeEnabled: swipeEnabled,
          drawerLabel: strings.BRANDS,
          drawerIcon: ({ focused }) => (
            <Image
              source={focused ? imagePath.tabCActive : imagePath.tabCInActive}
            />
          ),
        }}
      />
    );
  }


  return (
    <Drawer.Navigator
      drawerPosition={'left'}
      backBehavior={'none'}
      drawerType={'front'}
      overlayColor={'rgba(0,0,0,0.6)'}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{ headerShown: false }}
      initialRouteName={businessType === 4
        ? navigationStrings.TAXITABROUTES
        : navigationStrings.TAB_ROUTES}
    >

      <Drawer.Screen
        component={businessType === 4
          ? TaxiTabRoutes : businessType === 8
            ? TabRoutesP2p : businessType === 10
              ? TabRoutesEcommerce : TabRoutes
        }
        name={
          businessType === 4
            ? navigationStrings.TAXITABROUTES
            : navigationStrings.TAB_ROUTES
        }

      />
      <Drawer.Screen
        component={CartStack}
        name={navigationStrings.CART}
      />


      <Drawer.Screen
        name={navigationStrings.WEBLINKS}
        component={WebLinks}
        options={{ headerShown: false}}
        
      />
         {/* <Drawer.Screen
        name={navigationStrings.CATEGORY}
        component={Category}
        options={{ headerShown: false}}
        
      /> */}
      {brandTab}
      {celebTab}

    </Drawer.Navigator>
  );
}

