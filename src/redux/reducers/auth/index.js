var initdata = {
    user: null,
    isLogin: false,
    position: {
        latitude: 0,
        longitude: 0,
    }
}
const authReducer = (state = initdata, action) => {
    switch (action.type) {
        case "LOGIN": {
            return { ...state, user: action.payload, isLogin: true }
        }
        case "UPDATE_PROFILE": {
            return { ...state, user: action.payload }
        }
        case "SET_POSITION": {
            return { ...state, position: action.payload }
        }
        case "LOGOUT": {
            return { ...state, isLogin: false }
        }
        default: {
            return state
        }
    }
}
export default authReducer
