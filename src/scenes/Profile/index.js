import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { StyleSheet, Text, View, TouchableOpacity, Image, ImageBackground } from 'react-native'
import { Container, Icon, Content } from 'native-base'
import normalize from 'react-native-normalize'
import { Images, Styles, COLOR, Firestore, LAYOUT } from "../../constants"
import { Headers, Loading, ProductItem } from '../../components'
import { updateProfile } from '../../redux/actions/authActions'

const width = (LAYOUT.window.width - normalize(110)) / 2

const ProfileScreen = ({ navigation }) => {
  const dispatch = useDispatch()
  const { user } = useSelector(state => state.auth)
  const [products, setProducts] = useState([])
  const [followCount, setFollowCount] = useState(0)
  const [loading, setLoading] = useState(false)

  const loadData = () => {
    setLoading(true)
    dispatch(updateProfile())
    const uid = user.uid
    Firestore.collection('strains')
      .get()
      .then(querySnapshot => {
        const productsData = []
        querySnapshot.forEach(doc => {
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
        setLoading(false)
      }).catch((error) => {
        console.log("Error getting documents: ", error)
        setLoading(false)
      })

    Firestore.collection('users')
      .where('follows', 'array-contains', uid)
      .get()
      .then(querySnapshot => {
        setFollowCount(querySnapshot.size)
      }).catch((error) => {
        console.log("Error getting documents: ", error)
      })
  }

  useEffect(() => {
    loadData()
  }, [navigation])

  return (
    <Container>
      <Headers
        title={user.username}
        left={
          <View style={[S.ROW]}>
            <TouchableOpacity onPress={() => navigation.navigate('FriendScreen', user)}>
              <Icon type='Feather' name="users" style={[S.CLW, S.F24]} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('AddFriendScreen')} style={[S.ML10]}>
              <Icon type='Feather' name="user-plus" style={[S.CLW, S.F24]} />
            </TouchableOpacity>
          </View>
        }
        right={
          <TouchableOpacity onPress={() => navigation.navigate('SettingsScreen')}>
            <Icon type='Feather' name="settings" style={[S.CLW, S.F24]} />
          </TouchableOpacity>
        }
      />
      {
        loading ? <Loading /> :
          <Content style={[S.BKBase]} showsVerticalScrollIndicator={false}>
            <ImageBackground
              style={[S.H100P]}
              source={Images.img_profile_back}
              resizeMode="cover"
            >
              <View style={[S.ROW, S.MT20, S.Acenter, S.PV10, S.Jbetween]}>
                <View style={[S.Aend, { width }]}>
                  <Text style={[S.CLBorder, S.F14, S.FW700]}>CHECK-INS</Text>
                  <Text style={[S.CLW, S.F24, S.FW700]}>{products.length}  </Text>
                </View>
                <View style={[S.avatar, { borderWidth: 3, borderColor: COLOR.whiteColor }]}>
                  <Image source={{ uri: user.profile_image }} style={[S.avatar]} />
                </View>
                <View style={[S.Astart, { width }]}>
                  <Text style={[S.CLBorder, S.F14, S.FW700]}>FOLLOW</Text>
                  <Text style={[S.CLW, S.F24, S.FW700]}>  {followCount}</Text>
                </View>
              </View>
              <View style={[S.Acenter]}>
                <Text style={[S.CLW, S.F18, S.FW700]}>{user.username}</Text>
                <View style={[S.ROW, S.MV10]}>
                  <Icon name="location" type='EvilIcons' style={[S.F30, S.CLW, S.PL10]} />
                  <Text style={[S.CLW, S.F18]}>{user.state ? user.state : 'No Location'}     </Text>
                </View>
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
                    user.images ?
                      <View style={[S.ROW, S.PT10]}>
                        {user.images.slice(0, 4).map((item, key) => (
                          <Image key={key} source={{ uri: item }} style={[S.icons, S.MR20]} />
                        ))}
                        {
                          user.images.length > 3 ?
                            <TouchableOpacity
                              style={[S.icons, S.BKBase, S.Jcenter, S.Acenter]}
                              onPress={() => navigation.navigate('PhotosScreen', { ...user, isProfile: true })}>
                              <Text style={[S.F13, S.FW700, S.CLIcon]}>{'View\nMore'}</Text>
                            </TouchableOpacity>
                            : null
                        }
                      </View> : null
                  }
                </View>
                <Tag title='WISHLIST' onPress={() => navigation.navigate('WishlistScreen', user)} />
                {
                  products.length ?
                    <View style={[S.PH20, S.PV10, S.BKW, S.MT10]}>
                      <Text style={[S.PL5, S.F18, S.FW700, S.CLIcon]}>MY RATINGS</Text>
                      {products.map((item, key) => <ProductItem key={key} item={item} />)}
                    </View> : null
                }
              </View>
            </ImageBackground>
          </Content>
      }
    </Container>
  )
}

export default ProfileScreen

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
})