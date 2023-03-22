import React, { Component } from "react"
import { connect } from 'react-redux'
import MapView, { Circle } from "react-native-maps"
import normalize from "react-native-normalize"
import { AppRegistry, StyleSheet, View, Animated, TouchableOpacity } from "react-native"
import { Container, Content, Icon } from "native-base"
import { DispensaryItem, Marker2, Marker1, Headers } from "../../components"
import { COLOR, LAYOUT, Styles } from "../../constants"

const CARD_WIDTH = LAYOUT.window.width - 20

class MapNearbyDispensariesScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      search: '',
      products: [props.route.params],
      region: {
        latitude: 45.52220671242907,
        longitude: -122.6653281029795,
        latitudeDelta: 0.6864195044303445,
        longitudeDelta: 0.60142817690068,
      },
      active: 0
    }
  }

  UNSAFE_componentWillMount() {
    this.index = 0
    this.animation = new Animated.Value(0)
  }

  componentDidMount() {
    this.setState({ region: { ...this.state.region, ...this.props.position } })
    this.animationListener()
  }

  animationListener() {
    this.animation.addListener(({ value }) => {
      let index = Math.floor(value / CARD_WIDTH + 0.3)
      if (index >= this.state.products.length) {
        index = this.state.products.length - 1
      }
      if (index <= 0) {
        index = 0
      }

      clearTimeout(this.regionTimeout)
      this.regionTimeout = setTimeout(() => {
        if (this.index !== index) {
          this.index = index
          this.setState({ active: index })
          const { lat, lon } = this.state.products[index]
          this.map.animateToRegion(
            {
              ...{
                latitude: lat,
                longitude: lon,
              },
              latitudeDelta: this.state.region.latitudeDelta,
              longitudeDelta: this.state.region.longitudeDelta,
            },
            350
          )
        }
      }, 10)
    })
  }


  render() {
    const { region, products, active } = this.state
    return (
      <Container>
        <Headers
          title='Map'
          left={
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <Icon type='Entypo' name='chevron-thin-left' style={[S.CLW, S.F20]} />
            </TouchableOpacity>
          }
        />
        <Content style={[S.BKW]} scrollEnabled={false} showsVerticalScrollIndicator={false}>
          <MapView
            ref={map => this.map = map}
            initialRegion={region}
            showsUserLocation
            style={{ width: LAYOUT.window.width, height: LAYOUT.window.height }}
          >
            {products.length ? products.map((marker, key) => (
              <MapView.Marker key={key} coordinate={{ latitude: marker.lat, longitude: marker.lon }} onPress={() => this.setState({ active: key })}>
                {active === key ? <Marker2 /> : <Marker1 />}
              </MapView.Marker>
            )) : null}
            <Circle center={this.props.position} strokeColor={"rgba(255, 255, 0, 0.5)"} fillColor={"transparent"} radius={32.18688 * 1000} />
          </MapView>
          <Animated.ScrollView
            horizontal
            scrollEventThrottle={1}
            showsHorizontalScrollIndicator={false}
            snapToInterval={CARD_WIDTH}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: this.animation } } }],
              { useNativeDriver: true }
            )}
            style={S.scrollView}
          >
            {products.length ? products.map((marker, key) => (
              <View style={S.card} key={key}>
                <DispensaryItem item={marker} isDescription show={true} />
              </View>
            )) : null}
          </Animated.ScrollView>
        </Content>
      </Container>
    )
  }
}

const S = StyleSheet.create({
  ...Styles,
  scrollView: {
    position: "absolute",
    bottom: normalize(100),
    left: 0,
    right: 0,
    paddingVertical: 10,
  },
  card: {
    paddingHorizontal: 10,
    elevation: 2,
    backgroundColor: COLOR.whiteColor,
    marginHorizontal: 10,
    shadowColor: COLOR.blackColor,
    shadowRadius: 5,
    shadowOpacity: 0.3,
    shadowOffset: { x: 2, y: -2 },
    width: CARD_WIDTH,
    overflow: "hidden",
  },
  marker: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(130,4,150, 0.9)",
  },
})

const mapStateToProps = (state) => ({
  position: state.auth.position
})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(MapNearbyDispensariesScreen)


AppRegistry.registerComponent("mapfocus", () => MapNearbyDispensariesScreen)