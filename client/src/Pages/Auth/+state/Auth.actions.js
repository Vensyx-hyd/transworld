export default class AuthActions {
    static SET_USER = (payload) => {
        return {
            type: 'SET_USER',
            payload
        };
    };

    static LOGOUT_USER = (payload) => {
        return {
            type: 'LOGOUT_USER'
        };
    }
}
