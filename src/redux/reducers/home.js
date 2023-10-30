import produce from 'immer';
import { getColorCodeWithOpactiyNumber } from '../../utils/helperFunctions';
import types from '../types';

const initial_state = {
  appMainData: {},
  location: {
    address: '',
    latitude: '',
    longitude: '',
  },
  profileAddress: {
    addAddress: '',
    updatedAddress: '',
  },
  dineInType: 'p2p',
  constCurrLoc: {
    address: '',
    latitude: '',
    longitude: '',
  },
  pickUpTimeType: 'now',
  isLocationSearched: false,
  lastBidInfo: null,
  countryFlag: 'IN'
};

export default function (state = initial_state, action) {
  switch (action.type) {
    case types.HOME_DATA: {
      const data = action.payload;
      let oldAppMainData = { ...data };
      oldAppMainData?.homePageLabels?.map((item, index) => {
        if (item?.slug == 'nav_categories') {
          oldAppMainData['categories'] = item?.data || [];
        }
        if (item?.slug == 'featured_products') {
          oldAppMainData['featured_products'] = item?.data || [];
        }
        if (item?.slug == 'brands') {
          oldAppMainData['brands'] = item?.data || [];
        }
        if (item?.slug == 'on_sale') {
          oldAppMainData['on_sale_products'] = item?.data || [];
        }
        if (item?.slug == 'vendors') {
          oldAppMainData['vendors'] = item?.data || [];
        }
        if (item?.slug == 'long_term_service') {
          oldAppMainData['long_term_service'] = item?.data || [];
        }
        if (item?.slug == 'new_products') {
          oldAppMainData['new_products'] = item?.data || [];
        }
      });

      return {
        ...state,
        appMainData: data,
      };
    }

    case types.LOCATION_DATA: {
      const data = action.payload;
      return {
        ...state,
        location: data,
      };
    }
    case types.CONST_CUR_LOC: {
      const data = action.payload;
      return {
        ...state,
        constCurrLoc: data,
      };
    }

    case types.COUNTRY_FLAG: {
      const data = action.payload;
      return {
        ...state,
        countryFlag: data,
      };
    }

    case types.PROFILE_ADDRESS: {
      const data = action.payload;
      return {
        ...state,
        profileAddress: data,
      };
    }
    case types.DINE_IN_DATA: {
      const data = action.payload;
      return {
        ...state,
        dineInType: !!data ? data : 'delivery',
      };
    }

    case types.SAVE_SCHEDULE_TIME: {
      const data = action.payload;
      return {
        ...state,
        pickUpTimeType: data,
      };
    }

    case types.IS_LOCATION_SEARCHED: {
      const data = action.payload;
      return {
        ...state,
        isLocationSearched: data,
      };
    }
    case types.LAST_BID_INFO: {
      const data = action.payload;
      return {
        ...state,
        lastBidInfo: data,
      };
    }

    default: {
      return { ...state };
    }
  }
}
