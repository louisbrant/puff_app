import React, { Fragment, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { StyleSheet, TouchableOpacity, View, Text, ScrollView, Alert, ActivityIndicator, Image } from 'react-native'
import { Container, Icon, Content, Button, ActionSheet, Item, Textarea } from 'native-base'
import normalize from 'react-native-normalize'
import * as ImagePicker from 'expo-image-picker'
import * as Permissions from 'expo-permissions'
import { GetDate } from '../../redux/actions/authActions'
import { Styles, Firestore, LAYOUT, COLOR, Images, Storage } from "../../constants"
import { AddItem, Headers, HRs, Loading } from '../../components'
import Rating from '../../components/Rating'

const RateStrainScreen = ({ navigation, route: { params } }) => {
  const { user } = useSelector(state => state.auth)
  const [myFlavors, setMyFlavors] = useState([])
  const [myScents, setMyScents] = useState([])
  const [myRate, setMyRate] = useState(0)
  const [rdescription, setRdescription] = useState('')
  const [currentData, setCurrentData] = useState({})
  const [loading, setLoading] = useState(false)
  const [background_image, setBackgroundImage] = useState(null)

  const Error = (error) => {
    console.log(error)
    setLoading(false)
  }

  const upload = async (uri, path) => {
    if (uri) {
      const response = await fetch(uri)
      const blob = await response.blob()
      const ref = Storage.child('rate_strain').child(`${path}.jpg`)
      await ref.put(blob)
      return await ref.getDownloadURL()
    } else {
      return ''
    }
  }

  const onSubmit = async () => {
    const { uid, friends } = user
    setLoading(true)
    const url = await upload(background_image, String(new Date().valueOf()))
    let content = {
      ratings: { [uid]: myRate },
      flavors: { [uid]: myFlavors },
      scents: { [uid]: myScents },
      background: { [uid]: url },
      rdescription: { [uid]: rdescription },
    }
    Firestore.collection('strains')
      .doc(currentData.id)
      .set(content, { merge: true })
      .then(() => {
        Firestore.collection('posts')
          .add({
            dispensary_id: uid,
            isDispensary: user.isDispensary,
            strain_id: currentData.id,
            name: currentData.name,
            details: currentData.details,
            description: currentData.description,
            rdescription: rdescription,
            photo: currentData.photo,
            ratings: myRate,
            uid,
            users_name: user.username,
            users_profile: user.profile_image,
            background: url,
            ...GetDate()
          }).then(() => {
            let notificationId = uid + GetDate().createdAtSeconds
            let data = { from: uid, to: uid, type: 'ratein', see: false, notificationId, dataId: currentData.id }
            // dispatch(notificationsAdd(notificationId, data))
            if (friends && friends.length) {
              for (const key in friends) {
                let notificationId = uid + GetDate().createdAtSeconds + key
                let data = { from: uid, to: friends[key], type: 'rateIn', see: false, notificationId, dataId: currentData.id }
                // dispatch(notificationsAdd(notificationId, data))
              }
            }
            Alert.alert(
              'Success',
              'All your changes were succesfully submitted',
              [{
                text: 'Dismiss', onPress: () => {
                  setLoading(false)
                  loadData()
                }
              }],
            )
          }).catch(Error)
      }).catch(Error)
  }

  const onAdd = (e) => {
    if (myFlavors.indexOf(e) > -1) {
      let myFlavorsData = myFlavors.filter(a => a !== e)
      setMyFlavors(myFlavorsData)
    } else {
      setMyFlavors([...myFlavors, e])
    }
  }

  const onAdd1 = (e) => {
    if (myScents.indexOf(e) > -1) {
      let myScentsData = myScents.filter(a => a !== e)
      setMyScents(myScentsData)
    } else {
      setMyScents([...myScents, e])
    }
  }

  const loadData = () => {
    const uid = user.uid
    Firestore.collection('strains')
      .doc(params.id)
      .get()
      .then(doc => {
        const entity = doc.data()
        if (entity.ratings && Object.keys(entity.ratings).length) {
          let ratings = Object.values(entity.ratings)
          let rateSum = ratings.reduce((a, b) => a + b)
          let rate = rateSum / ratings.length
          entity.rateCount = ratings.length
          entity.rateSum = rateSum
          entity.rate = rate
        } else {
          entity.rateCount = entity.rate = entity.rateSum = 0
        }
        entity.id = doc.id
        setCurrentData(entity)
        if (entity.ratings && entity.ratings[uid]) {
          setMyRate(entity.ratings[uid])
        } else {
          setMyRate(0)
        }
        if (entity.flavors && entity.flavors[uid]) {
          setMyFlavors(entity.flavors[uid])
        } else {
          setMyFlavors([])
        }
        if (entity.scents && entity.scents[uid]) {
          setMyScents(entity.scents[uid])
        } else {
          setMyScents([])
        }
        if (entity.rdescription && entity.rdescription[uid]) {
          setRdescription(entity.rdescription[uid])
        } else {
          setRdescription('')
        }
      })
  }

  const pickImage = async (type) => {
    if (type === 1) {
      try {
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: false,
          aspect: [1, 1],
        })
        if (!result.cancelled) {
          setBackgroundImage(result.uri)
        }
      } catch (e) {
        console.log(e)
      }
    } else if (type === 0) {
      const { granted } = await Permissions.askAsync(Permissions.CAMERA)
      if (granted) {
        const result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: false,
          aspect: [1, 1],
          quality: 0.5
        })
        if (!result.cancelled) {
          setBackgroundImage(result.uri)
        }
      } else {
        Alert.alert("you need to give up permission to work")
      }
    }
  }

  useEffect(() => {
    loadData()
  }, [params])

  return (
    <Container>
      <Headers
        title='Rate Strain'
        left={
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon type='Entypo' name='chevron-thin-left' style={[S.CLW, S.F20]} />
          </TouchableOpacity>
        }
      />
      {
        Object.keys(currentData).length > 1 ?
          <Fragment>
            <Content nestedScrollEnabled={true} contentContainerStyle={[S.PB10]} showsVerticalScrollIndicator={false}>
              <View style={[S.Acenter]}>
                <View style={[S.PT20, S.Jcenter, S.Acenter]}>
                  <TouchableOpacity style={[S.ROW, S.Astart]} disabled onPress={() => navigation.navigate('StrainProfileScreen', currentData)}>
                    <Image source={{ uri: currentData.photo }} style={[S.productIcon, { resizeMode: 'center' }]} />
                    <View style={[S.PH20, S.detailsBox]}>
                      <View style={[S.ROW, S.Acenter]}>
                        <Rating
                          isDisabled={true}
                          defaultRating={currentData && currentData.rate ? currentData.rate : 0}
                          showRating={false}
                          size={normalize(20)}
                        />
                        <Text style={[S.F13, S.CLGY]}> {currentData.rateCount}</Text>
                      </View>
                      <Text style={[S.F16, S.FW700, S.CLB]}>{currentData.name}</Text>
                      <Text style={[S.F13, S.CLGY]}>{currentData.description}</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity style={{ alignSelf: 'flex-end' }}>
                    {
                      background_image ?
                        <TouchableOpacity style={[S.Acenter]} onPress={() => setBackgroundImage(null)}>
                          <Image source={{ uri: background_image }} style={{ width: normalize(50), height: normalize(50), resizeMode: 'contain' }} />
                          <Text style={[S.CLB, S.F13]}>Remove Photo</Text>
                        </TouchableOpacity> :
                        <TouchableOpacity style={[S.Acenter]} onPress={() => ActionSheet.show({ options: LAYOUT.BUTTONS, title: "Select Image" }, pickImage)}>
                          <Image source={Images.add_photo} style={{ width: normalize(50), height: normalize(50), resizeMode: 'contain' }} />
                          <Text style={[S.CLB, S.F13]}>Add Photo</Text>
                        </TouchableOpacity>
                    }
                  </TouchableOpacity>
                </View>
                <HRs pro={80} />
                <View style={[S.ROW, S.PH30, S.H50, S.Acenter, S.W100P, S.Jbetween]}>
                  <Text style={[S.F16, S.FW700, S.CLG]}>RATING</Text>
                  <Rating
                    defaultRating={myRate}
                    showRating={false}
                    size={normalize(28)}
                    onFinishRating={setMyRate}
                    style={[S.PH15]}
                  />
                </View>
                <HRs pro={80} />
                <View style={[S.ROW, S.PH30, S.H50, S.Acenter, S.W100P, S.Jbetween]}>
                  <View style={[S.Jbetween]}>
                    <Text style={[S.F16, S.FW700, S.CLG]}>WHERE WAS IT PURCHASED FROM</Text>
                    <Text style={[S.F16, S.FW700, S.CLB, S.MT5]}>See Dispensaries</Text>
                  </View>
                  <TouchableOpacity onPress={() => navigation.navigate('DispensaryScreen', { id: currentData.dispensary_id })}>
                    <Icon name='chevron-thin-right' type='Entypo' style={[S.CLB, S.F20]} />
                  </TouchableOpacity>
                </View>
                <HRs pro={80} />
                <Text style={[S.F16, S.FW700, S.CLG, S.W100P, S.PH30, S.MT10]}>SCENTS</Text>
                <ScrollView style={[S.MH20, S.MT10]} horizontal showsHorizontalScrollIndicator={false} >
                  <View style={[S.ROW]}>
                    {LAYOUT.product.map((title, key) => <AddItem key={key} title={title} arr={myScents} onPress={onAdd1} />)}
                  </View>
                </ScrollView>
                <Text style={[S.F16, S.FW700, S.CLG, S.W100P, S.PH30, S.MT20]}>FLAVORS</Text>
                <ScrollView style={[S.MH20, S.MT10]} horizontal showsHorizontalScrollIndicator={false} >
                  <View style={[S.ROW]}>
                    {LAYOUT.product.map((title, key) => <AddItem key={key} title={title} arr={myFlavors} onPress={onAdd} />)}
                  </View>
                </ScrollView>
              </View>
              <View style={[S.PH20]}>
                <Item regular style={[S.MT15, S.MB10, S.Astart, S.W100P]}>
                  <Icon name='book-open' type='Feather' style={[S.MT15, S.InputIcon]} />
                  <Textarea
                    value={rdescription}
                    onChangeText={setRdescription}
                    rowSpan={4}
                    maxLength={400}
                    placeholder="Description"
                    placeholderTextColor={COLOR.InputBorder}
                    style={[S.PR50, S.MT15, { borderColor: 'transparent' }]}
                  />
                </Item>
              </View>
            </Content>
            <Button block vertical success onPress={onSubmit} style={[S.ROW]} disabled={loading}>
              {loading ?
                <ActivityIndicator animating={true} size="small" color={COLOR.greenColor} style={S.PV10} /> :
                <Text style={[S.F18, S.CLW, S.PV10]}>Submit</Text>
              }
            </Button>
          </Fragment> : <Loading />
      }
    </Container>
  )
}

export default RateStrainScreen

const S = StyleSheet.create({
  ...Styles,
  detailsBox: {
    justifyContent: "center",
    paddingVertical: normalize(5),
    width: LAYOUT.window.width * 0.65
  },
  hr: {
    borderBottomWidth: 0.5,
    borderColor: COLOR.BorderColor,
  },
  header: {
    backgroundColor: COLOR.HeaderColor,
    height: normalize(60),
  },
  InputIcon: {
    fontSize: normalize(24),
    color: COLOR.TextColor
  },
})