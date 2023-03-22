import React, { Fragment, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Container, Icon, View } from 'native-base'
import { StyleSheet, TouchableOpacity, Text, Image, Alert, FlatList } from 'react-native'
import normalize from 'react-native-normalize'
import { Dispensary, Headers, Loading, ProductItem } from '../../components'
import { Styles, firebase, Firestore } from "../../constants"
import Rating from '../../components/Rating'

const DispensaryScreen = ({ navigation, route: { params } }) => {
  const { user } = useSelector(state => state.auth)
  const [products, setProducts] = useState([])
  const [entities, setEntities] = useState({})
  const [isFollow, setIsFollow] = useState(false)
  const [loading, setLoading] = useState(false)

  const onFollow = () => {
    const uid = user.uid
    if (!isFollow) {
      Firestore.collection('users').doc(params.id).update({
        follows: firebase.firestore.FieldValue.arrayUnion(uid)
      }).then(() => {
        setIsFollow(!isFollow)
      }).catch((err) => {
        console.log(`Rating for this strain - Error: ${err}`)
      })
    } else {
      Firestore.collection('users').doc(params.id).update({
        follows: firebase.firestore.FieldValue.arrayRemove(uid)
      }).then(() => {
        setIsFollow(!isFollow)
      }).catch((err) => {
        console.log(`Rating for this strain - Error: ${err}`)
      })
    }
  }

  const updateStrainRating = (e) => {
    const uid = user.uid
    const content = { ratings: { [uid]: e } }
    Firestore.collection("users").doc(params.id).set(content, { merge: true }).then(() => {
      Alert.alert(
        'New Rating',
        'Rating Succesfully Submitted',
        [
          { text: 'Dismiss', onPress: () => { console.log('Ratring for this strain - Success!!') } }
        ],
        { cancelable: false }
      )
    }).catch((err) => {
      console.log(`Rating for this strain - Error: ${err}`)
    })
  }

  const loadData = () => {
    setLoading(true)
    Firestore.collection('strains')
      .where('dispensary_id', '==', params.id)
      .get()
      .then(querySnapshot => {
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
          productsData.push(entity)
        })
        setProducts(productsData)
        setLoading(false)
      }).catch((error) => {
        console.log(error)
        setLoading(false)
      })
    Firestore.collection('users').doc(params.uid).get().then(postSnap => {
      const entity = postSnap.data()
      if (entity.ratings && Object.keys(entity.ratings).length) {
        let ratings = Object.values(entity.ratings)
        let rate = ratings.reduce((a, b) => a + b) / ratings.length
        entity.rateCount = ratings.length
        entity.rate = rate
      } else {
        entity.rateCount = entity.rate = 0
      }
      entity.id = postSnap.id
      if (entity.follows && entity.follows.indexOf(user.uid) > -1) {
        entity.isFollow = true
      } else {
        entity.isFollow = false
      }
      setEntities(entity)
    })
  }

  useEffect(() => {
    loadData()
  }, [params])

  return (
    <Container style={[S.BKBase]}>
      <Headers
        title='Dispensary'
        left={
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon type='Entypo' name='chevron-thin-left' style={[S.CLW, S.F20]} />
          </TouchableOpacity>
        }
      />
      {
        Object.keys(entities).length > 1 ?
          <Fragment>
            <View style={[S.BKW, S.PB10]}>
              <Text style={[S.F18, S.FW700, S.CLG, S.PL25, S.MT20]}>FIND IT</Text>
              <Dispensary item={entities} show />
              <View style={[S.Aend]}>
                {
                  user.isDispensary ? null :
                    <TouchableOpacity style={[S.BKSuccess, S.MH20, S.Radius5]} onPress={onFollow}>
                      <Text style={[S.F14, S.FW400, S.Tcenter, S.PH10, S.PV5, S.CLW]}>
                        {isFollow ? 'Followed' : 'Follow'}
                      </Text>
                    </TouchableOpacity>
                }
              </View>
            </View>
            <View style={[S.ROW, S.PH20, S.PV10, S.MT10, S.BKW, S.Acenter, S.Jbetween]}>
              <Text style={[S.F18, S.FW700, S.CLG]}>RATING</Text>
              <Rating
                defaultRating={entities.ratings && entities.ratings[user.uid] ? entities.ratings[user.uid].toFixed(1) : '0.0'}
                showRating={false}
                size={normalize(28)}
                isDispensary={true}
                selectedColor='#f1c40f'
                onFinishRating={updateStrainRating}
                style={[S.PH15]}
              />
            </View>
            <View style={[S.P20, S.BKW, S.MT10]}>
              <View style={[S.ROW, S.Jbetween]}>
                <View style={[S.ROW]}>
                  <Text style={[S.F18, S.FW700, S.CLG]}>PHOTOS  </Text>
                  <Text style={[S.F18, S.CLGY]}>({entities.images ? entities.images.length : 0} Photos)</Text>
                </View>
                <TouchableOpacity onPress={() => navigation.navigate('MyPhotosScreen', entities)}>
                  <Text style={[S.F18, S.FW700, S.CLinfo]}>SEE ALL</Text>
                </TouchableOpacity>
              </View>
              {
                entities.images && entities.images.length ?
                  <View style={[S.ROW, S.PT10]}>
                    {entities.images.slice(0, 4).map((item, key) => (
                      <Image source={{ uri: item }} style={[S.icons, S.MR20]} key={key} />
                    ))}
                    {
                      entities.images.length > 4 ?
                        <TouchableOpacity style={[S.icons, S.BKBase, S.Jcenter, S.Acenter]} onPress={() => navigation.navigate('MyPhotosScreen', entities)}>
                          <Text style={[S.F13, S.FW700, S.CLIcon]}>{'View\nMore'}</Text>
                        </TouchableOpacity> : null
                    }
                  </View> : null
              }
            </View>
            {
              products.length ?
                <View style={[S.PH20, S.PT10, S.MT10, S.BKW]}>
                  <Text style={[S.F18, S.FW700, S.CLG]}>MENU</Text>
                </View>
                : null
            }
            <FlatList
              data={products}
              style={[S.BKW]}
              contentContainerStyle={S.PH20}
              refreshing={loading}
              onRefresh={loadData}
              contentContainerStyle={[S.PH15, S.PV15]}
              showsVerticalScrollIndicator={false}
              keyExtractor={(item, index) => `${index}`}
              renderItem={({ item }) => <ProductItem item={item} />}
            />
          </Fragment> : <Loading />
      }
    </Container>
  )
}
export default DispensaryScreen
const S = StyleSheet.create({
  ...Styles,
})