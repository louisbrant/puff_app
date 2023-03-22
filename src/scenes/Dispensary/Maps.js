import React, { Component } from "react"
import { connect } from 'react-redux'
import MapView, { Circle } from "react-native-maps"
import normalize from "react-native-normalize"
import { AppRegistry, StyleSheet, View, Animated, TouchableOpacity, Text } from "react-native"
import { Container, Content, Header, Icon, Input, InputGroup, Title } from "native-base"
import { DispensaryItem, Marker2, Marker1 } from "../../components"
import { COLOR, Firestore, LAYOUT, Styles } from "../../constants"
import { navigate } from "../../redux/services/navigator"
const CARD_WIDTH = LAYOUT.window.width - 20

class MapsScreen extends Component {
  constructor(props) {
    super(props)

    this.state = {
      ...props.route.params,
      search: '',
      products: [],
      region: {
        latitude: 45.52220671242907,
        longitude: -122.6653281029795,
        latitudeDelta: 0.6864195044303445,
        longitudeDelta: 0.60142817690068,
      },
      productsAll: [],
      active: 0,
      zoom: 1
    }
  }

  UNSAFE_componentWillMount() {
    this.index = 0
    this.animation = new Animated.Value(0)
  }

  componentDidMount() {
    this.setState({ region: { ...this.state.region, ...this.props.position } })
    this.loadDispensaryData()
    this.animationListener()
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.search !== this.state.search) {
      const products = []
      this.state.productsAll.forEach(doc => {
        const entity = doc
        if (this.state.search === '') {
          products.push(entity)
        } else {
          if (entity.username && entity.username.toLowerCase().indexOf(this.state.search.toLowerCase()) > -1) {
            products.push(entity)
          }
        }
      })
      this.setState({ products })
    }
    if (prevProps.position !== this.props.position) {
      this.setState({ region: { ...this.state.region, ...this.props.position } })
    }
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

  loadDispensaryData() {
    Firestore.collection('users')
      .where("isDispensary", "==", true)
      .get()
      .then((querySnapshot) => {
        const products = []
        querySnapshot.forEach(doc => {
          const entity = doc.data()
          if (entity.ratings && Object.keys(entity.ratings).length) {
            let ratings = Object.values(entity.ratings)
            let rate = ratings.reduce((a, b) => a + b) / ratings.length
            entity.rateCount = ratings.length
            entity.rate = rate
          } else {
            entity.rateCount = entity.rate = 0
          }
          entity.id = doc.id
          products.push(entity)
        })
        this.setState({ productsAll: products, products })
      })
      .catch((error) => {
        console.log("Error getting documents: ", error)
      })
  }

  onZoom() {
    if (this.state.zoom == 1) {
      this.setState({ zoom: 100 })
    } else {
      this.setState({ zoom: 1 })
    }
  }


  render() {
    const { region, products, search, active } = this.state
    return (
      <Container>
        <Header
          style={[S.Header, { height: normalize(100) }]}
          androidStatusBarColor={COLOR.StatusBarColor}
          iosBarStyle={COLOR.StatusBarColor}
        >
          <View style={[S.titleCover]}>
            <Title style={[S.F20, S.FW700]}>Dispensaries Around You</Title>
          </View>
          <View style={[S.BKHeader, S.ROW, { height: normalize(45), flex: 1 }]}>
            <InputGroup style={[S.headerInputGroup]}>
              <Icon name="search" type='Fontisto' style={[S.F20, S.CLText]} />
              <Input
                autoCapitalize={'none'}
                placeholder="Search"
                placeholderTextColor={COLOR.TextColor}
                style={[S.F18, S.FW700, S.CLText]}
                value={search}
                onChangeText={(search) => this.setState({ search })}
              />
            </InputGroup>
            <TouchableOpacity style={[S.Jcenter, S.MB10, S.PL10]} onPress={() => navigate('DispensariesScreen')}>
              <Icon name="list" type="Feather" style={[S.F30, S.CLW]} />
            </TouchableOpacity>
          </View>
        </Header>
        <Content style={[S.BKW]} scrollEnabled={false} showsVerticalScrollIndicator={false}>
          <MapView
            ref={map => this.map = map}
            region={{
              ...region,
              longitudeDelta: this.state.region.longitudeDelta * this.state.zoom,
              latitudeDelta: this.state.region.latitudeDelta * this.state.zoom,
            }}
            showsUserLocation={true}
            style={{ width: LAYOUT.window.width, height: LAYOUT.window.height }}
          >
            {products.length ? products.map((marker, key) => (
              <MapView.Marker key={key} coordinate={{ latitude: marker.lat, longitude: marker.lon }} onPress={() => this.setState({ active: key })}>
                {active === key ? <Marker2 /> : <Marker1 />}
              </MapView.Marker>
            )) : null}
            <Circle center={this.props.position} strokeColor={"rgba(255, 0, 255, 0.5)"} fillColor={"transparent"} radius={32.18688 * 1000} />
          </MapView>
          <TouchableOpacity style={S.position} onPress={() => this.onZoom()}>
            <Icon type='Feather' name={this.state.zoom == 100 ? 'zoom-in' : 'zoom-out'} style={[S.F24, S.CLIcon]} />
          </TouchableOpacity>
          <Animated.ScrollView
            horizontal
            scrollEventThrottle={1}
            showsHorizontalScrollIndicator={false}
            snapToInterval={LAYOUT.window.width}
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
      </Container >
    )
  }
}

const S = StyleSheet.create({
  ...Styles,
  position: {
    position: 'absolute',
    elevation: 10,
    top: 10,
    left: 10
  },
  scrollView: {
    position: "absolute",
    bottom: normalize(180),
    left: 0,
    right: 0,
    paddingVertical: 10,
  },
  card: {
    paddingHorizontal: 10,
    elevation: 2,
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

export default connect(mapStateToProps, mapDispatchToProps)(MapsScreen)


AppRegistry.registerComponent("mapfocus", () => MapsScreen)