import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'
import 'firebase/database'
const firebaseConfig = {
  apiKey: 'AIzaSyCEBYp18y6Ax7mhqqILVQna1ktuqloRgiw',
  authDomain: 'puffclubapp-a7b0a.firebaseapp.com',
  databaseURL: 'https://puffclubapp-a7b0a-default-rtdb.firebaseio.com',
  projectId: 'puffclubapp-a7b0a',
  storageBucket: 'puffclubapp-a7b0a.appspot.com',
  messagingSenderId: '274769550069',
  appId: '1:100492728623:android:9da814634a5ee651b569da',
}
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig)
}
let Firestore = firebase.firestore()
let Storage = firebase.storage().ref()
let FieldValue = firebase.firestore.FieldValue
let Database = firebase.database()
export { firebase, Firestore, Storage, FieldValue, Database }