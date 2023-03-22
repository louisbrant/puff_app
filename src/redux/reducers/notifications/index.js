var initdata = {
    newNotifications: [],
    oldNotifications: [],
}
const notificationsReducer = (state = initdata, action) => {
    switch (action.type) {
        case "NOTIFICATION_NEW_DATA": {
            return { ...state, newNotifications: action.payload }
        }
        case "NOTIFICATION_OLD_DATA": {
            return { ...state, oldNotifications: action.payload }
        }
        default: {
            return state
        }
    }
}
export default notificationsReducer
