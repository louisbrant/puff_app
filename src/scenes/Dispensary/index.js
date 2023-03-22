import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { getDistance } from 'geolib'
import { StyleSheet, TouchableOpacity, FlatList, Image } from 'react-native'
import { Container, Icon, Input, View, InputGroup, Header, Title, Content, ActionSheet } from 'native-base'
import normalize from 'react-native-normalize'
import { COLOR, Styles, Firestore, Images, LAYOUT } from '../../constants'
import { DispensaryItem, Loading } from '../../components'

const Dispensaries = ({ navigation }) => {
  const { position } = useSelector(state => state.auth)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [miles, setMiles] = useState(null)

  const Success = (querySnapshot) => {
    const productsData = []
    querySnapshot.forEach(doc => {
      const entity = doc.data()
      if (entity.ratings && Object.keys(entity.ratings).length) {
        let ratings = Object.values(entity.ratings)
        let rate = ratings.reduce((a, b) => a + b) / ratings.length
        entity.rateCount = ratings.length
        entity.rate = rate
      } else {
        entity.rateCount = entity.rate = 0
      }
      entity.id = doc.id
      if (search === '') {
        productsData.push(entity)
      } else if (entity.username && entity.username.toLowerCase().indexOf(search.toLowerCase()) > -1) {
        productsData.push(entity)
      }
    })
    setProducts(productsData)
    setLoading(false)
  }

  const Error = (error) => {
    setLoading(false)
    console.log('loadData =>', error)
  }

  const loadData = () => {
    setLoading(true)
    Firestore.collection('users')
      .where('isDispensary', '==', true)
      .get().then(Success).catch(Error)
  }

  const onSearchOption = () => {
    ActionSheet.show(
      {
        options: LAYOUT.MapSearch,
        title: "Search options"
      },
      index => {
        if (index == 0) {
          setMiles(50)
        } else if (index == 1) {
          setMiles(100)
        } else if (index == 2) {
          setMiles(200)
        } else {
          setMiles(null)
        }
      }
    )
  }

  const calculate = (e) => {
    const pdis = getDistance({ latitude: e.lat, longitude: e.lon }, position)
    if (pdis * 0.000621 <= miles)
      return true
    return false
  }

  useEffect(() => {
    loadData()
  }, [navigation, search])

  useEffect(() => {
    navigation.addListener('focus', loadData)
  }, [])

  return (
    <Container style={[S.BKBase]}>
      <Header
        style={[S.Header, { height: normalize(100) }]}
        androidStatusBarColor={COLOR.StatusBarColor}
        iosBarStyle={COLOR.StatusBarColor}
      >
        <View style={[S.titleCover]}>
          <Title style={[S.F20, S.FW700]}>Dispensaries</Title>
        </View>
        <View style={[S.BKHeader, S.ROW, { height: normalize(45), flex: 1 }]}>
          <InputGroup style={[S.headerInputGroup]}>
            <Icon name="search" type='Fontisto' style={[S.F20, S.CLText]} />
            <Input
              value={search}
              onChangeText={setSearch}
              autoCapitalize={'none'}
              placeholder="Search"
              placeholderTextColor={COLOR.TextColor}
              style={[S.F18, S.FW700, S.CLText]}
            />
            <TouchableOpacity onPress={onSearchOption}>
              <Icon name="equalizer" type='SimpleLineIcons' style={[S.PL10, S.F20, S.CLText]} />
            </TouchableOpacity>
          </InputGroup>
          <TouchableOpacity style={[S.Jcenter, S.MB10, S.PL10]} onPress={() => navigation.navigate('MapsScreen')}>
            <Image source={Images.map} style={[S.settingIcon]} />
          </TouchableOpacity>
        </View>
      </Header>
      {loading && <Loading />}
      {!loading && products.length == 0 && <Content />}
      {!loading && products.length > 0 && (
        <FlatList
          data={products}
          refreshing={loading}
          onRefresh={loadData}
          contentContainerStyle={[S.PH15, S.PV15]}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => `${index}`}
          renderItem={({ item }) => (
            miles ?
              (calculate(item) && <DispensaryItem item={item} map />) :
              <DispensaryItem item={item} map />
          )}
        />
      )}
    </Container>
  )
}

export default Dispensaries

const S = StyleSheet.create({ ...Styles })

