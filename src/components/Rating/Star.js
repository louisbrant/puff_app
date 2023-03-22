import React, { PureComponent } from 'react'
import { StyleSheet, Animated, TouchableOpacity } from 'react-native'
import { Images, COLOR } from '../../constants'
const STAR_SIZE = 40

export default class Star extends PureComponent {
  static defaultProps = {
    selectedColor: '#91af80'
  }

  constructor() {
    super()
    this.springValue = new Animated.Value(1)

    this.state = {
      selected: false
    }
  }

  spring() {
    const { position, starSelectedInPosition } = this.props

    this.springValue.setValue(1.2)

    Animated.spring(
      this.springValue,
      {
        toValue: 1,
        friction: 2,
        tension: 1,
        useNativeDriver: true,
      }
    ).start()

    this.setState({ selected: !this.state.selected })
    starSelectedInPosition(position)
  }

  render() {
    const { fill, size, selectedColor, isDisabled, starStyle, isDispensary } = this.props
    const rattingSource = fill && selectedColor === null ? Images.big_ratting : Images.empty_rating
    const starSource = fill && selectedColor === null ? Images.airbnb_star_selected : Images.airbnb_star

    return (
      <TouchableOpacity activeOpacity={1} onPress={this.spring.bind(this)} disabled={isDisabled}>
        <Animated.Image
          source={isDispensary ? starSource : rattingSource}
          style={[
            styles.starStyle,
            {
              tintColor: fill && selectedColor ? selectedColor : COLOR.BorderColor,
              width: size || STAR_SIZE,
              height: size || STAR_SIZE,
              transform: [{ scale: this.springValue }]
            },
            starStyle
          ]}
        />
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  starStyle: {
    margin: 3
  }
})
