const INITIAL_STATE = {
    menu: 'cfs',
    isOpen: true,
    anchorEl: null,
    isMenuHidden: false
};


export const layoutReducer = (state = INITIAL_STATE, action) => {
    const newState = Object.assign({}, state);
    const {type, payload} = {...action};
    switch (type) {
        case 'TOGGLE_MENU':
            newState.isOpen = !state.isOpen;
            break;
        case 'TOGGLE_PROFILE_POP':
            newState.anchorEl = payload;
            break;
        case 'REMOVE_MENU':
            newState.anchorEl = payload;
            newState.isOpen = false;
            newState.isMenuHidden = true;
            break;
        case 'REMOVE_PROFILE':
            newState.anchorEl = payload;
            newState.isProfileHidden = true;
            break;
        default:
            break;
    }
    return newState;
};
