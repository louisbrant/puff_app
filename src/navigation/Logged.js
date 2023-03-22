import React, { Fragment, useEffect, useState } from "react"
import { useSelector } from 'react-redux'
import normalize from "react-native-normalize"
import { Image, StyleSheet, Text, View } from "react-native"
import { Icon } from 'native-base'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { NavigationContainer } from "@react-navigation/native"
import { COLOR, Firestore, LAYOUT, Styles } from "../constants"
import { setNavigator } from "../redux/services/navigator"

/**
 * Home
 */
import Home from '../scenes/Home'
import TopRatedStrains from '../scenes/Home/TopRatedStrains'
import TrendingStrains from '../scenes/Home/TrendingStrains'
import TrendingDispensaries from '../scenes/Home/TrendingDispensaries'
import NearbyDispensaries from '../scenes/Home/NearbyDispensaries'
import MapNearbyDispensaries from '../scenes/Home/MapNearbyDispensaries'
/**
 * MyDispensary
 */
import MyDispensary from '../scenes/MyDispensary'
import CreateDStrain from '../scenes/MyDispensary/CreateDStrain'
import MyPhotos from '../scenes/MyDispensary/Photos'
/**
 * GlobalActivity
 */
import GlobalActivity from '../scenes/GlobalActivity'
import Comment from '../scenes/GlobalActivity/Comment'
/**
 * Dispensary
 */
import Dispensaries from '../scenes/Dispensary'
import Maps from '../scenes/Dispensary/Maps'
import Dispensary from '../scenes/Dispensary/Dispensary'
/**
 * Strains
 */
import MyStrains from '../scenes/Strains/MyStrains'
import CreateStrains from '../scenes/Strains/CreateStrains'
import StrainProfile from '../scenes/Strains/StrainProfile'
import RateStrains from '../scenes/Strains/RateStrains'
import AddLocation from '../scenes/Strains/AddLocation'
/**
 * Notificationss
 */
import Notifications from '../scenes/Notifications'
import NGlobalActivity from '../scenes/Notifications/GlobalActivity'
/**
 * Profile
 */
import Profile from '../scenes/Profile'
import Wishlist from '../scenes/Profile/Wishlist'
import Photos from '../scenes/Profile/Photos'
/**
 * Friend
 */
import Friend from '../scenes/Friend'
import FriendAdd from '../scenes/Friend/Add'
import FriendDetails from '../scenes/Friend/Details'
/**
 * Setting
 */
import Settings from '../scenes/Settings'
import Membership from '../scenes/Settings/Membership'
import EditProfile from '../scenes/Settings/EditProfile'
import OEditProfile from '../scenes/Settings/OEditProfile'
import ChangePassword from '../scenes/Settings/ChangePassword'
import TermsConditons from '../scenes/Settings/TermsConditons'


const BottomTab = createBottomTabNavigator()

