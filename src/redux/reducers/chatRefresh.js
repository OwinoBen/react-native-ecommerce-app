import types from '../types';

const initialState = {
    isChatRefresh: false,
};

export default function (state = initialState, action) {
    switch (action.type) {
        case types.CHAT_REFRESH: {
            const data = action.payload
            return { ...state, isChatRefresh: data };
        }
        default:
            return state;
    }
}
