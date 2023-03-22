import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { Icon } from "native-base"
import normalize from "react-native-normalize"
import { COLOR, Database, FieldValue, Firestore, LAYOUT, Styles } from "../../constants"
import { find } from "../../redux/actions/rootActions"

const PendingFriends = ({ navigation, tab }) => {
    const { user } = useSelector(state => state.auth)
    const [friend, setFriend] = useState([])
    const [loading, setLoading] = useState(false)
    const [userState, setUserState] = useState({})

    const removeInvite = (id) => {
        Firestore
            .collection('users')
            .doc(id)
            .update({
                inviteFriends: FieldValue.arrayRemove(user.uid)
            })
            .then(() => {
                loadData()
            }).catch(error => {
                console.log('InviteFriend error:', error)
            })
    }

    const approveInvite = (id) => {
        Firestore
            .collection('users')
            .doc(id)
            .update({
                inviteFriends: FieldValue.arrayRemove(user.uid),
                friends: FieldValue.arrayUnion(user.uid)
            }).then(() => {
                Firestore
                    .collection('users')
                    .doc(user.uid)
                    .update({
                        friends: FieldValue.arrayUnion(id)
                    })
                    .then(() => {
                        loadData()
                    }).catch(error => {
                        console.log('Notifications invite add error:', error)
                    })
            }).catch(error => {
                console.log('ApproveInvite error:', error)
            })
    }

    const loadData = () => {
        setLoading(true)
        const uid = user.uid
        Database.ref('user').on('value', snapshot => {
            setUserState(snapshot.val())
        })
        Firestore.collection('users')
            .where('isDispensary', '==', false)
            .where('inviteFriends', 'array-contains', uid)
            .get()
            .then(find)
            .then(data => {
                setFriend(data)
                setLoading(false)
            })
            .catch(error => {
                setLoading(false)
                console.log("Getting documents error: ", error)
            })
    }

    useEffect(() => {
        loadData()
    }, [navigation, tab])

    return (
        <FlatList
            data={friend}
            refreshing={loading}
            onRefresh={loadData}
            contentContainerStyle={[S.Acenter]}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => `${index}`}
            renderItem={({ item }) => (
                <View style={[S.ROW, S.Acenter, S.W100P, S.PV10]}>
                    <TouchableOpacity style={[S.friendCover]} onPress={() => navigation.navigate('FriendDetailsScreen', { user: item, isFriend: true })}>
                        <Image source={{ uri: item.profile_image }} style={[S.friendImage]} />
                        <Icon
                            name="circle"
                            type='FontAwesome'
                            style={[S.userState, {
                                color: userState[item.uid] && userState[item.uid] === true ? COLOR.success : COLOR.danger
                            }]}
                        />
                    </TouchableOpacity>
                    <View style={[S.list]}>
                        <View style={[S.PL10]}>
                            <Text style={[S.F18, S.FW700, S.CLB]}>{item.username}</Text>
                            <Text style={[S.F14, S.FW400, S.CLIcon]}>{item.first_name}  {item.last_name}</Text>
                        </View>
                        <View style={[S.ROW]}>
                            <TouchableOpacity style={[S.BKDanger, S.P10, S.Radius5, S.MR10]} onPress={() => removeInvite(item.uid)}>
                                <Icon type='AntDesign' name="close" style={[S.CLW, S.F24]} />
                            </TouchableOpacity>
                            <TouchableOpacity style={[S.BKinfo, S.P10, S.Radius5]} onPress={() => approveInvite(item.uid)}>
                                <Icon type='AntDesign' name="check" style={[S.CLW, S.F24]} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )}
        />
    )
}

export default PendingFriends

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
