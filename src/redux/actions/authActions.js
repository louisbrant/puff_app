import Moment from 'moment'
import { setToken } from "../services"
import { firebase, Storage, Firestore } from '../../constants'
import { parseInt } from 'lodash'

export const GetDate = () => {
  let date = new Date()
  let createdAt = Moment(date).format('DD-MM-YYYY hh:mm:ss')
  let coredate = date.getTime()
  let unixdate = new Date('2001/01/01').getTime()
  let createdAtSeconds = Math.floor((coredate - unixdate) / 1000).toString()
  return { createdAt, createdAtSeconds }
}

export const GetDate1 = (date) => {
  let coredate = parseInt(date)
  let unixdate = new Date('2001/01/01').getTime()
  let createdAtSeconds = new Date(coredate * 1000 + unixdate)
  return createdAtSeconds
}

export const upload = async (uri, path) => {
  const response = await fetch(uri)
  const blob = await response.blob()
  const ref = Storage.child('profile_images').child(path).child(`${path}.jpg`)
  await ref.put(blob)
  return await ref.getDownloadURL()
}

export const updateProfile = () => async (dispatch, getState) => {
  const uid = getState().auth.user.uid
  const usersRef = Firestore.collection('users')
  usersRef
    .doc(uid)
    .get()
    .then(firestoreDocument => {
      const user = firestoreDocument.data()
      user.uid = uid
      dispatch({ type: "UPDATE_PROFILE", payload: user })
    })
    .catch(error => {
      console.log('UPDATE_PROFILE', error)
    })
}

export const logOut = () => async (dispatch) => {
  setToken('')
  firebase.auth().signOut()
  return dispatch({ type: "LOGOUT" })
}

export const setPosition = (position) => async (dispatch) => {
  dispatch({ type: "SET_POSITION", payload: position })
}