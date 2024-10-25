const INITIAL_STATE = {
    trips: []
};


export const AdminTripIntelligenceReducer = (state = INITIAL_STATE, action) => {
    const newState = Object.assign({}, state);
    const {type, payload} = {...action};
    switch (type) {
        case 'SET_ADMIN_IN_TRIPS':
            newState['trips'] = payload.data;
            break;
        default:
            break;
    }
    return newState;
};
