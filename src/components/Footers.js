import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Image, StyleSheet, Text } from 'react-native'
import { Footer, Button, FooterTab, View, Icon } from 'native-base'
import normalize from 'react-native-normalize'
import { COLOR, Firestore, Styles } from "../constants"
import { navigate } from '../redux/services/navigator'

const Footers = ({ active }) => {
  const { user } = useSelector(state => state.auth)
  const [count, setCount] = useState(0)

  const loadData = () => {
    Firestore
      .collection('notifications')
      .where('receiver', '==', user.uid)
      .where('see', '==', false)
      .get()
      .then(snapshot => {
        setCount(snapshot.size)
      }).catch(error => {
        console.log(error)
      })
  }

  useEffect(() => {
    loadData()
  }, [active])

  return (
    <Footer style={{ height: normalize(60) }}>
      <FooterTab style={[S.footerTab]}>
        <Button vertical onPress={() => navigate('HomeScreen')}>
          <Icon name="search" type='Feather' style={[active === 0 ? S.footerActiveIcon : S.footerIcon]} />
          <Text style={[active === 0 ? S.footerActiveText : S.footerText]}>Live Feed</Text>
        </Button>
        <Button vertical onPress={() => navigate('MapsScreen')}>
          <Icon name="map" type='Feather' style={[active === 1 ? S.footerActiveIcon : S.footerIcon]} />
          <Text style={[active === 1 ? S.footerActiveText : S.footerText]}>Dispensary</Text>
        </Button>
        <Button vertical onPress={() => navigate('MyStrainsScreen')}>
          <Icon name="list" type='Feather' style={[active === 3 ? S.footerActiveIcon : S.footerIcon]} />
          <Text style={[active === 3 ? S.footerActiveText : S.footerText]}>Strains</Text>
        </Button>
        <Button vertical onPress={() => navigate('NotificationsScreen')}>
          <View>
            <Icon name="ios-notifications-outline" type='Ionicons' style={[active === 2 ? S.footerActiveIcon : S.footerIcon]} />
            {count ?
              <Icon name="circle" type='FontAwesome' style={[S.F13, S.CLDanger, S.PABS, { top: -2, right: -2 }]} />
              : null}
          </View>
          <Text style={[active === 2 ? S.footerActiveText : S.footerText]}>Notifications</Text>
        </Button>
        <Button vertical onPress={() => navigate('ProfileScreen')}>
          <View style={{ borderRadius: normalize(20), borderWidth: active === 4 ? 2 : 0, borderColor: COLOR.HeaderColor }}>
            <View style={[S.profileIcon]}>
              <Image source={{ uri: user.profile_image }} style={[S.profileIcon]} />
            </View>
          </View>
          <Text style={[active === 4 ? S.footerActiveText : S.footerText]}>Profile</Text>
        </Button>
      </FooterTab>
    </Footer>
  )
}

export default Footers

const S = StyleSheet.create({
  ...Styles,
  profileIcon: {
    height: normalize(25),
    width: normalize(25),
    borderRadius: normalize(16),
    resizeMode: 'contain',
    overflow: 'hidden',
  },
  footerTab: {
    backgroundColor: COLOR.FooterColor,
    elevation: 15
  },
  footerIcon: {
    color: COLOR.whiteColor,
    fontSize: normalize(18),
  },
  footerActiveIcon: {
    color: COLOR.greenColor,
    fontSize: normalize(22),
  },
  footerText: {
    color: COLOR.whiteColor,
    fontSize: normalize(13),
  },
  footerActiveText: {
    color: COLOR.greenColor,
    fontWeight: '700',
    fontSize: normalize(14),
  },
})
