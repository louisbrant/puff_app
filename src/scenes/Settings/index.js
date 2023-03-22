import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { StyleSheet, Text, View, TouchableOpacity, Image, Alert } from 'react-native'
import { Container, Button, Icon, Content } from 'native-base'
import { logOut } from '../../redux/actions/authActions'
import { Styles } from "../../constants"
import { Headers } from '../../components'

const SettingsScreen = ({ navigation }) => {
  const { user } = useSelector(state => state.auth)
  const dispatch = useDispatch()

  const onLogOut = () => {
    Alert.alert(
      "Confirm!",
      "Are you sure you want to logout?",
      [
        { text: "Yes", onPress: () => dispatch(logOut()) },
        { text: "No", onPress: () => { }, style: "cancel" }
      ],
      { cancelable: false }
    )
  }

  return (
    <Container>
      <Headers
        title='Settings'
        left={
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon type='Entypo' name='chevron-thin-left' style={[S.CLW, S.F20]} />
          </TouchableOpacity>
        }
        right={
          <TouchableOpacity onPress={onLogOut}>
            <Icon type='Feather' name='log-out' style={[S.CLW, S.F24]} />
          </TouchableOpacity>
        }
      />
      <Content style={[S.BKBase]} showsVerticalScrollIndicator={false}>
        <View style={[S.ROW, S.Jcenter, S.PV10, S.MT30]}>
          <View style={[S.avatar]}>
            {user.profile_image ? <Image source={{ uri: user.profile_image }} style={[S.avatar]} /> : null}
          </View>
        </View>
        <View style={[S.Acenter, { flex: 1 }]}>
          <View style={[S.Acenter, S.Jcenter]}>
            <Text style={[S.CLGY, S.F16, S.FW700]}>{user.username}</Text>
          </View>
        </View>
        <View style={[S.Acenter, S.PH30]}>
          <Text style={[S.CLIcon, S.FW700, S.F20, S.MT20]}>Account Settings</Text>
          <Button
            block
            style={[S.ROW, S.PL30, S.PR10, S.MT10, S.BKW, S.Jbetween]}
            onPress={() => navigation.navigate('ChangePasswordScreen')}
          >
            <Text style={[S.CLGY, S.F18]}>Change Password</Text>
            <Icon name='chevron-thin-right' type='Entypo' style={[S.F24, S.CLIcon]} />
          </Button>
          <Button
            block
            style={[S.ROW, S.PL30, S.PR10, S.MT10, S.BKW, S.Jbetween]}
            onPress={() => {
              if (user.isDispensary) {
                navigation.navigate('OEditProfileScreen')
              } else {
                navigation.navigate('EditProfileScreen')
              }
            }}
          >
            <Text style={[S.CLGY, S.F18]}>Edit Profile</Text>
            <Icon name='chevron-thin-right' type='Entypo' style={[S.F24, S.CLIcon]} />
          </Button>
          {
            user.isDispensary ? (
              <Button
                block
                style={[S.ROW, S.PL30, S.PR10, S.MT10, S.BKW, S.Jbetween]}
                onPress={() => navigation.navigate('MembershipScreen')}
              >
                <Text style={[S.CLGY, S.F18]}>Membership</Text>
                <Icon name='chevron-thin-right' type='Entypo' style={[S.F24, S.CLIcon]} />
              </Button>
            ) : null
          }
          <Text style={[S.CLIcon, S.FW700, S.F20, S.MT30]}>The Fine Print</Text>
          <Button
            block
            style={[S.ROW, S.PL30, S.PR10, S.MV10, S.BKW, S.MB10, S.Jbetween]}
            onPress={() => navigation.navigate('TermsConditonsScreen')}
          >
            <Text style={[S.CLGY, S.F18]}>Terms & Conditions</Text>
            <Icon name='chevron-thin-right' type='Entypo' style={[S.F24, S.CLIcon]} />
          </Button>
        </View>
      </Content>
    </Container>
  )
}

const S = StyleSheet.create({
  ...Styles,
})

export default SettingsScreen