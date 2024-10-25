export default class AdminManageTripsActions {
    static SET_ADMIN_MANAGE_TRIPS_DATA = (payload) => {
        return {
            type: 'SET_ADMIN_MANAGE_TRIPS_DATA',
            payload: {
                data: payload
            }
        };
    }
}
