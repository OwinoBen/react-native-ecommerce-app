import types from '../types';

const initial_state = {
    addressSearch: false,
};

export default function (state = initial_state, action) {
    switch (action.type) {
        case types.ADDRESS_SEARCH: {
            const data = action.payload;
            return {
                ...state,
                addressSearch: data,
            };
        }

        default: {
            return { ...state };
        }
    }
}
