export default class LayoutActions {
    static TOGGLE_MENU = () => {
        return {
            type: 'TOGGLE_MENU'
        };
    };

    static TOGGLE_PROFILE_POP = (element) => {
        return {
            type: 'TOGGLE_PROFILE_POP',
            payload: element
        };
    };

    static REMOVE_MENU = () => {
        return {
            type: 'REMOVE_MENU'
        };
    };
    static REMOVE_PROFILE = () => {
        return {
            type: 'REMOVE_PROFILE'
        };
    }
}
