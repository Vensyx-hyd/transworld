export default class DashboardActions {
    static SET_CHART_DATA = (payload) => {
        return {
            type: 'SET_CHART_DATA',
            payload
        };
    }
}
