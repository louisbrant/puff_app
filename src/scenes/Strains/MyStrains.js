import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { StyleSheet, Image, FlatList, Alert } from 'react-native'
import { Container, Icon, Content, Input, Text, InputGroup, View, Header, Title, ActionSheet } from 'native-base'
import normalize from 'react-native-normalize'
import { COLOR, Styles, Firestore, LAYOUT, Storage } from "../../constants"
import { Loading } from '../../components'
import { TouchableOpacity } from 'react-native-gesture-handler'
import Rating from '../../components/Rating'

const MyStrainsScreen = ({ navigation }) => {
  const { user } = useSelector(state => state.auth)
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
        entity.rateCount = 0
        entity.rate = 0
      }
      entity.id = doc.id
      if (search === '') {
        productsData.push(entity)
      } else if (entity.name.toLowerCase().indexOf(search.toLowerCase()) > -1) {
        productsData.push(entity)
      }
    })
    productsData.sort((a, b) => b.rateSum - a.rateSum)
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
      Firestore.collection('strains')
        .where('dispensary_id', '==', user.uid)
        .get().then(Success).catch(Error)

    } else {
      Firestore.collection('strains')
        .where('dispensary_id', '==', user.uid)
        .where('details', '==', searchOption)
        .get().then(Success).catch(Error)
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

  const remove = async (ref) => {
    Storage.child('strains').child(ref).delete().then(() => {
      console.log('photo remove success')
    }).catch(err => {
      console.log(err.message)
    })
  }

  const removeStrain = (item) => {
    Alert.alert(
      "Alert",
      "Do you really want to remove it?",
      [
        {
          text: "No",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        {
          text: "Yes", onPress: () => {
            Firestore.collection('strains').doc(item.id).delete().then(() => {
              loadData()
              remove(item.photoRef)
            }).catch(err => {
              console.log(err.message)
            })
          }
        }
      ],
      { cancelable: false }
    )
  }

  useEffect(() => {
    loadData()
  }, [searchOption, search, navigation])

  useEffect(() => {
    navigation.addListener('focus', loadData)
  }, [])

  return (
    <Container>
      <Header
        style={[S.Header, { height: normalize(100) }]}
        androidStatusBarColor={COLOR.StatusBarColor}
        iosBarStyle={COLOR.StatusBarColor}
      >
        <View style={[S.titleCover]}>
          <Title style={[S.F20, S.FW700]}>My Strains</Title>
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
          <TouchableOpacity style={[S.Jcenter, S.MB10, S.PL10]} onPress={() => navigation.navigate('StrainCreateScreen')}>
            <Icon name="add-circle-outline" type='MaterialIcons' style={[S.F35, S.CLW]} />
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
          contentContainerStyle={[S.BKW]}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => `${index}`}
          renderItem={({ item }) => (
            <View style={[S.PH20, S.PT25, S.Acenter]}>
              <TouchableOpacity style={[S.ROW]} onPress={() => navigation.navigate('StrainProfileScreen', item)}>
                {item && item.photo ? <Image source={{ uri: item.photo }} style={[S.productIcon, { resizeMode: 'center' }]} /> : null}
                <View style={[S.PH20, S.detailsBox]}>
                  <View style={[S.ROW, S.Acenter]}>
                    <Rating isDisabled={true} defaultRating={item && item.rate ? item.rate : 0} showRating={false} size={normalize(20)} />
                    <Text style={[S.F14, S.FW400, S.CLGY]}> {item.rateCount}</Text>
                  </View>
                  <Text style={[S.F18, S.FW700, S.CLB]} numberOfLines={1}>{item.name}</Text>
                  <Text style={[S.F14, S.FW400, S.CLGY]} numberOfLines={2}>{item.description}</Text>
                </View>
              </TouchableOpacity>
              <View style={[S.ROW, S.Jend, S.W100P, S.PH10]}>
                <TouchableOpacity onPress={() => navigation.navigate('StrainCreateScreen', { ...item, update: true })}>
                  <Icon name="edit" type='Feather' style={[S.F24, S.CLinfo]} />
                </TouchableOpacity >
                <TouchableOpacity style={[S.ML15]} onPress={() => removeStrain(item)}>
                  <Icon name="trash-2" type='Feather' style={[S.F24, S.CLDanger]} />
                </TouchableOpacity>
              </View>
              <View style={[S.MT10, S.hr]} />
            </View>
          )}
        />
      )}
    </Container>
  )
}
const S = StyleSheet.create({
  ...Styles,
  detailsBox: {
    justifyContent: "center",
    paddingVertical: normalize(5),
    width: LAYOUT.window.width * 0.68
  },
  hr: {
    borderBottomWidth: 0.5,
    borderColor: COLOR.BorderColor,
    width: '100%'
  },
})

export default MyStrainsScreen