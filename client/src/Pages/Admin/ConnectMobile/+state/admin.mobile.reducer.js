const INITIAL_STATE = {
    tags: []
};


export const AdminMobileReducer = (state = INITIAL_STATE, action) => {
    const newState = Object.assign({}, state);
    const {type, payload} = {...action};
    switch (type) {
        case 'SET_ADMIN_MOBILE_DATA':
            newState.tags = payload.data;
            break;
        default:
            break;
    }
    return newState;
};
