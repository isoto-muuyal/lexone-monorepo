export const loggedin = (user_data) => {
    return {
        type : 'LOGGED',
        payload : user_data
    };
}
export const user_live_location = (location) => {
    return {
        type : 'LOCATION',
        payload : location
    };
}
export const tasker_live_location = (location) => {
    return {
        type : 'TRACKER',
        payload : location
    };
}