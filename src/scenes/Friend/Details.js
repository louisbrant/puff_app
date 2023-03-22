import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { StyleSheet, Text, View, TouchableOpacity, Image, ImageBackground } from 'react-native'
import { Container, Icon, Content } from 'native-base'
import normalize from 'react-native-normalize'
import { RemoveInvite, InviteFriend } from '../../redux/actions/friendActions'
import { Headers, Loading, ProductItem } from '../../components'
import { Images, Styles, COLOR, Firestore, LAYOUT, Database } from "../../constants"

const width = (LAYOUT.window.width - normalize(110)) / 2

const FriendDetailsScreen = ({ navigation, route: { params } }) => {
  const dispatch = useDispatch()
  const { user } = useSelector(state => state.auth)
  const [products, setProducts] = useState([])
  const [userState, setUserState] = useState({})
  const [userInfo, setUserInfo] = useState({})
  const [checkIns, setCheckIns] = useState(0)

  const loadData = () => {
    Database.ref('user').on('value', snapshot => {
      setUserState(snapshot.val())
    })
    const uid = params.user.uid
    Firestore.collection('strains')
      .get()
      .then((snapshot) => {
        const productsData = []
        snapshot.forEach(doc => {
          const entity = doc.data()
          if (entity.ratings && entity.ratings[uid]) {
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
          }
        })
        setProducts(productsData)
      }).catch(error => {
        console.log("Getting documents error: ", error)
      })

    Firestore.collection('users')
      .doc(params.user.uid)
      .collection('wishlist')
      .orderBy('createdAtSeconds', 'desc')
      .get()
      .then(doc => {
        setCheckIns(doc.size)
      })
      .catch(error => console.log(error))

    Firestore.collection('users').doc(params.user.uid).get().then(postSnap => {
      const entity = postSnap.data()
      if (entity.ratings && Object.keys(entity.ratings).length) {
        let ratings = Object.values(entity.ratings)
        let rate = ratings.reduce((a, b) => a + b) / ratings.length
        entity.rateCount = ratings.length
        entity.rate = rate
      } else {
        entity.rateCount = entity.rate = 0
      }
      setUserInfo(entity)
    })
  }

  useEffect(() => {
    loadData()
  }, [params])

  const isfriend = user.inviteFriends ? user.inviteFriends.indexOf(params.user.uid) > -1 : false

  return (
    <Container>
      <Headers
        title={userInfo.username}
        left={
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon type='Entypo' name='chevron-thin-left' style={[S.CLW, S.F20]} />
          </TouchableOpacity>
        }
      />
      {
        Object.keys(userInfo).length ?
          <Content style={[S.BKBase]} showsVerticalScrollIndicator={false}>
            <ImageBackground style={[S.H100P]} source={Images.img_profile_back} resizeMode="cover">
              <View style={[S.ROW, S.MT20, S.Acenter, S.PV10, S.Jbetween]}>
                <View style={[S.Aend, { width }]}>
                  <Text style={[S.CLBorder, S.F14, S.FW700]}>CHECK-INS</Text>
                  <Text style={[S.CLW, S.F18, S.FW700]}>{checkIns}</Text>
                </View>
                <View style={[S.avatar1, S.avatarBorder]}>
                  <Image source={{ uri: userInfo.profile_image }} style={[S.avatar1]} />
                  <Icon
                    type="FontAwesome"
                    name="circle"
                    style={[S.userState1, { color: userState[userInfo.uid] && userState[userInfo.uid] === true ? COLOR.success : COLOR.danger }]}
                  />
                </View>
                <View style={[S.Astart, { width }]}>
                  <Text style={[S.CLBorder, S.F14, S.FW700]}>CHECK-INS</Text>
                  <Text style={[S.CLW, S.F18, S.FW700]}>{checkIns}</Text>
                </View>
              </View>
              <View style={[S.Acenter, S.MB20]}>
                <Text style={[S.CLW, S.F18, S.FW700]}>{userInfo.username}</Text>
                <View style={[S.ROW, S.MV10]}>
                  <Icon name="location" type='EvilIcons' style={[S.F30, S.CLW, S.PL10]} />
                  <Text style={[S.CLW, S.F18]}>{userInfo.location ? userInfo.location : 'No Location'}     </Text>
                </View>
                {
                  !params.unshow && !params.isFriend ? isfriend ?
                    <TouchableOpacity style={[S.BKDanger, S.MH20, S.Radius5]} onPress={() => dispatch(RemoveInvite(user.uid, userInfo.uid))}>
                      <Text style={[S.F14, S.FW700, S.Tcenter, S.PH20, S.PV10, S.CLW]}>DELET FRIEND REQUEST</Text>
                    </TouchableOpacity> :
                    <TouchableOpacity style={[S.BKinfo, S.MH20, S.Radius5]} onPress={() => dispatch(InviteFriend(user.uid, userInfo.uid))}>
                      <Text style={[S.F14, S.FW700, S.Tcenter, S.PH20, S.PV10, S.CLW]}>SEND FRIEND REQUEST</Text>
                    </TouchableOpacity>
                    : null
                }
              </View>
              <View style={[S.BKBase]}>
                <View style={[S.P20, S.BKW]}>
                  <View style={[S.ROW, S.Jbetween]}>
                    <Text style={[S.F18, S.FW700, S.CLG]}>PHOTOS  </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('PhotosScreen', { ...user, isProfile: true })}>
                      <Text style={[S.F18, S.FW700, S.CLinfo]}>SEE ALL</Text>
                    </TouchableOpacity>
                  </View>
                  {
                    userInfo.images ?
                      <View style={[S.ROW, S.PT10]}>
                        {userInfo.images.map((item, key) => (
                          <React.Fragment key={key}>
                            {key < 4 ? <Image source={{ uri: item }} style={[S.icons, S.MR20]} /> : null}
                          </React.Fragment>
                        ))}
                        {
                          userInfo.images.length > 3 ?
                            <TouchableOpacity style={[S.icons, S.BKBase, S.Jcenter, S.Acenter]} onPress={() => navigation.navigate('PhotosScreen', { ...userInfo, isProfile: true })}>
                              <Text style={[S.F13, S.FW700, S.CLIcon]}>{'View\nMore'}</Text>
                            </TouchableOpacity> : null
                        }
                      </View> : null
                  }
                </View>
                <Tag title='WISHLIST' onPress={() => navigation.navigate('WishlistScreen', userInfo)} />
                {
                  products.length ?
                    <View style={[S.PH20, S.PV10, S.BKW, S.MT10]}>
                      <Text style={[S.PL5, S.F18, S.FW700, S.CLIcon]}>MY RATINGS</Text>
                      {products.map((item, key) => <ProductItem key={key} item={item} />)}
                    </View>
                    : null
                }
              </View>
            </ImageBackground>
          </Content> :
          <Loading />
      }
    </Container>
  )
}

const Tag = ({ title, onPress }) => (
  <View style={[S.BKW, S.MT10]}>
    <View style={[S.Jcenter, S.Acenter, S.PV15, S.PH15, S.W100P]}>
      <TouchableOpacity style={[S.ROW, S.Jbetween, S.Acenter, S.W100P]} onPress={onPress}>
        <Text style={[S.FW700, S.F18, S.CLIcon, S.ML10]}>{title}</Text>
        <Icon name='chevron-thin-right' type='Entypo' style={[S.CLIcon, S.F20, S.PR10]} />
      </TouchableOpacity>
    </View>
  </View>
)

const S = StyleSheet.create({
  ...Styles,
  avatarBorder: {
    borderWidth: 3,
    borderColor: COLOR.whiteColor
  }
})

export default FriendDetailsScreen
