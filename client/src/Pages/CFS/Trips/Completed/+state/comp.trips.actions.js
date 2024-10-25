export default class CompletedTripsActions {
    static SET_COMPLETED_TRIPS_DATA = (payload) => {
        return {
            type: 'SET_COMPLETED_TRIPS_DATA',
            payload: {
                data: payload
            }
        };
    }
}
