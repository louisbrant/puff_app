import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { FlatList, Image, StyleSheet, TouchableOpacity, View } from "react-native"
import { Badge, Text, Container } from "native-base"
import normalize from "react-native-normalize"
import StyledText from "react-native-styled-text"
import { COLOR, Firestore, LAYOUT, Styles } from "../../constants"
import { Headers } from "../../components"

const Notifications = ({ navigation }) => {
    const { user } = useSelector(state => state.auth)
    const [refresh, setRefresh] = useState(false)
    const [notifications, setNotifications] = useState([])

    const loadData = () => {
        setRefresh(true)
        Firestore
            .collection('notifications')
            .where('receiver', '==', user.uid)
            .get()
            .then(snapshot => {
                const notificationsData = []
                snapshot.forEach(doc => {
                    const data = doc.data()
                    data.id = doc.id
                    notificationsData.push(data)
                })
                setNotifications(notificationsData)
                setRefresh(false)
            }).catch(error => {
                console.log(error)
                setRefresh(false)
            })
    }

    const inviteNavigation = (item) => {
        Firestore
            .collection('notifications')
            .doc(item.id)
            .set({ see: true }, { merge: true })
            .then(data => {
                navigation.navigate('FriendScreen', { page: 1 })
            })
            .catch(error => {
                console.log(error)
            })
    }

    const puffsNavigation = (item) => {
        Firestore
            .collection('notifications')
            .doc(item.id)
            .set({ see: true }, { merge: true })
            .then(data => {
                navigation.navigate('NGlobalActivityScreen', item)
            })
            .catch(error => {
                console.log(error)
            })
    }

    const commentNavigation = (item) => {
        Firestore
            .collection('notifications')
            .doc(item.id)
            .set({ see: true }, { merge: true })
            .then(data => {
                navigation.navigate('CommentScreen', { id: item.data })
            })
            .catch(error => {
                console.log(error)
            })
    }

    useEffect(() => {
        loadData()
    }, [navigation])

    useEffect(() => {
        navigation.addListener('focus', loadData)
    }, [])

    return (
        <Container>
            <Headers title='Notifications' />
            <FlatList
                data={notifications}
                refreshing={refresh}
                onRefresh={loadData}
                contentContainerStyle={[S.Acenter]}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item, index) => `${index}`}
                renderItem={({ item }) => {
                    if (item.type === 'invite') {
                        return (
                            <TouchableOpacity style={[S.ROW, S.Acenter, S.W100P, S.PV10]} onPress={() => inviteNavigation(item)}>
                                <View style={[S.friendCover]} >
                                    <Image source={{ uri: item.image }} style={[S.friendImage]} />
                                </View>
                                <View style={[S.List, { paddingRight: item.see ? 0 : normalize(60) }]}>
                                    <StyledText style={[S.F18, S.CLB]}>{item.message}</StyledText>
                                    {!item.see && <Badge danger><Text>New</Text></Badge>}
                                </View>
                            </TouchableOpacity>
                        )
                    } else if (item.type === 'puffs') {
                        return (
                            <TouchableOpacity style={[S.ROW, S.Acenter, S.W100P, S.PV10]} onPress={() => puffsNavigation(item)}>
                                <View style={[S.friendCover]} >
                                    <Image source={{ uri: item.image }} style={[S.friendImage]} />
                                </View>
                                <View style={[S.List, { paddingRight: item.see ? 0 : normalize(60) }]}>
                                    <StyledText style={[S.F18, S.CLB]}>{item.message}</StyledText>
                                    {!item.see && <Badge danger><Text>New</Text></Badge>}
                                </View>
                            </TouchableOpacity>
                        )
                    } else if (item.type === 'comment') {
                        return (
                            <TouchableOpacity style={[S.ROW, S.Acenter, S.W100P, S.PV10]} onPress={() => commentNavigation(item)}>
                                <View style={[S.friendCover]} >
                                    <Image source={{ uri: item.image }} style={[S.friendImage]} />
                                </View>
                                <View style={[S.List, { paddingRight: item.see ? 0 : normalize(60) }]}>
                                    <StyledText style={[S.F18, S.CLB]}>{item.message}</StyledText>
                                    {!item.see && <Badge danger><Text>New</Text></Badge>}
                                </View>
                            </TouchableOpacity>
                        )
                    }
                }}
            />
        </Container >
    )
}

export default Notifications

const S = StyleSheet.create({
    ...Styles,
    List: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: LAYOUT.window.width - normalize(80),
        paddingVertical: normalize(15),
        paddingLeft: normalize(10),
        borderBottomWidth: 0.5,
        borderColor: COLOR.BorderColor
    }
})
