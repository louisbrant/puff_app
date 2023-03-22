import React from "react"
import { ImageBackground, Image, StyleSheet, Text } from "react-native"
import normalize from "react-native-normalize"
import { Styles, Images, LAYOUT } from "../constants"

const Splash = () => {
  return (
    <ImageBackground
      style={{ width: LAYOUT.window.width, height: LAYOUT.window.height, alignItems: 'center' }}
      source={Images.splash}
      resizeMode="cover"
    >
      <Image
        source={Images.logo}
        style={{
          marginTop: normalize(100),
          width: normalize(130),
          height: normalize(130),
          resizeMode: 'contain'
        }}
      />
      <Text style={[S.FW700, S.F40, S.Tcenter, { color: '#91af80' }]}>
        Soar
      </Text>
      <Text style={[S.FW700, S.F20, S.Tcenter, { color: '#91af80', position: 'absolute', bottom: normalize(100) }]}>
        By Project Puff Co.
      </Text>
    </ImageBackground>
  )
}

export default Splash

const S = StyleSheet.create({ ...Styles })
