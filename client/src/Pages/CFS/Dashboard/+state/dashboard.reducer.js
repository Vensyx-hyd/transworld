const INITIAL_STATE = {
    drivers: {
        chartData: []
    },
    trailers: {
        chartData: []
    }
};


export const dashboardReducer = (state = INITIAL_STATE, action) => {
    const newState = Object.assign({}, state);
    const {type, payload} = {...action};
    switch (type) {
        case 'SET_CHART_DATA':
            newState[payload.key].chartData = payload.data;
            break;
        default:
            break;
    }
    return newState;
};