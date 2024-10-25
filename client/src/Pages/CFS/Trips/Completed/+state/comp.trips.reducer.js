const INITIAL_STATE = {
    trips: [],
    loading: false
};


export const CompletedTripsReducer = (state = INITIAL_STATE, action) => {
    const newState = Object.assign({}, state);
    const {type, payload} = {...action};
    switch (type) {
        case 'SET_COMPLETED_TRIPS_DATA':
            console.log(payload.data);
            newState.trips = payload.data;
            break;
        default:
            break;
    }
    return newState;
};
