const INITIAL_STATE = {};


export const AdminDriverReducer = (state = INITIAL_STATE, action) => {
    const newState = Object.assign({}, state);
    const {type} = {...action};
    switch (type) {
        default:
            break;
    }
    return newState;
};
