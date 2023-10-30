import types from '../types';

const initialState = {
    reloadData: false,
};

export default function (state = initialState, action) {
    switch (action.type) {
        case types.RELOAD_DATA: {
            const data = action.payload
            return { ...state, reloadData: data };
        }
        default:
            return state;
    }
}
