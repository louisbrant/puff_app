import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { StyleSheet, ImageBackground, Image, Text, View, ActivityIndicator } from 'react-native'
import { Container, Content, Item, Input, Label, Button, Icon, Toast } from 'native-base'
import { firebase, Firestore, Styles, Images, COLOR } from '../../constants'

const SignInScreen = ({ navigation }) => {
    const dispatch = useDispatch()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)

    const Error = (error) => {
        setLoading(false)
        return Toast.show({ text: error.message, buttonText: "Okay", type: "danger", duration: 4000 })
    }

    const onLoginPress = () => {
        if (!email) {
            return Toast.show({ text: "Wrong Email!", buttonText: "Okay", type: "danger", duration: 4000 })
        } else if (!password) {
            return Toast.show({ text: "Wrong password!", buttonText: "Okay", type: "danger", duration: 4000 })
        } else {
            setLoading(true)
            firebase.auth()
                .signInWithEmailAndPassword(email, password)
                .then((response) => {
                    const uid = response.user.uid
                    Firestore
                        .collection('users')
                        .doc(uid)
                        .get()
                        .then(doc => {
                            if (!doc.exists) {
                                setLoading(false)
                                return Toast.show({ text: `User does not exist anymore.`, buttonText: "Okay", type: "danger", duration: 4000 })
                            } else {
                                const user = doc.data()
                                user.uid = uid
                                if (user.isDispensary == false) {
                                    setLoading(false)
                                    dispatch({ type: "LOGIN", payload: user })
                                } else {
                                    setLoading(false)
                                    return Toast.show({ text: `User does not exist anymore.`, buttonText: "Okay", type: "danger", duration: 4000 })
                                }
                            }
                        }).catch(Error)
                }).catch(Error)
        }
    }

    return (
        <Container>
            <ImageBackground
                style={S.ImageBackgroundOt}
                source={Images.splash}
                resizeMode="cover"
            >
                <Content contentContainerStyle={[S.PH40]} showsVerticalScrollIndicator={false}>
                    <View style={[S.Acenter, S.MT50]}>
                        <Image source={Images.logo} style={S.logo1} />
                    </View>
                    <Text style={[S.textA, S.PH10, S.PT20, S.PB10]}>
                        A community for recreational and medical cannabis users.
                    </Text>
                    <Item stackedLabel style={[S.MT10]}>
                        <Label style={S.label}>Email</Label>
                        <Input
                            value={email}
                            onChangeText={setEmail}
                            style={[S.CLW]}
                            autoCapitalize={'none'}
                            keyboardType='email-address'
                        />
                    </Item>
                    <Item stackedLabel style={S.MT10}>
                        <Label style={S.label}>Password</Label>
                        <Input
                            style={[S.CLW]}
                            autoCapitalize={'none'}
                            secureTextEntry={true}
                            value={password}
                            onChangeText={setPassword}
                        />
                    </Item>
                    <View style={[S.Acenter]}>
                        <Button transparent block style={S.MT20} onPress={() => navigation.navigate('ForgotScreen')}>
                            <Text style={[S.F15, S.CLW]} >Forgot Password?</Text>
                        </Button>
                        <Button light block rounded style={S.MT20} onPress={onLoginPress} disabled={loading}>
                            {loading ?
                                <ActivityIndicator animating={true} size="small" color={COLOR.greenColor} /> :
                                <Text style={[S.F15, S.CLB]}> Log In </Text>
                            }
                        </Button>
                        <Button primary block rounded iconLeft style={S.MT20}>
                            <Icon name='facebook' type='FontAwesome' style={S.F15} />
                            <Text style={[S.F15, S.CLW]}>  Connect with Facebook </Text>
                        </Button>
                        <Button light block rounded iconLeft style={[S.MT20]} onPress={() => navigation.navigate('OwnerSignInScreen')}>
                            <Icon name='hospital-o' type='FontAwesome' style={S.F20} />
                            <Text style={[S.F15, S.CLB]}>  Sign In As Dispensary </Text>
                        </Button>
                        <Button transparent block style={S.MV10}>
                            <Text style={[S.F15, S.CLW]}>Don’t have an account?   </Text>
                            <Text onPress={() => navigation.navigate('SignUpScreen')} style={[S.F15, S.CLW, S.TDL]}>Sign up!</Text>
                        </Button>
                    </View>
                </Content>
            </ImageBackground>
        </Container>
    )

}

export default SignInScreen

const S = StyleSheet.create({
    ...Styles,
})