import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import * as ImagePicker from 'expo-image-picker'
import { StyleSheet, TouchableOpacity, Text, Image, Alert, FlatList } from 'react-native'
import { Container, Icon, View } from 'native-base'
import { Styles, firebase, Storage, Firestore, LAYOUT } from "../../constants"
import { Headers } from '../../components'
import { GetDate } from '../../redux/actions/authActions'
import { updateProfile } from '../../redux/actions/authActions'

const MyPhotosScreen = ({ navigation, route: { params } }) => {
  const dispatch = useDispatch()
  const [MyImages, setMyImages] = useState([])
  const [loading, setLoading] = useState(false)

  const imageUpload = async (uri) => {
    const uid = params.uid
    const date = GetDate()
    const response = await fetch(uri)
    const blob = await response.blob()
    const ref = Storage.child('users').child(uid).child('photos').child(`-${uid}-${date.createdAtSeconds}.png`)
    await ref.put(blob)
    const url = await ref.getDownloadURL()
    Firestore.collection('users').doc(params.uid).update({
      images: firebase.firestore.FieldValue.arrayUnion(url),
      updatedAt: date.createdAt,
      updatedAtSeconds: date.createdAtSeconds,
    }).then(() => {
      loadData()
      dispatch(updateProfile())
    }).catch((err) => {
      console.log(`Error writing document: ${err}`)
    })
  }

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: false,
      })
      if (!result.cancelled) {
        imageUpload(result.uri)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const imageRemove = (url) => {
    Alert.alert(
      "Alert",
      "You are about to flag this Image. Do you want to continue ?",
      [
        {
          text: "No",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        {
          text: "Yes", onPress: () => {
            let date = GetDate()
            firebase.storage().refFromURL(url).delete().then(() => {
              Firestore.collection('users').doc(params.uid).update({
                images: firebase.firestore.FieldValue.arrayRemove(url),
                updatedAt: date.createdAt,
                updatedAtSeconds: date.createdAtSeconds,
              }).then(() => {
                loadData()
                Alert.alert(
                  'Success',
                  'Thank you for reporting this. This image has been removed and the developers have been notified to take action.',
                  [
                    { text: 'Dismiss', onPress: () => { console.log('Ratring for this strain - Success!!'), dispatch(updateProfile()) } }
                  ],
                  { cancelable: false }
                )
              }).catch((err) => {
                console.log(`Error writing document: ${err}`)
              })
            }).catch((err) => {
              console.log(`Error deleting photo:`, err)
            })
          }
        }
      ],
      { cancelable: false }
    )
  }

  const loadData = () => {
    setLoading(true)
    Firestore.collection('users').doc(params.uid).get().then(postSnap => {
      const entity = postSnap.data()
      setMyImages(entity.images)
      setLoading(false)
    }).catch(error => {
      console.log(error)
      setLoading(false)
    })
  }


  useEffect(() => {
    loadData()
  }, [params])

  return (
    <Container style={[S.BKBase]}>
      <Headers
        title='PHOTOS'
        left={
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon type='Entypo' name='chevron-thin-left' style={[S.CLW, S.F20]} />
          </TouchableOpacity>
        }
      />
      < TouchableOpacity onPress={pickImage} style={[S.MT10, S.W100P, S.Acenter]}>
        <Text style={[S.F20, S.FW700, S.CLWarning]} >Add Photos</Text>
      </TouchableOpacity>
      <FlatList
        data={MyImages}
        contentContainerStyle={[S.ROW, S.PV10, S.PH20, S.Wrap]}
        refreshing={loading}
        onRefresh={loadData}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => `${index}`}
        renderItem={({ item }) => (
          <View style={[S.BKW, { margin: LAYOUT.window.width * 0.01 }]}>
            <Image source={{ uri: item }} style={[S.photos]} />
            <TouchableOpacity style={[S.PABS, { right: 0 }]} onPress={() => imageRemove(item)}>
              <Icon type="Ionicons" name="md-close-circle" style={[S.CLDanger, S.F27]} />
            </TouchableOpacity>
          </View>
        )}
      />
    </Container >
  )
}

export default MyPhotosScreen

const S = StyleSheet.create({
  ...Styles,
})