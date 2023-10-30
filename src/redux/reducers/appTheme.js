import {getColorCodeWithOpactiyNumber} from '../../utils/helperFunctions';

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
};

export default function (state = initial_state, action) {
  switch (action.type) {
    default: {
      return {...state};
    }
  }
}
