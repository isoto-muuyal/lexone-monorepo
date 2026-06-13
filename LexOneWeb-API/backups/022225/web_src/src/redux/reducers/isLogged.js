const isLoggedReducer = (state = {}, action) => {
    switch(action.type) {
        case 'LOGGED' :
            return state = action.payload;
        case 'LOGGED_OUT' : 
            return state = {};
        default:
            return state;
    }
}

export default isLoggedReducer;