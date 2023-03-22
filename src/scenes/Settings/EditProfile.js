import React, { Fragment, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { StyleSheet, Text, View, TouchableOpacity, Image, Alert, ActivityIndicator, Picker } from 'react-native'
import { Container, Button, Icon, Content, Badge, Item, Input, Label, ActionSheet } from 'native-base'
import DateTimePicker from '@react-native-community/datetimepicker'
import * as ImagePicker from 'expo-image-picker'
import * as Permissions from 'expo-permissions'
import normalize from 'react-native-normalize'
import State from '../../assets/Data/State.json'
import moment from 'moment'
import { Styles, Firestore, COLOR, LAYOUT, Images } from "../../constants"
import { updateProfile, upload } from '../../redux/actions/authActions'
import { Headers, Loading } from '../../components'

const EditProfileScreen = ({ navigation }) => {
  const dispatch = useDispatch()
  const { user } = useSelector(state => state.auth)
  const [username, setUsername] = useState('')
  const [firstname, setFirstname] = useState('')
  const [lastname, setLastname] = useState('')
  const [state, setState] = useState('')
  const [gender, setGender] = useState('')
  const [birthday, setBirthday] = useState(834907574428)
  const [profile_image, setProfileImage] = useState(Images.profile_image)
  const [profile_imaged, setProfileImaged] = useState(Images.profile_image)
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [uloading, setULoading] = useState(false)

  const pickImage = async (type) => {
    if (type === 1) {
      try {
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: false,
          aspect: [1, 1],
        })
        if (!result.cancelled) {
          setProfileImage(result.uri)
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
          setProfileImage(result.uri)
        }
      } else {
        Alert.alert("you need to give up permission to work")
      }
    }
  }

  const onUpdateProfile = async () => {
    setULoading(true)
    let data = {
      username: username,
      first_name: firstname,
      last_name: lastname,
      state: state,
      gender: gender,
      birthday: birthday,
    }
    if (profile_image !== profile_imaged) {
      const url = await upload(profile_image, user.uid)
      data.profile_image = url
    }
    Firestore.collection('users')
      .doc(user.uid)
      .update(data).then(() => {
        Alert.alert(
          'Data!',
          'Saved Succesfully',
          [{
            text: 'Dismiss', onPress: () => {
              dispatch(updateProfile())
              setULoading(false)
            }
          }],
          { cancelable: false }
        )
      }).catch(err => {
        console.log('updateProfile => ', err)
      })
  }

  const loadData = () => {
    setLoading(true)
    Firestore.collection('users').doc(user.uid).get().then(doc => {
      const entity = doc.data()
      setUsername(entity.username)
      setFirstname(entity.first_name)
      setLastname(entity.last_name)
      setState(entity.state)
      setGender(entity.gender)
      setBirthday(entity.birthday)
      setProfileImage(entity.profile_image)
      setProfileImaged(entity.profile_image)
      setLoading(false)
    })
  }

  useEffect(() => {
    loadData()
  }, [])

  return (
    <Container>
      <Headers
        title='Edit Profile'
        left={
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon type='Entypo' name='chevron-thin-left' style={[S.CLW, S.F20]} />
          </TouchableOpacity>
        }
      />
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={new Date(birthday)}
          mode={'date'}
          display="default"
          onChange={(e, d) => {
            if (d == undefined) {
              setShow(false)
            } else {
              setShow(false)
              setBirthday(new Date(d).valueOf())
            }
          }}
        />
      )}
      {
        loading ? <Loading /> :
          <Fragment>
            <Content style={[S.BKBase]} showsVerticalScrollIndicator={false}>
              <View style={[S.PV20]}>
                <View style={[S.ROW, S.Jcenter, S.PV10]}>
                  <View>
                    <View style={[S.avatar, S.Hidden]}>
                      <Image source={{ uri: profile_image }} style={[S.avatar]} />
                    </View>
                    <TouchableOpacity
                      style={{ position: 'absolute', bottom: normalize(5), right: 0, elevation: 4, zIndex: 11 }}
                      onPress={() => ActionSheet.show({ options: LAYOUT.BUTTONS, title: "Select Image" }, pickImage)}
                    >
                      <Badge info style={[S.Jcenter, S.Acenter]}><Icon name="edit" type='FontAwesome5' style={[S.F18, S.CLW]} /></Badge>
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={[S.Acenter, S.Jcenter, S.PB10]}>
                  <Text style={[S.CLGY, S.F15, S.FW700]}>{username}</Text>
                </View>
                <View style={[S.PH30]}>
                  <Item stackedLabel style={S.MT10}>
                    <Label style={[S.CLGY, S.F15, S.FW400]}>UserName</Label>
                    <Input
                      value={username}
                      onChangeText={setUsername}
                      autoCapitalize={'none'}
                      style={[S.H50, S.CLB]}
                    />
                  </Item>
                  <Item stackedLabel style={S.MT10}>
                    <Label style={[S.CLGY, S.F15, S.FW400]}>First Name</Label>
                    <Input
                      value={firstname}
                      onChangeText={setFirstname}
                      autoCapitalize={'none'}
                      style={[S.H50, S.CLB]}
                    />
                  </Item>
                  <Item stackedLabel style={S.MT10}>
                    <Label style={[S.CLGY, S.F15, S.FW400]}>Last Name</Label>
                    <Input
                      value={lastname}
                      onChangeText={setLastname}
                      autoCapitalize={'none'}
                      style={[S.H50, S.CLB]}
                    />
                  </Item>
                  <Item>
                    <Picker
                      mode="dropdown"
                      style={[S.W100P, { height: normalize(60) }]}
                      placeholder="Gender"
                      placeholderStyle={{ color: COLOR.whiteColor }}
                      selectedValue={gender}
                      onValueChange={setGender}
                    >
                      <Picker.Item label="Gender" value="" />
                      <Picker.Item label="Male" value="Male" />
                      <Picker.Item label="Female" value="Female" />
                    </Picker>
                  </Item>
                  <Item>
                    <Picker
                      mode="dropdown"
                      style={[S.W100P, { height: normalize(60) }]}
                      placeholder="State"
                      placeholderStyle={{ color: COLOR.whiteColor }}
                      selectedValue={state}
                      onValueChange={setState}
                    >
                      {
                        State.map((item, key) => (
                          <Picker.Item key={key} label={item.name} value={item.name} />
                        ))
                      }
                    </Picker>
                  </Item>
                  <Item onPress={() => setShow(true)}>
                    <Input
                      value={moment(birthday).format('YYYY-MM-DD')}
                      onFocus={() => setShow(true)}
                      autoCapitalize={'none'}
                    />
                    <TouchableOpacity onPress={() => setShow(true)}>
                      <Icon type='Feather' name='calendar' style={[S.F24]} />
                    </TouchableOpacity>
                  </Item>
                </View>
              </View>
            </Content>
            <Button primary full style={[S.ROW]} onPress={onUpdateProfile} disabled={uloading}>
              {uloading ?
                <ActivityIndicator animating={true} size="small" color={COLOR.greenColor} /> :
                <Text style={[S.F18, S.CLW]}>Save Changes</Text>
              }
            </Button>
          </Fragment>
      }
    </Container>
  )
}

const S = StyleSheet.create({
  ...Styles,
})

export default EditProfileScreen