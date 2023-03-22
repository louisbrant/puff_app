var initdata = {
    friendUsers: [],
    pendingUsers: [],
    usersList: [],
}
const friendsReducer = (state = initdata, action) => {
    switch (action.type) {
        case "FRIEND_DATA": {
            return { ...state, friendUsers: action.payload }
        }
        case "FRIEND_PENDING_DATA": {
            return { ...state, pendingUsers: action.payload }
        }
        case "FRIEND_USERLIST_DATA": {
            return { ...state, usersList: action.payload }
        }
        default: {
            return state
        }
    }
}
export default friendsReducer
