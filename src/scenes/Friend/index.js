import React, { useState } from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import { Container, Icon, Tabs, Tab, DefaultTabBar } from 'native-base'
import { Headers } from '../../components'
import ActiveFriends from './Active'
import PendingFriends from './Pending'
import { COLOR, Styles } from '../../constants'

const renderTabBar = (props) => {
  props.tabStyle = Object.create(props.tabStyle)
  return <DefaultTabBar {...props} />
}

const FriendScreen = ({ navigation, route: { params } }) => {
  const [tab, setTab] = useState(0)
  return (
    <Container>
      <Headers
        title='Friends'
        left={
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon type='Entypo' name='chevron-thin-left' style={[S.CLW, S.F20]} />
          </TouchableOpacity>
        }
      />
      <Tabs onChangeTab={({ i }) => setTab(i)} renderTabBar={renderTabBar} initialPage={params.page}>
        <Tab heading="Active" activeTabStyle={S.BKTab} tabStyle={[S.BKTab]} textStyle={S.CLW}>
          <ActiveFriends navigation={navigation} tab={tab} />
        </Tab>
        <Tab heading="Pending" activeTabStyle={S.BKTab} tabStyle={[S.BKTab]} textStyle={S.CLW}>
          <PendingFriends navigation={navigation} tab={tab} />
        </Tab>
      </Tabs>
    </Container >
  )

}
export default FriendScreen

const S = StyleSheet.create({
  ...Styles,
  BKTab: {
    backgroundColor: COLOR.HeaderColor,
    color: COLOR.whiteColor
  }
})
