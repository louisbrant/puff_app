import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import normalize from 'react-native-normalize'
import { StyleSheet, TouchableOpacity, View, Image, Text, FlatList } from 'react-native'
import { Container, Icon, Input, InputGroup, Header, Title } from 'native-base'
import { COLOR, Styles, LAYOUT, Database, Firestore, FieldValue } from "../../constants"
import { GetDate, updateProfile } from '../../redux/actions/authActions'
import { addNotification } from '../../redux/actions/notificationsActions'

const AddFriendScreen = ({ navigation }) => {
  const dispatch = useDispatch()
  const { user } = useSelector(state => state.auth)
  const [users, setUsers] = useState([])
  const [userState, setUserState] = useState({})
  const [search, setSearch] = useState('')
  const [refresh, setRefresh] = useState(false)

  const loadData = async () => {
    setRefresh(true)
    dispatch(updateProfile())
    let friendsList = user.friends ? user.friends : []
    await Database.ref('user').on('value', snapshot => setUserState(snapshot.val()))

    await Firestore.collection('users')
      .where('isDispensary', '==', false)
      .where('inviteFriends', 'array-contains', user.uid)
      .get()
      .then(snapshot => {
        snapshot.forEach(doc => friendsList.push(doc.id))
      })
      .catch(error => {
        console.log("Getting documents error: ", error)
      })

    await Firestore.collection('users')
      .where('isDispensary', '==', false)
      .get()
      .then(snapshot => {
        const usersData = []
        snapshot.forEach(doc => {
          const entity = doc.data()
          if (doc.id !== user.uid && friendsList.indexOf(doc.id) < 0 && entity.username.toLowerCase().indexOf(search.toLowerCase()) > -1)
            usersData.push(entity)
        })
        setUsers(usersData)
      }).catch(error => {
        console.log("Getting documents error: ", error)
      })
    setRefresh(false)
  }

  const onInvite = (sender, receiver) => {
    Firestore.collection('users')
      .doc(sender)
      .update({
        inviteFriends: FieldValue.arrayUnion(receiver)
      }).then(() => {
        loadData()
        addNotification({
          id: sender + GetDate().createdAtSeconds,
          type: 'invite',
          message: `The user <b>${user.username}</b> has requested to be your friend.`,
          see: false,
          sender: sender,
          image: user.profile_image,
          receiver: receiver,
          data: '',
          ...GetDate()
        })
      }).catch(error => {
        console.log('InviteFriend error:', error)
      })
  }

  useEffect(() => {
    loadData()
  }, [search, navigation])

  return (
    <Container>
      <Header
        style={[S.Header, { height: normalize(100) }]}
        androidStatusBarColor={COLOR.StatusBarColor}
        iosBarStyle={COLOR.StatusBarColor}
      >
        <View style={[S.titleCover, S.ROW, S.Jbetween, S.Aend]}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon type='Entypo' name='chevron-thin-left' style={[S.CLW, S.F20]} />
          </TouchableOpacity>
          <Title style={[S.F20, S.FW700, S.PL10]}>Add Friends</Title>
          <View />
        </View>
        <View style={[S.BKHeader, S.ROW, { height: normalize(45), flex: 1 }]}>
          <InputGroup style={[S.headerInputGroup]}>
            <Icon name="search" type='Fontisto' style={[S.F20, S.CLText]} />
            <Input
              value={search}
              onChangeText={setSearch}
              autoCapitalize={'none'}
              placeholder="Search"
              placeholderTextColor={COLOR.TextColor}
              style={[S.F18, S.FW700, S.CLText]}
            />
          </InputGroup>
        </View>
      </Header>
      <FlatList
        data={users}
        refreshing={refresh}
        style={[S.BKW, S.PH20]}
        onRefresh={loadData}
        contentContainerStyle={[S.Acenter]}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => `${index}`}
        renderItem={({ item }) => {
          const isfriend = user.inviteFriends ? user.inviteFriends.indexOf(item.uid) > -1 : false
          const state = userState[item.uid] && userState[item.uid] === true ? true : false
          return (
            <View style={[S.ROW, S.Acenter, S.W100P, S.PT10]}>
              <TouchableOpacity style={[S.friendCover]}
                onPress={() => navigation.navigate('FriendDetailsScreen', { user: item })}>
                <Image source={{ uri: item.profile_image }} style={[S.friendImage]} />
                <Icon type="FontAwesome" name="circle" style={[S.userState, { color: state ? COLOR.success : COLOR.danger }]} />
              </TouchableOpacity>
              <View style={S.list}>
                <View style={[S.PL10]}>
                  <Text style={[S.F18, S.FW700, S.CLB]}>{item.username}</Text>
                  <Text style={[S.F14, S.FW400, S.CLIcon]}>{item.first_name}  {item.last_name}</Text>
                </View>
                {
                  isfriend ?
                    <TouchableOpacity style={[S.BKLight, S.P10, { borderRadius: normalize(25) }]}>
                      <Icon type='Feather' name="more-horizontal" style={[S.CLW, S.F24]} />
                    </TouchableOpacity> :
                    <TouchableOpacity style={[S.BKWarning, S.P10, { borderRadius: normalize(25) }]} onPress={() => onInvite(user.uid, item.uid)}>
                      <Icon type='AntDesign' name="plus" style={[S.CLW, S.F24]} />
                    </TouchableOpacity>
                }
              </View>
            </View>
          )
        }}
      />
    </Container>
  )
}

export default AddFriendScreen

const S = StyleSheet.create({
  ...Styles,
  list: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: LAYOUT.window.width - normalize(100),
    paddingVertical: normalize(15),
    borderBottomWidth: 0.5,
    borderColor: COLOR.BorderColor
  }
})