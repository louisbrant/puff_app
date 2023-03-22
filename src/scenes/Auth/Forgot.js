import React, { useState } from 'react'
import { StyleSheet, ImageBackground, Image, Text, View, Alert, ActivityIndicator } from 'react-native'
import { Container, Content, Form, Item, Input, Label, Button, Toast, Icon } from 'native-base'
import { Styles, Images, firebase, COLOR } from '../../constants'

const ForgotScreen = ({ navigation }) => {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)

    const onResetEmail = () => {
        if (!email) {
            return Toast.show({ text: "Wrong Email!", buttonText: "Okay", type: "danger" })
        } else {
            setLoading(true)
            firebase.auth().sendPasswordResetEmail(email).then(() => {
                setEmail('')
                setLoading(false)
                Alert.alert(
                    'Success',
                    'Please check your email.',
                    [{ text: 'Dismiss', onPress: () => { } }],
                    { cancelable: false }
                )
            }).catch(err => {
                setLoading(false)
                Alert.alert(
                    'Error!',
                    err.message,
                    [{ text: 'Dismiss', onPress: () => { } }],
                    { cancelable: false }
                )
            })
        }
    }

    return (
        <Container>
            <ImageBackground
                style={S.ImageBackgroundOt}
                source={Images.splash}
                resizeMode="cover"
            >
                <Content style={[S.PH20, S.PT50]} showsVerticalScrollIndicator={false}>
                    <Button transparent onPress={() => navigation.goBack()}>
                        <Icon type='Entypo' name='chevron-thin-left' style={[S.CLW, S.F24]} />
                    </Button>
                    <View style={[S.Acenter, S.MT50]}>
                        <Image source={Images.logo} style={S.logo1} />
                    </View>
                    <Text style={[S.F24, S.Tcenter, S.CLW, S.MV20]}>
                        Forgot Password
                    </Text>
                    <View style={[S.PH30]}>
                        <Item stackedLabel last style={[S.MT50]}>
                            <Label style={S.label}>Email</Label>
                            <Input
                                value={email}
                                onChangeText={setEmail}
                                style={[S.CLW]}
                                autoCapitalize={'none'}
                            />
                        </Item>
                        <View style={[S.Acenter, S.MT20]}>
                            <Button primary block rounded style={S.MT20} onPress={onResetEmail}>
                                {loading ?
                                    <ActivityIndicator animating={true} size="small" color={COLOR.greenColor} /> :
                                    <Text style={[S.F16, S.CLW]}>Submit</Text>
                                }
                            </Button>
                        </View>
                    </View>
                </Content>
            </ImageBackground>
        </Container>
    )
}

export default ForgotScreen

const S = StyleSheet.create({
    ...Styles,
})