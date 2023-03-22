import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Alert, StyleSheet } from 'react-native'
import { Container, Content, View, Header, Title } from 'native-base'
import normalize from 'react-native-normalize'
import { SearchItem } from '../../components'
import { COLOR, Styles, Images } from "../../constants"
import { setPosition } from '../../redux/actions/authActions'
import * as Location from 'expo-location'

const LiveFeed = [
  { title: 'Nearby Dispensaries', icon: Images.nearby, screen: 'NearbyDispensariesScreen' },
  { title: 'Trending Strains', icon: Images.tranding, screen: 'TrendingStrainsScreen' },
  { title: 'Trending Dispensaries', icon: Images.dispensaries, screen: 'TrendingDispensariesScreen' },
  { title: 'Top Rated Strains', icon: Images.top_rated, screen: 'TopRatedStrainsScreen' },
  { title: 'Global Feed', icon: Images.upcomming_event, screen: 'GlobalActivityScreen' },
]

const LiveFeed1 = [
  { title: 'Nearby Dispensaries', icon: Images.nearby, screen: 'NearbyDispensariesScreen' },
  { title: 'Trending Strains', icon: Images.tranding, screen: 'TrendingStrainsScreen' },
  { title: 'Trending Dispensaries', icon: Images.dispensaries, screen: 'TrendingDispensariesScreen' },
  { title: 'Top Rated Strains', icon: Images.top_rated, screen: 'TopRatedStrainsScreen' },
  { title: 'My Dispensary', icon: Images.upcomming_event, screen: 'MyDispensaryScreen' },
]

const HomeScreen = ({ navigation }) => {
  const dispatch = useDispatch()
  const { user } = useSelector(state => state.auth)

  const GetCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync()

    if (status !== 'granted') {
      Alert.alert(
        'Permission not granted',
        'Allow the app to use location service.',
        [{ text: 'OK' }],
        { cancelable: false }
      )
    }

    let { coords } = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High })
    if (coords) {
      dispatch(setPosition(coords))
    }
  }

  const CheckIfLocationEnabled = async () => {
    let enabled = await Location.hasServicesEnabledAsync()
    if (!enabled)
      Alert.alert(
        'Location Service not enabled',
        'Please enable your location services to continue',
        [{ text: 'OK' }],
        { cancelable: false }
      )
  }

  useEffect(() => {
    navigation.addListener('focus', () => {
      CheckIfLocationEnabled()
      GetCurrentLocation()
    })
  }, [])

  return (
    <Container style={[S.BKBase]}>
      <Header
        style={[S.Header, { height: normalize(60) }]}
        androidStatusBarColor={COLOR.StatusBarColor}
        iosBarStyle={COLOR.StatusBarColor}
      >
        <View style={[S.titleCover]}>
          <Title style={[S.F20, S.FW700]}>Live Feed</Title>
        </View>
      </Header>
      <Content contentContainerStyle={[S.PV10]} showsVerticalScrollIndicator={false}>
        {
          user.isDispensary ?
            LiveFeed1.map((item, key) => <SearchItem key={key} {...item} />) :
            LiveFeed.map((item, key) => <SearchItem key={key} {...item} />)
        }
      </Content>
    </Container>
  )
}
export default HomeScreen

const S = StyleSheet.create(Styles)