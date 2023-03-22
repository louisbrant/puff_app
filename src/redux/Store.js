import thunk from "redux-thunk"
import { createStore, applyMiddleware } from "redux"
import { persistStore } from 'redux-persist'
import rootReducer from "./reducers"
import persistedReducer from './persistRedurcers'

const store = createStore(persistedReducer(rootReducer), applyMiddleware(thunk))
const persistor = persistStore(store)
export { store, persistor }