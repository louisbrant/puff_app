import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity } from 'react-native'
import { Container, Button, Icon, Content, Form, Item, Input, Label, Footer, FooterTab } from 'native-base'
import { Styles, firebase, COLOR } from "../../constants"
import { Headers } from '../../components'
import { logOut } from '../../redux/actions/authActions'

const ChangePasswordScreen = ({ navigation }) => {
  const dispatch = useDispatch()
  const { user } = useSelector(state => state.auth)
  const [cPassword, setCPassword] = useState('')
  const [nPassword, setNPassword] = useState('')
  const [rPassword, setRPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const Alerts = (title, message) => {
    Alert.alert(
      title,
      message,
      [{ text: 'Dismiss', onPress: () => { setLoading(false) } }],
      { cancelable: false }
    )
  }

  const onChangePassword = () => {
    setLoading(true)
    if (nPassword === rPassword) {
      const credential = firebase.auth.EmailAuthProvider.credential(user.email, cPassword)
      firebase.auth().currentUser.reauthenticateWithCredential(credential).then(() => {
        firebase.auth().currentUser.updatePassword(nPassword).then(() => {
          dispatch(logOut())
          Alerts('Change Password', 'Password has been changed please login back again.')
        }).catch(err => {
          Alerts('Error!', err.message)
        })
      }).catch(err => {
        Alerts('Error!', err.message)
      })
    } else {
      Alerts('Error!', "Password doesn't match.")
    }
  }

  return (
    <Container>
      <Headers
        title='Change Password'
        left={
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon type='Entypo' name='chevron-thin-left' style={[S.CLW, S.F20]} />
          </TouchableOpacity>
        }
      />
      <Content style={[S.P30, S.MT20, S.BKBase]} showsVerticalScrollIndicator={false}>
        <Form>
          <Item stackedLabel last>
            <Label>Old Password</Label>
            <Input
              autoCapitalize={'none'}
              secureTextEntry={true}
              style={[S.H40, S.CLB]}
              value={cPassword}
              onChangeText={setCPassword}
            />
          </Item>
          <Item stackedLabel last>
            <Label>New Password</Label>
            <Input
              autoCapitalize={'none'}
              secureTextEntry={true}
              style={[S.H40, S.CLB]}
              value={nPassword}
              onChangeText={setNPassword}
            />
          </Item>
          <Item stackedLabel last>
            <Label>Re-Enter New Password</Label>
            <Input
              autoCapitalize={'none'}
              secureTextEntry={true}
              style={[S.H40, S.CLB]}
              value={rPassword}
              onChangeText={setRPassword}
            />
          </Item>
        </Form>
      </Content>
      <Button primary full style={[S.ROW]} onPress={onChangePassword} disabled={loading}>
        {loading ?
          <ActivityIndicator animating={true} size="small" color={COLOR.greenColor} /> :
          <Text style={[S.F18, S.CLW]}>Submit</Text>
        }
      </Button>
    </Container>
  )
}

export default ChangePasswordScreen

const S = StyleSheet.create({
  ...Styles,
})