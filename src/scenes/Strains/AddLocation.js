import React from 'react'
import { StyleSheet, TouchableOpacity, Text } from 'react-native'
import { Container, Icon, Content, Input, Segment, InputGroup, View } from 'native-base'
import normalize from 'react-native-normalize'
import { COLOR, Styles, LAYOUT } from "../../constants"
import { Headers } from '../../components'

const AddLocationScreen = ({ navigation }) => {
  return (
    <Container>
      <Headers
        title='Dispensaries'
        left={
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon type='Entypo' name='chevron-thin-left' style={[S.CLW, S.F20]} />
          </TouchableOpacity>
        }
      />
      <Segment style={[S.BKHeader, { height: 55 }]}>
        <InputGroup style={[S.P10, S.MB10, S.MH10, S.BKW, { flex: 1, borderRadius: normalize(5) }]}>
          <Icon name="search" style={[S.F20, { color: COLOR.greyColor }]} />
          <Input placeholder="Search for a dispensary" style={S.F15} />
        </InputGroup>
      </Segment>
      <Content showsVerticalScrollIndicator={false}>
        <View style={[S.Jcenter, S.Acenter, { height: LAYOUT.window.height * 0.8, width: '100%' }]}>
          <Text style={[S.F25, S.FW700, S.PH10, S.PH20, S.CLB]}>No Dispensaries Found</Text>
        </View>
      </Content>
    </Container>
  )
}

export default AddLocationScreen

const S = StyleSheet.create({
  ...Styles,
})