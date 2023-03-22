import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { StyleSheet, Image, View, TouchableOpacity, Text, FlatList, ActivityIndicator } from 'react-native'
import { Container, Icon, Item, Input } from 'native-base'
import normalize from 'react-native-normalize'
import TimeAgo from 'react-native-timeago'
import { GetDate1, GetDate } from '../../redux/actions/authActions'
import { COLOR, Styles, Firestore } from "../../constants"
import { Headers } from '../../components'
import { addNotification } from '../../redux/actions/notificationsActions'

const Comment = ({ navigation, route: { params } }) => {
  const { user } = useSelector(state => state.auth)
  const [comments, setComments] = useState([])
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [refresh, setRefresh] = useState(false)

  const Error = (error) => {
    console.log("loadData => ", error)
    setLoading(false)
    setRefresh(false)
  }

  const loadData = () => {
    setRefresh(true)
    Firestore.collection("posts")
      .doc(params.id)
      .collection("comments")
      .orderBy("createdAtSeconds", 'desc')
      .get()
      .then((querySnapshot) => {
        const commentsData = []
        querySnapshot.forEach(doc => {
          const entity = doc.data()
          entity.id = doc.id
          commentsData.push(entity)
        })
        setComments(commentsData)
        setRefresh(false)
      }).catch(Error)
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
            type: 'comment',
            message: `The user <b>${user.username}</b> has commented on strain.`,
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

  const sendComment = () => {
    setLoading(true)
    const { uid, profile_image } = user
    const arrayOfObjs = {
      uid,
      avatar: profile_image,
      name: user.username,
      comment: comment,
      ...GetDate()
    }
    Firestore.collection('posts')
      .doc(params.id)
      .collection('comments')
      .doc(GetDate().createdAtSeconds)
      .set(arrayOfObjs)
      .then(() => {
        Firestore.collection('maybeOwnPost')
          .doc(params.id)
          .collection('comments')
          .doc(GetDate().createdAtSeconds)
          .set(arrayOfObjs).then(() => {
            AddNotifications(params.id)
            setComment('')
            loadData()
            setLoading(false)
          }).catch(Error)
      }).catch(Error)
  }

  useEffect(() => {
    loadData()
  }, [params])

  return (
    <Container>
      <Headers
        title='Comments'
        left={
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon type='Entypo' name='chevron-thin-left' style={[S.CLW, S.F20]} />
          </TouchableOpacity>
        }
      />
      <FlatList
        data={comments}
        refreshing={refresh}
        onRefresh={loadData}
        style={[S.BKBase]}
        contentContainerStyle={[S.PH20, S.PB10]}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => `${index}`}
        renderItem={({ item }) => (
          <View style={[S.BKW, S.CLGY, S.MT20, S.PV15, S.PH20, S.BoxShadow, S.Radius5]}>
            <View style={[S.ROW]}>
              <View style={S.imageCover}>
                <Image source={{ uri: item.avatar }} style={[S.W100P, S.H100P, { resizeMode: 'contain' }]} />
              </View>
              <View style={[S.PH10, S.PV5, S.Jbetween]}>
                <View style={[S.ROW]}>
                  <Text style={[S.F14, S.CLB, S.FW700, S.MR10]}>{item.name}</Text>
                  <Text style={[S.F13, { width: normalize(180) }]}>{item.comment}</Text>
                </View>
                <Text style={[S.F13, S.CLGY]}>
                  <TimeAgo time={GetDate1(item.createdAtSeconds)} interval={20000} />
                </Text>
              </View>
            </View>
          </View>
        )}
      />
      <View style={[S.P10, S.ROW]}>
        <Item rounded style={[S.BKW, S.W100P, S.H40]}>
          <Input
            value={comment}
            onChangeText={setComment}
            placeholder='Comment'
            autoCapitalize='none'
            style={[S.CLB, S.FW400, S.F18]}
          />
          <TouchableOpacity onPress={sendComment} disabled={loading}>
            {loading ?
              <ActivityIndicator animating={true} size="small" color={COLOR.greenColor} style={S.PR20} /> :
              <Icon name='paper-plane' type='Entypo' style={[S.F25, S.PR20, S.CLinfo]} />
            }
          </TouchableOpacity>
        </Item>
      </View>
    </Container>
  )
}
export default Comment

const S = StyleSheet.create({
  ...Styles,
  imageCover: {
    width: normalize(50),
    height: normalize(50),
    borderRadius: normalize(25),
    borderWidth: 2,
    borderColor: COLOR.greenColor,
    overflow: 'hidden',
  }
})