import { combineReducers } from "redux"
import authReducer from "./auth"
import friendsReducer from "./friends"
import notificationsReducer from "./notifications"

const rootReducer = combineReducers({
    auth: authReducer,
    friends: friendsReducer,
    notifications: notificationsReducer,
})

export default rootReducer