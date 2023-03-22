import { GetDate, updateProfile } from './authActions'
import { find } from './rootActions'
import { notificationsRemove, notificationsAdd } from './notificationsActions'
import { Firestore, FieldValue } from '../../constants'

export const InviteFriend = (id1, id2) => async (dispatch) => {
  Firestore.collection('users')
    .doc(id1)
    .update({ inviteFriends: FieldValue.arrayUnion(id2) })
    .then(() => {
      let notificationId = id1 + GetDate().createdAtSeconds
      let data = { from: id1, to: id2, type: 'invite', see: false, dataId: notificationId, notificationId }
      dispatch(notificationsAdd(notificationId, data))
    })
    .catch(error => {
      console.log('InviteFriend error:', error)
    })
}

export const RemoveInvite = (id1, id2) => async (dispatch) => {
  Firestore.collection('users')
    .doc(id1)
    .update({ inviteFriends: FieldValue.arrayRemove(id2) })
    .then(async () => {
      await dispatch(notificationsRemove(id1, id2))
      dispatch(updateProfile())
      dispatch(LoadFriend())
    })
    .catch(error => {
      console.log('InviteFriend error:', error)
    })
}

export const ApproveInvite = (currentUser) => async (dispatch, getState) => {
  const { uid } = getState().auth.user
  Firestore.collection('users')
    .doc(currentUser.uid)
    .update({
      inviteFriends: FieldValue.arrayRemove(uid),
      friends: FieldValue.arrayUnion(uid)
    }).then(() => {
      Firestore.collection('users').doc(uid)
        .update({ friends: FieldValue.arrayUnion(currentUser.uid) })
        .then(async () => {
          await dispatch(notificationsRemove(currentUser.uid, uid))
          dispatch(updateProfile())
          dispatch(LoadFriend())
            .catch(error => {
              console.log('Notifications invite add error:', error)
            })
        })
    }).catch(error => {
      console.log('ApproveInvite error:', error)
    })
}

export const RemoveFriend = (currentUser) => async (dispatch, getState) => {
  const { uid } = getState().auth.user
  Firestore.collection('users')
    .doc(currentUser.uid)
    .update({ friends: FieldValue.arrayRemove(uid) })
    .then(() => {
      Firestore.collection('users')
        .doc(uid)
        .update({ friends: FieldValue.arrayRemove(currentUser.uid) })
        .then(() => {
          dispatch(LoadFriend())
          dispatch(updateProfile())
        })
    }).catch(error => {
      console.log('RemoveFriend error:', error)
    })
}

export const LoadFriend = () => async (dispatch, getState) => {
  const { uid } = getState().auth.user
  Firestore.collection('users')
    .where('isDispensary', '==', false)
    .where('friends', 'array-contains', uid)
    .get().then(e => find(e))
    .then(friendUsers => dispatch({ type: "FRIEND_DATA", payload: friendUsers }))
    .catch(error => {
      console.log("Getting documents error: ", error)
    })

  Firestore.collection('users')
    .where('isDispensary', '==', false)
    .where('inviteFriends', 'array-contains', uid)
    .get().then(e => find(e))
    .then(pendingUsers => dispatch({ type: "FRIEND_PENDING_DATA", payload: pendingUsers }))
    .catch(error => {
      console.log("Getting documents error: ", error)
    })
}

export const LoadUserList = () => async (dispatch, getState) => {
  const { uid, friends } = getState().auth.user
  let friendsList = friends ? friends : []
  await Firestore.collection('users')
    .where('isDispensary', '==', false)
    .where('inviteFriends', 'array-contains', uid)
    .get()
    .then(querySnapshot => {
      querySnapshot.forEach(doc => friendsList.push(doc.id))
    })
    .catch(error => {
      console.log("Getting documents error: ", error)
    })

  await Firestore.collection('users')
    .where('isDispensary', '==', false)
    .get()
    .then(querySnapshot => {
      const users = []
      querySnapshot.forEach(doc => {
        const entity = doc.data()
        if (doc.id !== uid && friendsList.indexOf(doc.id) < 0) {
          users.push(entity)
        }
      })
      dispatch({ type: "FRIEND_USERLIST_DATA", payload: users })
    })
    .catch(error => {
      console.log("Getting documents error: ", error)
    })
}