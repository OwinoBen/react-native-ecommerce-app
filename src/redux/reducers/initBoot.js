import {getColorCodeWithOpactiyNumber} from '../../utils/helperFunctions';
import types from '../types';
import _ from 'lodash';

const initial_state = {
  themeColors: {
    themeMain: '#41A2E6',
    themeOpacity20: getColorCodeWithOpactiyNumber('41A2E6', 20),
    headingColor: '#000000',
    textGrey: '#1E2428',
    textGreyLight: '#8F92A1',
    bottomBarGradientA: 'rgba(50,181,252,1)',
    bottomBarGradientB: 'rgba(97,160,242,1)',
    backgroundGrey: '#F4F7FA',
    currencyRed: '#F44746',
  },
  themeLayouts: {},
  appData: {},
  currencies: {},
  languages: {},
  primary_country: {},
  allAddresss: [],
  shortCodeStatus: null,
  appStyle: {
    fontSizeData: {
      regular: 'CircularStd-Book',
      medium: 'CircularStd-Medium',
      bold: 'CircularStd-Bold',
    },
    tabBarLayout: 1,
    homePageLayout: 1,
  },
  themeColor: false,
  themeToggle: false,
  searchText: [],
  redirectedFrom: '',
  deeplinkUrl:''
  //internetConnection: false,
};

export default function (state = initial_state, action) {
  switch (action.type) {
    case types.APP_INIT: {
      const data = action.payload;
      return {
        ...state,
        appData: data?.appData,
        themeColors: {
          ...state.themeColors,
          ...data?.themeColors,
        },
        appStyle: {
          ...state.appStyle,
          ...data?.appStyle,
        },
        // currencies: {
        //   ...state.currencies,
        //   ...data.currencies
        // },
        // languages: {
        //   ...state.languages,
        //   ...data.languages
        // }
      };
    }

    case types.SET_CURRENCY: {
      let currenciesData = action.payload;
      return {
        ...state,
        currencies: {
          ...state.currencies,
          ...currenciesData,
        },
      };
    }

    case types.SET_COUNTRY: {
      let countryData = action.payload;
      return {
        ...state,
        primary_country: countryData,
      };
    }

    case types.SET_LANGUAGE: {
      let languagesData = action.payload;
      return {
        ...state,
        languages: {
          ...state.languages,
          ...languagesData,
        },
      };
    }

    case types.UPDATE_CURRENCY: {
      let currenciesData = {};
      currenciesData['primary_currency'] = action.payload;
      return {
        ...state,
        currencies: {
          ...state.currencies,
          ...currenciesData,
        },
      };
    }

  

    case types.UPDATE_LANGAUGE: {
      let languagesData = {};
      languagesData['primary_language'] = action.payload;
      return {
        ...state,
        languages: {
          ...state.languages,
          ...languagesData,
        },
      };
    }
    //save All addresses
    case types.SAVE_ALL_ADDRESS: {
      let allAddresss = {};
      allAddresss = action.payload;
      return {
        ...state,
        allAddresss: allAddresss,
      };
    }

    //Save short code status
    case types.SAVE_SHORT_CODE: {
      return {
        ...state,
        shortCodeStatus: action.payload,
      };
    }

    case types.NO_INTERNET: {
      const internetConnection = action.payload;
      return {...state, internetConnection};
    }
    case types.THEME: {
      const data = action.payload;

      return {
        ...state,
        themeColor: data,
      };
    }
    case types.THEME_TOGGLE: {
      const data = action.payload;
      return {
        ...state,
        themeToggle: data,
      };
    }
    case types.ADD_SEARCH_TEXT: {
      if (action.payload == 'clear') {
        return {...state, searchText: []};
      }

      let searchRes = state.searchText;

      if (state.searchText.length == 10) {
        //store values only 15
        searchRes.shift(); //remove first exist item from array
      }
      let res = [...searchRes, action.payload]; //merge previous value into exist array

      return {...state, searchText: res};
    }

    case types.ALL_RECENT_SEARCH: {
      return {
        ...state,
        searchText: action.payload,
      };
    }
    case types.DELETE_SEARCH_TEXT: {
      return {
        ...state,
        searchText: [],
      };
    }
    case types.DIRECT_SET_SEARCH_TEXT: {
      return {searchText: action.payload};
    }

    case types.REDIRECTED_FROM: {
      return {...state, redirectedFrom: action.payload};
    }
    case types.DEEPLINK_URL: {
      return {...state, deeplinkUrl: action.payload};
    }

    default: {
      return {...state};
    }
  }
}