const Logged = () => {
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
    let interval = setInterval(() => {
      loadData()
    }, 5000)
    return () => {
      clearInterval(interval)
    }
  }, [])
  return (
    <NavigationContainer ref={setNavigator}>
      <BottomTab.Navigator
        tabBarOptions={{
          style: { height: normalize(60), borderTopWidth: 0 },
          tabStyle: S.footerTab
        }}
        initialRouteName='HomeScreen'
        keyboardHidesTabBar={true}
      >
        <BottomTab.Screen
          name="HomeScreen"
          component={Home}
          options={{
            title: () => null,
            tabBarIcon: ({ focused }) => (
              <Fragment>
                <Icon name="search" type='Feather' style={[focused ? S.AIcon : S.Icon]} />
                <Text style={[focused ? S.AText : S.Text]}>Live Feed</Text>
              </Fragment>
            )
          }}
        />
        <BottomTab.Screen
          name="MapsScreen"
          component={Maps}
          options={{
            title: () => null,
            tabBarIcon: ({ focused }) => (
              <Fragment>
                <Icon name="map" type='Feather' style={[focused ? S.AIcon : S.Icon]} />
                <Text style={[focused ? S.AText : S.Text]}>Dispensary</Text>
              </Fragment>
            )
          }}
        />
        <BottomTab.Screen
          name="MyStrainsScreen"
          component={MyStrains}
          options={{
            title: () => null,
            tabBarIcon: ({ focused }) => (
              <Fragment>
                <Icon name="list" type='Feather' style={[focused ? S.AIcon : S.Icon]} />
                <Text style={[focused ? S.AText : S.Text]}>Strains</Text>
              </Fragment>
            )
          }}
        />
        <BottomTab.Screen
          name="NotificationsScreen"
          component={Notifications}
          options={{
            title: () => null,
            tabBarIcon: ({ focused }) => (
              <Fragment>
                <View>
                  <Icon name="ios-notifications-outline" type='Ionicons' style={[focused ? S.AIcon : S.Icon]} />
                  {
                    count ?
                      <Icon name="circle" type='FontAwesome' style={[S.F13, S.CLDanger, S.PABS, { top: -2, right: -2 }]} />
                      : null
                  }
                </View>
                <Text style={[focused ? S.AText : S.Text]}>Notifications</Text>
              </Fragment>
            )
          }}
        />
        <BottomTab.Screen
          name="ProfileScreen"
          component={Profile}
          options={{
            title: () => null,
            tabBarIcon: ({ focused }) => (
              <Fragment>
                <View style={{ borderRadius: normalize(20), borderWidth: focused ? 2 : 0, borderColor: COLOR.HeaderColor }}>
                  <View style={[S.pIcon]}>
                    <Image source={{ uri: user.profile_image }} style={[S.pIcon]} />
                  </View>
                </View>
                <Text style={[focused ? S.AText : S.Text]}>Profile</Text>
              </Fragment>
            )
          }}
        />
        <BottomTab.Screen name="TopRatedStrainsScreen" component={TopRatedStrains} options={LAYOUT.bottomOption} />
        <BottomTab.Screen name="TrendingStrainsScreen" component={TrendingStrains} options={LAYOUT.bottomOption} />
        <BottomTab.Screen name="TrendingDispensariesScreen" component={TrendingDispensaries} options={LAYOUT.bottomOption} />
        <BottomTab.Screen name="NearbyDispensariesScreen" component={NearbyDispensaries} options={LAYOUT.bottomOption} />
        <BottomTab.Screen name="MapNearbyDispensariesScreen" component={MapNearbyDispensaries} options={LAYOUT.bottomOption} />
        <BottomTab.Screen name="GlobalActivityScreen" component={GlobalActivity} options={LAYOUT.bottomOption} />
        <BottomTab.Screen name="CommentScreen" component={Comment} options={LAYOUT.bottomOption} />
        <BottomTab.Screen name="MyDispensaryScreen" component={MyDispensary} options={LAYOUT.bottomOption} />
        <BottomTab.Screen name="CreateDStrainScreen" component={CreateDStrain} options={LAYOUT.bottomOption} />
        <BottomTab.Screen name="MyPhotosScreen" component={MyPhotos} options={LAYOUT.bottomOption} />
        <BottomTab.Screen name="DispensariesScreen" component={Dispensaries} options={LAYOUT.bottomOptionVisible} />
        <BottomTab.Screen name="DispensaryScreen" component={Dispensary} options={LAYOUT.bottomOption} />
        <BottomTab.Screen name="StrainCreateScreen" component={CreateStrains} options={LAYOUT.bottomOption} />
        <BottomTab.Screen name="StrainProfileScreen" component={StrainProfile} options={LAYOUT.bottomOption} />
        <BottomTab.Screen name="AddLocationScreen" component={AddLocation} options={LAYOUT.bottomOption} />
        <BottomTab.Screen name="RateStrainScreen" component={RateStrains} options={LAYOUT.bottomOption} />
        <BottomTab.Screen name="NGlobalActivityScreen" component={NGlobalActivity} options={LAYOUT.bottomOption} />
        <BottomTab.Screen name="WishlistScreen" component={Wishlist} options={LAYOUT.bottomOption} />
        <BottomTab.Screen name="PhotosScreen" component={Photos} options={LAYOUT.bottomOption} />
        <BottomTab.Screen name="FriendScreen" component={Friend} options={LAYOUT.bottomOption} />
        <BottomTab.Screen name="AddFriendScreen" component={FriendAdd} options={LAYOUT.bottomOption} />
        <BottomTab.Screen name="FriendDetailsScreen" component={FriendDetails} options={LAYOUT.bottomOption} />
        <BottomTab.Screen name="SettingsScreen" component={Settings} options={LAYOUT.bottomOption} />
        <BottomTab.Screen name="EditProfileScreen" component={EditProfile} options={LAYOUT.bottomOption} />
        <BottomTab.Screen name="OEditProfileScreen" component={OEditProfile} options={LAYOUT.bottomOption} />
        <BottomTab.Screen name="MembershipScreen" component={Membership} options={LAYOUT.bottomOption} />
        <BottomTab.Screen name="ChangePasswordScreen" component={ChangePassword} options={LAYOUT.bottomOption} />
        <BottomTab.Screen name="TermsConditonsScreen" component={TermsConditons} options={LAYOUT.bottomOption} />
      </BottomTab.Navigator>
    </NavigationContainer>
  )
}
export default Logged

const S = StyleSheet.create({
  ...Styles,
  pIcon: {
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
  Icon: {
    color: COLOR.whiteColor,
    fontSize: normalize(18),
  },
  AIcon: {
    color: COLOR.greenColor,
    fontSize: normalize(22),
  },
  Text: {
    color: COLOR.whiteColor,
    fontSize: normalize(13),
  },
  AText: {
    color: COLOR.greenColor,
    fontWeight: '700',
    fontSize: normalize(14),
  },
})