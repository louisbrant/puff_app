import { find, findOne } from './rootActions'
import { Firestore, FieldValue } from '../../constants'
import { updateProfile } from './authActions'

export const LoadNewNotifications = () => async (dispatch, getState) => {
  const { uid } = getState().auth.user
  Firestore.collection('notifications')
    .where('to', '==', uid)
    .where('see', '==', false)
    .get().then(e => find(e))
    .then(newNotifications => {
      dispatch({ type: 'NOTIFICATION_NEW_DATA', payload: newNotifications })
    })
    .catch(error => {
      console.log('LoadNewNotifications error:', error)
    })
}

export const LoadOldNotifications = () => async (dispatch, getState) => {
  const { uid } = getState().auth.user
  Firestore.collection('notifications')
    .where('to', '==', uid)
    .where('see', '==', true)
    .get().then(e => find(e))
    .then(oldNotifications => {
      dispatch({ type: 'NOTIFICATION_OLD_DATA', payload: oldNotifications })
    })
    .catch(error => {
      console.log('InviteFriend error:', error)
    })
}

export const notificationsRemove = (id1, id2) => async () => {
  Firestore.collection('notifications')
    .where('from', '==', id1)
    .where('to', '==', id2)
    .get().then(e => findOne(e))
    .then(data => {
      if (data.id)
        Firestore.collection('notifications').doc(data.id).delete()
    })
    .catch(error => {
      console.log('Notifications invite add error:', error)
    })
}

export const notificationsAdd = (notificationId, data) => async (dispatch) => {
  Firestore.collection('notifications')
    .doc(notificationId)
    .set(data, { merge: true })
    .then(() => {
      if (data.type === 'invite')
        dispatch(updateProfile())
    })
    .catch(error => {
      console.log('Notifications invite add error:', error)
    })
}

export const addNotification = (data) => {
  Firestore.collection('notifications')
    .doc(data.id)
    .set(data, { merge: true })
    .then((e) => {
      console.log(e)
    })
    .catch(error => {
      console.log('Notifications invite add error:', error)
    })
}
