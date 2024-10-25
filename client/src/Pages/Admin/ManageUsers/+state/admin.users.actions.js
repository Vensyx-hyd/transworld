export default class AdminUsersActions {
    static SET_ADMIN_USERS = (payload) => {
        return {
            type: 'SET_ADMIN_USERS',
            payload
        };
    }
}
