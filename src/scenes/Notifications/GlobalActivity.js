import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { StyleSheet, TouchableOpacity, Text, Image, FlatList } from 'react-native'
import { Container, Icon, View } from 'native-base'
import TimeAgo from 'react-native-timeago'
import normalize from 'react-native-normalize'
import StyledText from 'react-native-styled-text'
import Rating from '../../components/Rating'
import { Headers, HRs } from '../../components'
import { GetDate, GetDate1 } from '../../redux/actions/authActions'
import { getRating, getMyLikedBy } from '../../redux/actions/rootActions'
import { COLOR, Styles, Images, Firestore, FieldValue } from "../../constants"
import { addNotification } from '../../redux/actions/notificationsActions'

const GlobalActivity = ({ navigation, route: { params } }) => {
  const { user } = useSelector(state => state.auth)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)

  const Error = (error) => {
    console.log("loadData => ", error)
    setLoading(false)
  }

  const Success = (userSnap) => {
    Firestore.collection('posts')
      .doc(params.data)
      .get()
      .then(postSnap => {
        const entity = getRating(postSnap.data())
        entity.id = postSnap.id
        if (entity.likedBy && entity.likedBy.length) {
          const users = []
          userSnap.forEach(doc => {
            const user = doc.data()
            if (entity.likedBy.indexOf(doc.id) > -1)
              users.push({ first_name: user.first_name, last_name: user.last_name })
          })
          entity.myLikedBy = getMyLikedBy(users)
        } else {
          entity.myLikedBy = ''
        }
        setProducts([entity])
        setLoading(false)
      }).catch(Error)
  }

  const loadData = () => {
    setLoading(true)
    Firestore.collection('users')
      .where('isDispensary', '==', false)
      .get().then(Success).catch(Error)
  }

  const AddNotifications = (id) => {
    Firestore.collection('users')
      .where('isDispensary', '==', false)
      .get()
      .then(snapshot => {
        const UserList = []
        snapshot.forEach(async doc => {
          if (doc.id != user.uid)
            UserList.push(doc.id)
        })
        for (const key in UserList) {
          addNotification({
            id: UserList[key] + GetDate().createdAtSeconds,
            type: 'puffs',
            message: `The user <b>${user.username}</b> has passed puffs to strain.`,
            see: false,
            sender: user.uid,
            image: user.profile_image,
            receiver: UserList[key],
            data: id,
            ...GetDate()
          })
        }
      }).catch(error => {
        console.log("Getting documents error: ", error)
      })
  }

  const RemoveNotifications = async (id) => {
    const batch = Firestore.batch()
    const snapshots = await Firestore.collection('notifications')
      .where('type', '==', 'puffs')
      .where('sender', '==', user.uid)
      .where('data', '==', id)
      .get()
    snapshots.forEach(doc => batch.delete(doc.ref))
    return batch.commit()
  }

  const onLikedBy = (e) => {
    const { uid } = user
    if (e.likedBy && e.likedBy.indexOf(uid) > -1) {
      Firestore.collection('posts')
        .doc(e.id)
        .update({ likedBy: FieldValue.arrayRemove(uid) })
        .then(() => {
          RemoveNotifications(e.id).then(() => console.log('All users deleted in a single batch operation.'))
          loadData(false)
        })
        .catch(Error)
    } else {
      Firestore.collection('posts')
        .doc(e.id)
        .update({ likedBy: FieldValue.arrayUnion(uid) })
        .then(() => {
          AddNotifications(e.id)
          loadData(false)
        }).catch(Error)
    }
  }

  useEffect(() => {
    loadData()
  }, [params])

  return (
    <Container style={[S.BKBase]}>
      <Headers
        title='Global Feed'
        left={
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon type='Entypo' name='chevron-thin-left' style={[S.CLW, S.F20]} />
          </TouchableOpacity>
        }
      />
      <FlatList
        data={products}
        refreshing={loading}
        onRefresh={loadData}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => `${index}`}
        renderItem={({ item }) => (
          <View style={[S.BKW]}>
            {
              item.background == '' ? <Image source={{ uri: Images.background_image }} style={[S.W100P, S.H200]} /> :
                <Image source={{ uri: item.background }} style={[S.W100P, S.H200]} />
            }
            <View style={[S.ROW, S.Acenter, S.P20, S.PABS, S.W100P, S.Jbetween, { flex: 1 }]}>
              <View style={[S.ROW, S.Acenter, S.Jbetween]}>
                <View style={[S.Hidden, S.H50, S.Acenter, S.Jcenter, { borderWidth: 2, borderColor: COLOR.info, width: normalize(50), borderRadius: normalize(25) }]}>
                  {item.users_profile ?
                    <Image source={{ uri: item.users_profile }} style={[{ width: normalize(50), height: normalize(50), resizeMode: 'cover' }]} /> : null}
                </View>
                <View style={[S.ROW, S.Acenter, S.PL10]}>
                  <Text style={[S.CLW, S.F16, S.FW700]}>{item.users_name}</Text>
                  <Icon name='chevron-thin-right' type='Entypo' style={[S.CLW, S.F13]} />
                </View>
              </View>
              <TouchableOpacity>
                <Icon name='dots-three-horizontal' type='Entypo' style={[S.CLW, S.F30]} />
              </TouchableOpacity>
            </View>
            <View style={[S.PH20]}>
              <View style={[S.BoxShadow, S.BKW, S.Hidden, { borderWidth: 2, borderColor: COLOR.blueColor, borderRadius: normalize(15), marginTop: -normalize(70) }]}>
                <View style={[S.PH20, S.PT5, S.Acenter]}>
                  <View style={[S.ROW, S.Acenter, S.PV10, S.W100P]}>
                    <Image source={{ uri: item.photo }} style={[S.infoIcon, S.MT5]} />
                    <View style={[S.PH20, S.Jbetween]}>
                      <Text style={[S.F16, S.FW700, S.CLB]}>{item.name}</Text>
                      <Text style={[S.F15, S.CLGY]}>{item.details}</Text>
                      <Text style={[S.F15, S.CLGY]}>{item.rdescription}</Text>
                    </View>
                  </View>
                </View>
                <View style={[S.ROW, S.PH20, S.Acenter, S.PB10, S.Jbetween]}>
                  <View style={[S.ROW]}>
                    <Rating
                      isDisabled
                      defaultRating={item.ratings}
                      showRating={false}
                      size={normalize(15)}
                    />
                    <Text style={[S.F16, S.FW700, S.CLG]}>{item.ratings.toFixed(1)}</Text>
                  </View>
                </View>
                <View style={[S.ROW, S.Acenter, S.Jbetween, S.W100P, { borderTopWidth: 1, borderColor: COLOR.greyColor }]}>
                  <TouchableOpacity style={[S.ROW, S.Acenter, S.Jcenter, S.MV10, { width: '49%' }]} onPress={() => navigation.navigate('CommentScreen', item)}>
                    <Image source={Images.comment} style={[S.carIcon]} />
                    <Text style={[S.CLBL, S.F15]}>  Comment</Text>
                  </TouchableOpacity>
                  <View style={[S.MT10, { borderLeftWidth: 1, borderColor: COLOR.greyColor, marginTop: 0, width: '2%', height: '100%' }]} />
                  <TouchableOpacity style={[S.ROW, S.Acenter, S.Jcenter, S.MV10, { width: '49%' }]} onPress={() => onLikedBy(item)}>
                    <Image source={Images.Puffs} style={[S.carIcon]} />
                    <Text style={[S.CLBL, S.F15]}>  Pass Puffs</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View style={[S.PH20, S.MT10, S.ROW, S.Jbetween, S.W100P]}>
              <Text style={[S.F16, S.CLGY]}><TimeAgo time={GetDate1(item.createdAtSeconds)} interval={20000} /></Text>
            </View>
            <HRs pro={100} />
            {
              item.myLikedBy ?
                <View style={[S.PH20, S.ROW, S.Acenter, S.MB10]}>
                  <TouchableOpacity style={[S.ROW, S.Acenter, S.Jcenter]} >
                    <Image source={Images.Puffs} style={[S.carIcon]} />
                    <StyledText style={[S.CLGY5, S.F15, S.PL10]}>{item.myLikedBy}</StyledText>
                  </TouchableOpacity>
                </View> : null
            }
          </View>
        )}
      />
    </Container>
  )

}

export default GlobalActivity

const S = StyleSheet.create(Styles)