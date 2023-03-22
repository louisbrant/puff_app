import React from "react"
import { Marker } from "react-native-maps"
import normalize from "react-native-normalize"
import { StyleSheet, View, Image, Text, TouchableOpacity, Modal, ActivityIndicator } from 'react-native'
import { Badge, Body, Right, Header, Left, Title, Icon } from "native-base"
import { COLOR, Styles, Images, LAYOUT } from "../constants"
import { navigate } from "../redux/services/navigator"
import Rating from "./Rating"
import Footers from "./Footers"

export { Footers }

export const Loading = () => {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <ActivityIndicator animating={true} size="large" color={COLOR.greenColor} />
    </View>
  )
}

export const Loadings = () => {
  return (
    <View style={{ position: 'absolute', alignItems: 'center', elevation: 10, justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)', width: '100%', height: '100%' }}>
      <ActivityIndicator animating={true} size="large" color={COLOR.greenColor} />
    </View>
  )
}

export const WishItem = ({ item, isDescription = false }) => (
  <View style={[S.PT10, S.Acenter]}>
    <TouchableOpacity style={[S.PH20, S.ROW, S.Acenter, { width: '100%', flexWrap: 'wrap' }]} onPress={() => navigate('StrainProfileScreen', item)}>
      <Image source={{ uri: item.photo }} style={[S.wishIcon, { resizeMode: 'center' }]} />
      <Text style={[S.F18, S.FW700, S.CLB, S.PH10]}>{item.name}</Text>
      <Rating
        isDisabled
        defaultRating={item.rate}
        showRating={false} size={normalize(20)}
      />
      {isDescription ? <Text style={[S.F13, S.CLGY]}>{item.description}</Text> : null}
    </TouchableOpacity>
    <View style={[S.MT10, S.hr, { width: '100%' }]} />
  </View>
)

export const ProductItem = ({ item, isRateStrain = false }) => (
  <View style={[S.PT20, S.Jcenter, S.Acenter]}>
    <TouchableOpacity style={[S.ROW, S.Astart]} disabled={isRateStrain} onPress={() => navigate('StrainProfileScreen', item)}>
      {item && item.photo ? <Image source={{ uri: item.photo }} style={[S.productIcon, { resizeMode: 'center' }]} /> : null}
      <View style={[S.PH20, S.detailsBox]}>
        <View style={[S.ROW, S.Acenter]}>
          <Rating
            isDisabled={true}
            defaultRating={item && item.rate ? item.rate : 0}
            showRating={false}
            size={normalize(20)}
          />
          <Text style={[S.F13, S.CLGY]}> {item.rateCount}</Text>
        </View>
        <Text style={[S.F16, S.FW700, S.CLB]}>{item.name}</Text>
        {isRateStrain ?
          <Text style={[S.F13, S.CLGY]}>{item.description}</Text> :
          <Text style={[S.F13, S.CLGY]} numberOfLines={2}>{item.description}</Text>
        }
      </View>
    </TouchableOpacity>
    <View style={[S.MT20, S.hr]} />
  </View>
)


export const DispensaryItem = ({ item, show = false, map = false }) => (
  <TouchableOpacity
    disabled={!item.isDispensaryVerified}
    style={[
      S.Acenter,
      S.BKW,
      S.Hidden,
      map ? S.MV10 : {},
      map ? S.BoxShadow : {},
      { borderRadius: 5 }
    ]}
    onPress={() => navigate('DispensaryScreen', item)}
  >
    <View style={[S.ROW, S.Acenter, S.PV15]}>
      <Image source={{ uri: item.profile_image }} style={[S.productIcon, { resizeMode: 'contain' }]} />
      <View style={[S.PH20, S.detailsBox]}>
        <View style={[S.ROW, S.Jbetween]}>
          <View>
            <View style={[S.ROW, S.Acenter]}>
              <Rating
                isDisabled
                defaultRating={item.rate}
                showRating={false}
                size={normalize(20)}
                isDispensary={true}
                selectedColor='#f1c40f'
              />
              <Text style={[S.F13, S.CLGY]}> {show ? item.rate.toFixed(1) : item.rateCount}</Text>
            </View>
            <Text style={[S.F16, S.FW700, S.CLB]}>{item.username}</Text>
          </View>
          <View>
            <Icon type="MaterialCommunityIcons" name="check-decagram" style={{ color: item.isDispensaryVerified ? COLOR.green1Color : COLOR.greyColor, fontSize: normalize(24) }} />
            {/* {show ? <Text style={[S.F14, S.CLW, S.BKLGY, S.PH10, S.ML20, { paddingVertical: normalize(5), borderRadius: normalize(15) }]}>Dispensary</Text> : null} */}
          </View>
        </View>
        <Text style={[S.F13, S.CLGY]} numberOfLines={2}>{item.full_address}</Text>
      </View>
    </View>
  </TouchableOpacity>
)

export const DispensaryNearByItem = ({ item }) => (
  <View>
    <TouchableOpacity style={[S.Acenter, S.BKW, S.Hidden]} onPress={() => navigate('DispensaryScreen', item)}>
      <View style={[S.ROW, S.Acenter, S.PV10]}>
        <Image source={{ uri: item.profile_image }} style={[S.productIcon, { resizeMode: 'contain' }]} />
        <View style={[S.PH20, S.detailsBox]}>
          <View style={[S.ROW, S.Acenter]}>
            <Rating
              isDisabled
              defaultRating={item.rate}
              showRating={false}
              size={normalize(20)}
              isDispensary={true}
              selectedColor='#f1c40f'
            />
            <Text style={[S.F13, S.CLGY]}> {item.rateCount}</Text>
          </View>
          <Text style={[S.F16, S.FW700, S.CLB]}>{item.username}</Text>
          <Text style={[S.F13, S.CLGY]} numberOfLines={2}>{item.full_address}</Text>
        </View>
      </View>
    </TouchableOpacity>
    <View style={[S.Acenter]}>
      <TouchableOpacity style={[S.PH10, S.PV5, S.MT10, S.ROW, S.Acenter, { backgroundColor: '#587448', borderRadius: normalize(15) }]} onPress={() => navigate('MapNearbyDispensariesScreen', item)}>
        <Icon type='Ionicons' name="location-outline" style={[S.F18, S.CLW]} />
        <Text style={[S.F14, S.CLW, S.FW400]}> Check-In Here for Points</Text>
      </TouchableOpacity>
    </View>
  </View>
)

export const Dispensary = ({ item, show = false }) => (
  <TouchableOpacity style={[S.Acenter, S.BKW, S.Hidden]} onPress={() => navigate('DispensaryScreen', item)} disabled={show}>
    <View style={[S.ROW, S.Acenter, S.PV10]}>
      <Image source={{ uri: item.profile_image }} style={[S.productIcon, { resizeMode: 'contain' }]} />
      <View style={[S.PH20, S.detailsBox]}>
        <View style={[S.ROW, S.Jbetween]}>
          <View>
            <View style={[S.ROW, S.Acenter]}>
              <Rating
                isDisabled
                defaultRating={item.rate}
                showRating={false}
                size={normalize(20)}
                isDispensary={true}
                selectedColor='#f1c40f'
              />
              <Text style={[S.F13, S.CLGY]}> {show ? item.rate.toFixed(1) : item.rateCount}</Text>
            </View>
            <Text style={[S.F16, S.FW700, S.CLB]}>{item.username}</Text>
          </View>
          <View>
            {show ? <Text style={[S.F14, S.CLW, S.BKLGY, S.PH10, S.ML20, { paddingVertical: normalize(5), borderRadius: normalize(15) }]}>Dispensary</Text> : null}
          </View>
        </View>
        <Text style={[S.F13, S.CLGY]}>{item.full_address}</Text>
      </View>
    </View>
  </TouchableOpacity>
)

export const Button1 = ({ title, onPress, active }) => (
  <TouchableOpacity style={[active ? S.BKW : {}, S.Jcenter, S.Acenter, { width: LAYOUT.window.width * 0.45, paddingVertical: 8, borderRadius: 8 }]} onPress={onPress}>
    <Text style={[S.FW700, active ? S.CLGY : S.CLW]}>{title}</Text>
  </TouchableOpacity>
)

export const SearchItem = ({ title, detail, icon, screen }) => (
  <View style={[S.Jcenter, S.Acenter, S.PT15, S.PH15, { width: '100%' }]}>
    <TouchableOpacity style={[S.ROW, S.Jbetween, S.Acenter, { width: '100%' }]} onPress={() => navigate(screen)}>
      <View style={[S.ROW, S.Acenter]}>
        <Image source={icon} style={[S.searchIcons]} />
        <View style={[S.ML10]}>
          <Text style={[S.FW700, S.F16, S.CLB, S.ML10]}>{title}</Text>
          {detail && <Text style={[S.F14, S.CLB, S.MT10]}>{detail}</Text>}
        </View>
      </View>
      <Icon name='chevron-thin-right' type='Entypo' style={[S.CLIcon, S.F20, S.FW700, S.PR10]} />
    </TouchableOpacity>
    <View style={[S.PT15, { width: '100%', borderBottomWidth: 0.5, borderColor: COLOR.BorderColor }]} />
  </View>
)

export const Marker2 = () => (
  <Image source={Images.marker2} style={{ height: normalize(45), width: normalize(45), resizeMode: 'contain' }} />
)

export const Marker1 = () => (
  <Image source={Images.marker1} style={{ height: normalize(45), width: normalize(45), resizeMode: 'contain' }} />
)

export const HRs = ({ pro }) => (
  <View style={[S.MV10, { borderBottomWidth: 1, borderColor: COLOR.BorderColor, width: `${pro}%` }]} />
)

export const LocationItem = ({ title }) => (
  <View style={[S.P20, S.ROW, S.Jbetween]}>
    <View style={[S.ROW]}>
      <View style={[S.ROW]}>
        <Image source={Images.photos} style={[S.infoIcon]} />
      </View>
      <View style={[S.PH20, S.Jbetween, S.PV5]}>
        <View style={[S.ROW, S.Jbetween]}>
          <View>
            <View style={[S.ROW, S.Acenter]}>
              <Rate />
              <Text style={[S.F14, S.CLGY]}>(25)</Text>
            </View>
            <Text style={[S.F16, S.FW700, S.CLB]}>Purple Kush</Text>
          </View>
          <View>
            <Text style={[S.F14, S.CLW, S.BKLGY, S.PH10, S.ML20, S.PV5, { borderRadius: normalize(15) }]}>Dispensary</Text>
          </View>
        </View>
        <Text style={[S.F15, S.FW700, S.CLGY]}>100 Arlington Ave, Los Angeles, CA</Text>
      </View>
    </View>
  </View>
)

export const AddItem = ({ title, onPress, arr }) => (
  <TouchableOpacity style={[
    arr.indexOf(title) > -1 ? S.BKG : S.BKinfo,
    S.ROW, S.PH15, S.MH5, S.Acenter,
    { borderRadius: normalize(15), paddingVertical: normalize(8) }
  ]} onPress={() => onPress(title)}>
    <Text style={[S.CLW, S.F13]}>{title} </Text>
  </TouchableOpacity>
)

export const Progress = ({ title, pro }) => (
  <View style={[S.ROW, S.H30, S.MV5, S.BKGrey]}>
    <View style={[S.BKBule, { width: `${pro}%` }]} />
    <View style={[S.H30, S.Jcenter, { position: 'absolute', left: 0 }]}>
      <Text style={[S.FW700, S.F16, S.ML20, S.CLW]}>{title}</Text>
    </View>
  </View>
)

export const Rate = () => (
  <View style={[S.ROW, S.Acenter]}>
    <Image source={Images.big_ratting} style={[S.rate]} />
    <Image source={Images.big_ratting} style={[S.rate]} />
    <Image source={Images.big_ratting} style={[S.rate]} />
    <Image source={Images.big_ratting} style={[S.rate]} />
    <Image source={Images.big_ratting} style={[S.rate]} />
  </View>
)

export const BageItem = () => (
  <View style={[S.ROW, S.PV10]}>
    <View style={[S.Acenter]}>
      <Image source={Images.round_demo} style={[S.round_demo, { borderWidth: 5, borderColor: COLOR.info }]} />
      <Text style={[S.F16, S.FW700, S.CLB]}>Purple Warrior</Text>
      <Text style={[S.F16, S.FW700, S.CLGY]}>Level 3</Text>
      <Text style={[S.F13, S.CLGY]}>March 30, 2019</Text>
      <Badge info style={[{ position: 'absolute', right: normalize(10), top: 0 }]}>
        <Text style={[S.F16, S.CLW, S.FW700]}> 2 </Text>
      </Badge>
    </View>
  </View>
)


export const Headers = ({ left = null, right = null, title }) => (
  <Header hasSegment style={[S.header, S.BoxShadow]} androidStatusBarColor={COLOR.StatusBarColor} iosBarStyle={COLOR.StatusBarColor}>
    <Left>{left ? left : null}</Left>
    <Body style={{ alignItems: 'center' }}>
      <Text style={[S.FW700, S.F18, S.CLW]}>{title}</Text>
    </Body>
    <Right>{right ? right : null}</Right>
  </Header>
)

export const Confirm = ({ visible, message, onDiscard, onConfirm }) => (
  <Modal
    animationType="slide"
    transparent={true}
    visible={visible}
  >
    <View style={[S.modalCenteredView]}>
      <View style={[S.modalView, { width: LAYOUT.window.width * 0.85 }]}>
        <View style={[S.MT10, S.Acenter]}>
          <Icon type='Foundation' name='alert' style={[S.CLDanger, S.F70]} />
          <Text style={[S.modalText, S.CLB, S.MT10]}>{message}</Text>
        </View>
        <View style={[S.ROW, S.Jbetween, S.MT20]}>
          <TouchableOpacity style={[S.BKDanger, S.MH20, S.Radius5]} onPress={onDiscard}>
            <Text style={[S.F18, S.FW400, S.Tcenter, S.PH20, S.PV10, S.CLW]}>Discard</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[S.BKSuccess, S.MH20, S.Radius5]} onPress={onConfirm}>
            <Text style={[S.F18, S.FW400, S.Tcenter, S.PH20, S.PV10, S.CLW]}>Confirm</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
)

export const Alert = ({ visible, onPress, type = 'Success', Message = '' }) => (
  <Modal
    animationType="slide"
    transparent={true}
    visible={visible}
  >
    <View style={[S.modalCenteredView]}>
      <TouchableOpacity style={[S.modalView, S.Radius5]} onPress={onPress}>
        <Image style={[S.modalSuccessIcon]} source={type === 'Success' ? Images.SuccesIcon : Images.FailedIcon} />
        <Text style={[S.modalText, type === 'Success' ? S.CLSuccess : S.CLDanger]}>{type}</Text>
        {Message ? <Text style={[S.modalText, S.F18, S.CLB]}>{Message}</Text> : null}
      </TouchableOpacity>
    </View>
  </Modal>
)

const S = StyleSheet.create({
  ...Styles,
  detailsBox: {
    justifyContent: "center",
    paddingVertical: normalize(5),
    width: LAYOUT.window.width * 0.65
  },
  hr: {
    borderBottomWidth: 0.5,
    borderColor: COLOR.BorderColor,
    width: '95%'
  },
  header: {
    backgroundColor: COLOR.HeaderColor,
    height: normalize(60),
  }
})