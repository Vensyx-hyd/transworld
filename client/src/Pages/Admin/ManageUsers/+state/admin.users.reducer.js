const INITIAL_STATE = {
    users:[]
};

export const AdminUsersReducer = (state = INITIAL_STATE, action) => {
    const newState = Object.assign({}, state);
    const {type, payload} = {...action};
    switch (type) {
        case 'SET_ADMIN_USERS':
            newState.users = payload.data;
            break;
        default:
            break;
    }
    return newState;
};