
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { StyleSheet, ImageBackground, Text, View, TouchableOpacity, Alert, Picker, ActivityIndicator, Image } from 'react-native'
import { Container, Content, Item, Input, Label, Button, Icon, Toast, CheckBox, Body, ActionSheet } from 'native-base'
import * as ImagePicker from 'expo-image-picker'
import * as Permissions from 'expo-permissions'
import { Col, Grid } from 'react-native-easy-grid'
import DateTimePicker from '@react-native-community/datetimepicker'
import normalize from 'react-native-normalize'
import State from '../../assets/Data/State.json'
import moment from 'moment'
import { Styles, Images, COLOR, firebase, Firestore, LAYOUT } from '../../constants'
import { GetDate, upload } from '../../redux/actions/authActions'

const SignUpScreen = ({ navigation }) => {
    const dispatch = useDispatch()
    const [username, setUsername] = useState('')
    const [firstname, setFirstname] = useState('')
    const [lastname, setLastname] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [cPassword, setCPassword] = useState('')
    const [state, setState] = useState('')
    const [gender, setGender] = useState('')
    const [birthday, setBirthday] = useState(834907574428)
    const [profile_image, setProfileImage] = useState(Images.profile_image)
    const [isTerm, setIsTerm] = useState(false)
    const [show, setShow] = useState(false)
    const [loading, setLoading] = useState(false)

    const Error = (error) => {
        setLoading(false)
        if (error.code == 'auth/email-already-in-use') {
            return Toast.show({ text: `Everyone should have their own email associated`, buttonText: "Okay", type: "danger", duration: 4000 })
        } else {
            return Toast.show({ text: error.message, buttonText: "Okay", type: "danger", duration: 4000 })
        }
    }

    const onRegister = () => {
        const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
        console.log({
            username,
            firstname,
            lastname,
            email,
            password,
            cPassword,
            state,
            gender,
            birthday,
            profile_image,
            isTerm,
            show,
            loading,
        })
        if (username === '') {
            return Toast.show({ text: `Wrong User name!`, buttonText: "Okay", type: "danger" })
        } else if (firstname === '') {
            return Toast.show({ text: `Wrong First name!`, buttonText: "Okay", type: "danger" })
        } else if (lastname === '') {
            return Toast.show({ text: `Wrong Last name!`, buttonText: "Okay", type: "danger" })
        } else if (email === '' || reg.test(email) === false) {
            return Toast.show({ text: `Wrong Email!`, buttonText: "Okay", type: "danger" })
        } else if (state === '') {
            return Toast.show({ text: `Wrong State!`, buttonText: "Okay", type: "danger" })
        } else if (gender === '') {
            return Toast.show({ text: `Wrong Gender!`, buttonText: "Okay", type: "danger" })
        } else if (birthday === '') {
            return Toast.show({ text: `Wrong Birthday!`, buttonText: "Okay", type: "danger" })
        } else if (profile_image === '') {
            return Toast.show({ text: `Wrong Profile Image!`, buttonText: "Okay", type: "danger" })
        } else if (password === '') {
            return Toast.show({ text: `Wrong Password!`, buttonText: "Okay", type: "danger" })
        } else if (password !== cPassword || cPassword == '') {
            return Toast.show({ text: `Wrong Confirm Password!`, buttonText: "Okay", type: "danger" })
        } else if (!isTerm) {
            return Toast.show({ text: `Please accept Terms & Conditions`, buttonText: "Okay", type: "danger" })
        } else {
            setLoading(true)
            firebase
                .auth()
                .createUserWithEmailAndPassword(email, password)
                .then(async (response) => {
                    const uid = response.user.uid
                    const url = await upload(profile_image, uid)
                    const data = {
                        uid: uid,
                        email: email,
                        username: username,
                        first_name: firstname,
                        last_name: lastname,
                        gender: gender,
                        state: state,
                        birthday: birthday,
                        isDispensary: false,
                        profile_image: url,
                        ...GetDate()
                    }
                    Firestore
                        .collection('users')
                        .doc(uid)
                        .set(data)
                        .then(() => {
                            setLoading(false)
                            dispatch({ type: "LOGIN", payload: data })
                        }).catch(Error)
                }).catch(Error)
        }
    }

    const pickImage = async (type) => {
        if (type === 1) {
            try {
                const result = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.All,
                    allowsEditing: false,
                    aspect: [1, 1],
                })
                if (!result.cancelled) {
                    setProfileImage(result.uri)
                }
            } catch (e) {
                console.log(e)
            }
        } else if (type === 0) {
            const { granted } = await Permissions.askAsync(Permissions.CAMERA)
            if (granted) {
                const result = await ImagePicker.launchCameraAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    allowsEditing: false,
                    aspect: [1, 1],
                    quality: 0.5
                })
                if (!result.cancelled) {
                    setProfileImage(result.uri)
                }
            } else {
                Alert.alert("you need to give up permission to work")
            }
        }
    }

    return (
        <Container>
            <ImageBackground style={S.ImageBackgroundOt} source={Images.splash} resizeMode="cover">
                {show && (
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={new Date(birthday)}
                        mode={'date'}
                        display="default"
                        onChange={(e, d) => {
                            if (d == undefined) {
                                setShow(false)
                            } else {
                                setShow(false)
                                setBirthday(new Date(d).valueOf())
                            }
                        }}
                    />
                )}
                <Content contentContainerStyle={[S.PH10, S.PV20]} showsVerticalScrollIndicator={false}>
                    <Button transparent onPress={() => navigation.navigate('SignInScreen')}>
                        <Icon type='Entypo' name='chevron-thin-left' style={[S.CLW, S.F22]} />
                    </Button>
                    <View style={[S.PH20]}>
                        <Text style={[S.F16, S.PV10, S.Tcenter, S.CLW]}>Create Account</Text>
                        <Text style={[S.F13, S.PV10, S.Tcenter, S.CLW]}>Must be 21+ to make an account</Text>
                        <View style={[S.Acenter]}>
                            <TouchableOpacity
                                style={[S.avatar]}
                                onPress={() => ActionSheet.show({ options: LAYOUT.BUTTONS, title: "Select Image" }, pickImage)}
                            >
                                {profile_image ? <Image source={{ uri: profile_image }} style={[S.avatar]} /> : null}
                            </TouchableOpacity>
                        </View>
                        <Button transparent block onPress={() => ActionSheet.show({ options: LAYOUT.BUTTONS, title: "Select Image" }, pickImage)}>
                            <Text style={[S.F15, S.CLW]} >ADD PHOTO</Text>
                        </Button>
                        <Item stackedLabel>
                            <Label style={S.label}>Username</Label>
                            <Input
                                autoCapitalize={'none'}
                                style={[S.CLW]}
                                value={username}
                                onChangeText={setUsername}
                            />
                        </Item>
                        <Grid>
                            <Col>
                                <Item stackedLabel style={S.MT10}>
                                    <Label style={S.label}>First Name</Label>
                                    <Input
                                        autoCapitalize={'none'}
                                        style={[S.CLW]}
                                        value={firstname}
                                        onChangeText={setFirstname}
                                    />
                                </Item>
                            </Col>
                            <Col>
                                <Item stackedLabel style={S.MT10}>
                                    <Label style={S.label}>Last Name</Label>
                                    <Input
                                        autoCapitalize={'none'}
                                        style={[S.CLW]}
                                        value={lastname}
                                        onChangeText={setLastname}
                                    />
                                </Item>
                            </Col>
                        </Grid>
                        <Item stackedLabel style={S.MT10}>
                            <Label style={S.label}>Email</Label>
                            <Input
                                autoCapitalize={'none'}
                                style={[S.CLW]}
                                value={email}
                                onChangeText={setEmail}
                            />
                        </Item>
                        <Item stackedLabel style={S.MT10}>
                            <Label style={S.label}>Password</Label>
                            <Input
                                autoCapitalize={'none'}
                                style={[S.CLW]}
                                secureTextEntry={true}
                                value={password}
                                onChangeText={setPassword}
                            />
                        </Item>
                        <Item stackedLabel style={S.MT10}>
                            <Label style={S.label}>Confirm Password</Label>
                            <Input
                                autoCapitalize={'none'}
                                style={[S.CLW]}
                                secureTextEntry={true}
                                value={cPassword}
                                onChangeText={setCPassword}
                            />
                        </Item>
                        <Label style={[S.label, S.MT10, S.ML5]}>Birthday</Label>
                        <Item onPress={() => setShow(true)}>
                            <Input
                                value={moment(birthday).format('YYYY-MM-DD')}
                                onFocus={() => setShow(true)}
                                autoCapitalize={'none'}
                                style={[S.CLW]}
                            />
                            <TouchableOpacity onPress={() => setShow(true)}>
                                <Icon type='Feather' name='calendar' style={[S.CLW, S.F24]} />
                            </TouchableOpacity>
                        </Item>
                        <Item style={[S.MT10, { margin: 0 }]}>
                            <Picker
                                mode="dropdown"
                                textStyle={[S.CLW]}
                                style={[S.CLW, { height: normalize(60), width: '100%' }]}
                                placeholder="Gender"
                                placeholderStyle={{ color: COLOR.whiteColor }}
                                selectedValue={gender}
                                onValueChange={setGender}
                            >
                                <Picker.Item label="Gender" value="" />
                                <Picker.Item label="Male" value="Male" />
                                <Picker.Item label="Female" value="Female" />
                            </Picker>
                        </Item>
                        <Item style={[S.MT10, { margin: 0 }]}>
                            <Picker
                                mode="dropdown"
                                textStyle={[S.CLW]}
                                style={[S.CLW, { height: normalize(60), width: '100%' }]}
                                placeholder="State"
                                placeholderStyle={{ color: COLOR.whiteColor }}
                                selectedValue={state}
                                onValueChange={setState}
                            >
                                {
                                    State.map((item, key) => (
                                        <Picker.Item label={item.name} value={item.name} key={key} />
                                    ))
                                }
                            </Picker>
                        </Item>
                        <Button transparent block style={[S.MT20, S.PL10]}>
                            <CheckBox checked={isTerm} color="grey" onPress={() => setIsTerm(true)} />
                            <Body style={[S.PL20, { flexDirection: 'row' }]}>
                                <Text style={[S.CLW, S.F16]} >I accept the</Text>
                                <Text style={[S.CLW, S.F16]} onPress={() => navigation.navigate('TermsConditonsScreen')}> Terms & Conditions</Text>
                            </Body>
                        </Button>
                        <View style={[S.Acenter, S.PH10]}>
                            <Button light block rounded style={S.MT20} onPress={onRegister} disabled={loading}>
                                {loading ?
                                    <ActivityIndicator animating={true} size="small" color={COLOR.greenColor} /> :
                                    <Text style={[S.F15, S.CLB]}> Sign Up </Text>
                                }
                            </Button>
                            <Button primary block rounded iconLeft style={[S.MT20]} onPress={() => navigation.navigate('OwnerSignUpScreen')}>
                                <Icon name='hospital-o' type='FontAwesome' style={S.F20} />
                                <Text style={[S.F15, S.CLW]}>  Sign Up As Dispensary </Text>
                            </Button>
                            <Button transparent block style={S.MT10}>
                                <Text style={[S.F15, S.CLW]}>Have an account?  </Text>
                                <Text onPress={() => navigation.navigate('SignInScreen')} style={[S.F15, S.CLW, S.TDL]}>Sign in!</Text>
                            </Button>
                        </View>
                    </View>
                </Content>
            </ImageBackground>
        </Container >
    )
}

export default SignUpScreen

const S = StyleSheet.create(Styles)