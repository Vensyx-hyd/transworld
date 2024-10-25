const INITIAL_STATE = {
    drivers: {
        chartData: []
    },
    trailers: {
        chartData: []
    },
    trailerPerformance: {
        chartData: []
    },
    driverTrips: {
        chartData: []
    },
    trips: {
        chartData: []

    }
};


export const ceoDashboardReducer = (state = INITIAL_STATE, action) => {
    const newState = Object.assign({}, state);
    const {type, payload} = {...action};
    switch (type) {
        case 'SET_CEO_CHART_DATA':
            newState[payload.key].chartData = payload.data;
            break;
        default:
            break;
    }
    return newState;
};


