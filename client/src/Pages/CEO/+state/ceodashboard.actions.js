export default class CEODashboardActions {
    static SET_CEO_CHART_DATA = (payload) => {
        return {
            type: 'SET_CEO_CHART_DATA',
            payload
        };
    }
}
