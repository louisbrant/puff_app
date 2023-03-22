import React, { useEffect, useState } from 'react'
import { StyleSheet, TouchableOpacity, FlatList } from 'react-native'
import { Container, Icon, Input, View, InputGroup, Header, Title, Content, ActionSheet } from 'native-base'
import normalize from 'react-native-normalize'
import { COLOR, Styles, Firestore, LAYOUT } from '../../constants'
import { ProductItem, Loading } from '../../components'

const TrendingStrains = ({ navigation }) => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [searchOption, setSearchOption] = useState('')

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
      } else if (entity.name.toLowerCase().indexOf(search.toLowerCase()) > -1) {
        productsData.push(entity)
      }
    })
    productsData.sort((a, b) => (b.users_wishlist ? b.users_wishlist.length : 0) - (a.users_wishlist ? a.users_wishlist.length : 0))
    setProducts(productsData)
    setLoading(false)
  }

  const Error = (error) => {
    console.log("loadData => ", error)
    setLoading(false)
  }

  const loadData = () => {
    setLoading(true)
    if (searchOption == 'Clear' || searchOption == '' || searchOption == undefined) {
      Firestore.collection('strains').get().then(Success).catch(Error)
    } else {
      Firestore.collection('strains').where('details', '==', searchOption).get().then(Success).catch(Error)
    }
  }

  const onSearchOption = () => {
    ActionSheet.show(
      {
        options: LAYOUT.Search,
        title: "Search options"
      },
      index => setSearchOption(LAYOUT.Search[index])
    )
  }

  useEffect(() => {
    loadData()
  }, [searchOption, search, navigation])

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
          <Title style={[S.F20, S.FW700]}>Trending Strains     </Title>
          <View />
        </View>
        <View style={[S.BKHeader, S.ROW, { height: normalize(45), flex: 1 }]}>
          <InputGroup style={[S.headerInputGroup]}>
            <Icon name="search" type='Fontisto' style={[S.F20, S.CLText]} />
            <Input
              value={search}
              onChangeText={setSearch}
              autoCapitalize={'none'}
              placeholder="Search Strains"
              placeholderTextColor={COLOR.TextColor}
              style={[S.F18, S.FW700, S.CLText]}
            />
            <TouchableOpacity onPress={onSearchOption}>
              <Icon name="equalizer" type='SimpleLineIcons' style={[S.PL10, S.F20, S.CLText]} />
            </TouchableOpacity>
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
          renderItem={({ item }) => <ProductItem item={item} />}
        />
      )}
    </Container>
  )
}

export default TrendingStrains

const S = StyleSheet.create({ ...Styles })