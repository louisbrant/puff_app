import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { FlatList, StyleSheet, TouchableOpacity } from 'react-native'
import { Container, Icon } from 'native-base'
import { Styles, Firestore } from "../../constants"
import { ProductItem, Headers } from '../../components'

const WishlistScreen = ({ navigation }) => {
  const { user } = useSelector(state => state.auth)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)

  const loadData = () => {
    setLoading(true)
    if (user.uid) {
      Firestore.collection('users')
        .doc(user.uid)
        .collection('wishlist')
        .orderBy('createdAtSeconds', 'desc')
        .get()
        .then((querySnapshot) => {
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
            productsData.push(entity)
          })
          setLoading(false)
          setProducts(productsData)
        }).catch((error) => {
          setLoading(false)
          console.log("Error getting documents: ", error)
        })
    }
  }

  useEffect(() => {
    loadData()
  }, [navigation])

  useEffect(() => {
    navigation.addListener('focus', loadData)
  }, [])

  return (
    <Container>
      <Headers
        title='WISHLIST'
        left={
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon type='Entypo' name='chevron-thin-left' style={[S.CLW, S.F20]} />
          </TouchableOpacity>
        }
      />
      <FlatList
        data={products}
        refreshing={loading}
        style={[S.BKW]}
        onRefresh={loadData}
        contentContainerStyle={[S.PV10]}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => `${index}`}
        renderItem={({ item }) => <ProductItem item={item} />}
      />
    </Container>
  )
}

export default WishlistScreen

const S = StyleSheet.create({
  ...Styles,
})