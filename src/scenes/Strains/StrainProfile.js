import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import normalize from 'react-native-normalize'
import { StyleSheet, TouchableOpacity, Image, Text, ActivityIndicator } from 'react-native'
import { Container, Icon, Content, View } from 'native-base'
import { COLOR, Styles, Images, Firestore, FieldValue } from "../../constants"
import { Headers, Loading } from '../../components'
import { GetDate } from '../../redux/actions/authActions'
import Rating from '../../components/Rating'

const StrainProfileScreen = ({ navigation, route: { params } }) => {
  const { user } = useSelector(state => state.auth)
  const [currentData, setCurrentData] = useState({})
  const [myRate, setMyRate] = useState(0)
  const [isSelected, setIsSelected] = useState(false)
  const [loading, setLoading] = useState(false)
  const [background, setBackground] = useState(Images.background_image)

  const Error = (error) => {
    console.log(error)
    setLoading(false)
  }

  const deleteWishlist = () => {
    Firestore.collection('strains')
      .doc(currentData.id)
      .update({
        users_wishlist: FieldValue.arrayRemove(user.uid)
      }).then(() => {
        Firestore.collection("users")
          .doc(user.uid)
          .collection("wishlist")
          .doc(currentData.id)
          .delete()
          .then(() => {
            loadData()
          }).catch(Error)
      }).catch(Error)
  }

  const addWishlist = () => {
    const content = {
      strain_id: currentData.id,
      name: currentData.name,
      details: currentData.details,
      guide: currentData.guide === undefined ? '' : currentData.guide,
      description: currentData.description,
      ratings: currentData.ratings ? currentData.ratings : [],
      photo: currentData.photo,
      CBD: currentData.CBD,
      THC: currentData.THC,
      dispensary_id: currentData.dispensary_id,
      ...GetDate()
    }
    Firestore.collection('strains')
      .doc(currentData.id)
      .update({
        users_wishlist: FieldValue.arrayUnion(user.uid)
      })
      .then(() => {
        Firestore.collection("users")
          .doc(user.uid)
          .collection("wishlist")
          .doc(currentData.id)
          .set(content, { merge: true })
          .then(() => {
            loadData()
          }).catch(Error)
      }).catch(Error)
  }


  const onWishList = () => {
    if (isSelected) {
      deleteWishlist()
    } else {
      addWishlist()
    }
  }

  const loadData = () => {
    const uid = user.uid
    Firestore.collection('strains')
      .doc(params.id)
      .get()
      .then(doc => {
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
        setCurrentData(entity)
        if (entity.users_wishlist && entity.users_wishlist.indexOf(uid) > -1) {
          setIsSelected(true)
        } else {
          setIsSelected(false)
        }
        if (entity.ratings && entity.ratings[uid]) {
          setMyRate(entity.ratings[uid])
        } else {
          setMyRate(0)
        }
        if (entity.background && entity.background[uid]) {
          setBackground(entity.background[uid])
        } else {
          setBackground(Images.background_image)
        }
      })
  }

  useEffect(() => {
    loadData()
  }, [params])

  return (
    <Container>
      <Headers
        title='Strain Profile'
        left={
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon type='Entypo' name='chevron-thin-left' style={[S.CLW, S.F20]} />
          </TouchableOpacity>
        }
      />
      {
        Object.keys(currentData).length > 1 ?
          <Content style={[S.BKW]} showsVerticalScrollIndicator={false}>
            <View>
              <Image source={{ uri: background }} style={[S.W100P, S.H200]} />
              <View style={[S.PH20]}>
                <View style={[S.BoxShadow, S.BKW, S.borderStyle]}>
                  <View style={[S.PH20, S.PT5, S.Acenter]}>
                    <View style={[S.ROW, S.Acenter, S.PV10, S.W100P]}>
                      <Image source={{ uri: currentData.photo }} style={[S.infoIcon, S.MT5]} />
                      <View style={[S.PH20, S.Jbetween]}>
                        <Text style={[S.F16, S.FW700, S.CLB]}>{currentData.name}</Text>
                        <View style={[S.ROW, S.Acenter, S.MT10]}>
                          <Text style={[S.F13, S.CLGY]}>{currentData.details}</Text>
                          <Icon name='chevron-thin-right' type='Entypo' style={[S.CLGY, S.F13]} />
                        </View>
                      </View>
                    </View>
                  </View>
                  <View style={[S.ROW, S.Acenter, S.Jbetween, S.W100P, { borderTopWidth: 1, borderColor: COLOR.greyColor }]}>
                    <TouchableOpacity
                      style={[S.ROW, S.Acenter, S.Jcenter, S.MV10, S.H100P, { width: '49%' }]}
                      onPress={() => navigation.navigate('MapsScreen', { isFindit: true })}
                    >
                      <Image source={Images.find} style={[S.carIcon]} />
                      <Text style={[S.CLBL, S.F13]}>  Find It  </Text>
                    </TouchableOpacity>
                    <View style={[S.H100P, S.M0, { borderLeftWidth: 1, borderColor: COLOR.greyColor, width: '2%' }]} />
                    <TouchableOpacity
                      disabled={loading}
                      onPress={onWishList}
                      style={[S.ROW, S.Acenter, S.Jcenter, S.MV10, S.H100P, { width: '49%' }]}
                    >
                      {loading ?
                        <ActivityIndicator animating={true} size="small" color={COLOR.greenColor} /> :
                        <Icon name={isSelected ? 'heart' : 'hearto'} type='AntDesign' style={[S.F20, S.CLDanger]} />
                      }
                      <Text style={[S.CLBL, S.F13]}>  Add to WishList  </Text>
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity
                    style={[S.BKBule, S.PV10, S.Acenter]}
                    onPress={() => navigation.navigate('RateStrainScreen', { id: currentData.id })}
                  >
                    <Text style={[S.CLW, S.F13]}>RATE IT</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={[S.PH20, S.PT10, S.Acenter]}>
                <Text style={[S.F18, S.FW700, S.CLIcon, S.Tleft, S.W100P]}>DETAILS</Text>
                <View style={[S.ROW, S.W100P, S.Jbetween, S.MT10]}>
                  <View style={[S.ROW, S.Acenter]}>
                    <Text style={[S.F16, S.CLIcon, S.FW700]}>YOU</Text>
                    <Icon name='chevron-thin-right' type='Entypo' style={[S.CLIcon, S.F16]} />
                    <Text style={[S.F16, S.CLIcon]}> My Rating</Text>
                  </View>
                  <View style={[S.ROW]}>
                    <Rating
                      isDisabled
                      defaultRating={myRate}
                      showRating={false}
                      size={normalize(20)}
                    />
                    <Text style={[S.F16, S.CLIcon, S.FW700]}>
                      {myRate.toFixed(1)}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            <View style={[S.BKW, S.PH20]}>
              <View style={[S.ROW, S.MT10, S.Acenter]}>
                <Text style={[S.F18, S.FW700, S.CLIcon]}>DETAILS</Text>
                <Icon name='chevron-thin-right' type='Entypo' style={[S.CLIcon, S.F13]} />
                <Text style={[S.F18, S.FW700, S.CLIcon]}>  {currentData.details}</Text>
              </View>
              <View style={[S.ROW, S.MT10, S.Acenter]}>
                <Text style={[S.F18, S.FW700, S.CLIcon]}>GUIDE</Text>
                <Icon name='chevron-thin-right' type='Entypo' style={[S.CLIcon, S.F13]} />
                <Text style={[S.F18, S.FW700, S.CLIcon]}>  {currentData.guide}</Text>
              </View>
              <Text style={[S.F13, S.CLIcon, S.MT10]}>{currentData.description}</Text>
            </View>
            <View style={[S.PV10, S.Jaround]}>
              <View style={[S.ROW, S.Jaround]}>
                <View style={[S.P5, S.Acenter]}>
                  <Text style={[S.F14, S.FW700, S.CLIcon]}>DELTA CONTENT</Text>
                  <Text style={[S.F22, S.FW700, S.CLIcon]}>{`${currentData?.delta} ${currentData?.deltaUnit}`}</Text>
                </View>
                <View style={[S.P5, S.Acenter]}>
                  <Text style={[S.F14, S.FW700, S.CLIcon]}>DELTA 8 CONTENT</Text>
                  <Text style={[S.F22, S.FW700, S.CLIcon]}>{`${currentData?.delta8} ${currentData?.delta8Unit}`}</Text>
                </View>
              </View>
              <View style={[S.MT10, S.ROW, S.Jaround]}>
                <View style={[S.P5, S.Acenter]}>
                  <Text style={[S.F14, S.FW700, S.CLIcon]}>THC CONTENT</Text>
                  <Text style={[S.F22, S.FW700, S.CLIcon]}>{`${currentData?.THC} ${currentData?.THCUnit}`}</Text>
                </View>
                <View style={[S.P5, S.Acenter]}>
                  <Text style={[S.F14, S.FW700, S.CLIcon]}>CBD CONTENT</Text>
                  <Text style={[S.F22, S.FW700, S.CLIcon]}>{`${currentData?.CBD} ${currentData?.CBDUnit}`}</Text>
                </View>
              </View>
            </View>
          </Content>
          : <Loading />
      }
    </Container>
  )
}

export default StrainProfileScreen

const S = StyleSheet.create({
  ...Styles,
  borderStyle: {
    borderWidth: 2,
    borderColor: COLOR.blueColor,
    borderRadius: normalize(15),
    marginTop: -normalize(80),
    overflow: 'hidden'
  }
})