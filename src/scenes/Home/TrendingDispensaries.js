import React, { useEffect, useState } from 'react'
import { StyleSheet, TouchableOpacity, FlatList } from 'react-native'
import { Container, Icon, Input, View, InputGroup, Header, Title, Content } from 'native-base'
import normalize from 'react-native-normalize'
import { COLOR, Styles, Firestore } from '../../constants'
import { DispensaryItem, Loading } from '../../components'

const TrendingDispensaries = ({ navigation }) => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')

  const Success = (querySnapshot) => {
    const productsData = []
    querySnapshot.forEach(doc => {
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
      if (search === '') {
        productsData.push(entity)
      } else if (entity.username && entity.username.toLowerCase().indexOf(search.toLowerCase()) > -1) {
        productsData.push(entity)
      }
    })
    productsData.sort((a, b) => (b.rateSum - a.rateSum))
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
        <View style={[S.titleCover, S.ROW, S.Jbetween]}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon type='Entypo' name='chevron-thin-left' style={[S.CLW, S.F20]} />
          </TouchableOpacity>
          <Title style={[S.F20, S.FW700]}>Trending Dispensaries     </Title>
          <View />
        </View>
        <View style={[S.BKHeader, S.ROW, { height: normalize(45), flex: 1 }]}>
          <InputGroup style={[S.headerInputGroup]}>
            <Icon name="search" type='Fontisto' style={[S.F20, S.CLText]} />
            <Input
              value={search}
              onChangeText={setSearch}
              placeholder="Search"
              autoCapitalize={'none'}
              placeholderTextColor={COLOR.TextColor}
              style={[S.F18, S.FW700, S.CLText]}
            />
          </InputGroup>
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
          renderItem={({ item }) => <DispensaryItem item={item} map={true} />}
        />
      )}
    </Container>
  )
}

export default TrendingDispensaries

const S = StyleSheet.create(Styles)