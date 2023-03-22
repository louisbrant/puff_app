import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { StyleSheet, ImageBackground, Text, View, ActivityIndicator, TouchableOpacity, Image } from 'react-native'
import { Container, Content, Item, Input, Label, Button, Icon, Toast, CheckBox, Body, ActionSheet } from 'native-base'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import * as ImagePicker from 'expo-image-picker'
import normalize from 'react-native-normalize'
import * as Permissions from 'expo-permissions'
import { firebase, Firestore, Styles, Images, LAYOUT, COLOR } from '../../constants'
import { GetDate, upload } from '../../redux/actions/authActions'

const OwnerSignUpScreen = ({ navigation }) => {
    const dispatch = useDispatch()
    const [username, setUsername] = useState('')
    const [full_address, setFullAddress] = useState('')
    const [email, setEmail] = useState('')
    const [address, setAddress] = useState('')
    const [country, setCountry] = useState('')
    const [state, setState] = useState('')
    const [city, setCity] = useState('')
    const [lat, setLat] = useState('')
    const [lon, setLon] = useState('')
    const [zip, setZip] = useState('')
    const [password, setPassword] = useState('')
    const [cPassword, setCPassword] = useState('')
    const [profile_image, setProfileImage] = useState(Images.profile_image)
    const [isTerm, setIsTerm] = useState(false)
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
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
        if (!username) {
            Toast.show({ text: `Wrong Dispensary Name!`, buttonText: "Okay", type: "danger" })
        } else if (!full_address) {
            Toast.show({ text: `Wrong Full Address!`, buttonText: "Okay", type: "danger" })
        } else if (reg.test(email) === false) {
            Toast.show({ text: `Wrong Email!`, buttonText: "Okay", type: "danger" })
        } else if (password !== cPassword) {
            Toast.show({ text: `Wrong Confirm Password!`, buttonText: "Okay", type: "danger" })
        } else if (!isTerm) {
            Toast.show({ text: `Please accept Terms & Conditions`, buttonText: "Okay", type: "danger" })
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
                        username: username,
                        full_address: full_address,
                        email: email,
                        address: address,
                        country: country,
                        state: state,
                        city: city,
                        lat: lat,
                        lon: lon,
                        zip: zip,
                        profile_image: url,
                        isDispensary: true,
                        isDispensaryVerified: false,
                        ...GetDate()
                    }
                    Firestore
                        .collection('users')
                        .doc(uid)
                        .set(data)
                        .then(() => {
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

    const onMap = (data, details) => {
        const zip = details?.address_components.find((addressComponent) =>
            addressComponent.types.includes('postal_code'),
        )?.short_name
        const country = details?.address_components.find((addressComponent) =>
            addressComponent.types.includes('country'),
        )?.long_name
        const city = details?.address_components.find((addressComponent) =>
            addressComponent.types.includes('locality'),
        )?.long_name
        const state = details?.address_components.find((addressComponent) =>
            addressComponent.types.includes('administrative_area_level_1'),
        )?.long_name
        const address = details?.address_components.find((addressComponent) =>
            addressComponent.types.includes('administrative_area_level_1'),
        )?.short_name
        const lat = details?.geometry.location.lat
        const lon = details?.geometry.location.lng
        const full_address = details?.formatted_address
        setFullAddress(full_address ? full_address : '')
        setAddress(address ? address : 'address')
        setCountry(country ? country : '')
        setState(state ? state : '')
        setCity(city ? city : '')
        setZip(zip ? zip : '')
        setLat(lat ? lat : '')
        setLon(lon ? lon : '')
    }

    return (
        <Container>
            <ImageBackground style={S.ImageBackgroundOt} source={Images.splash} resizeMode="cover">
                <Content contentContainerStyle={[S.PH10, S.PV20]} showsVerticalScrollIndicator={false}>
                    <Button transparent onPress={() => navigation.navigate('SignInScreen')}>
                        <Icon type='Entypo' name='chevron-thin-left' style={[S.CLW, S.F24]} />
                    </Button>
                    <View style={[S.PH20]}>
                        <View style={[S.Acenter, S.MT10]}>
                            <Icon name='hospital-o' type='FontAwesome' style={[S.F40, S.CLW]} />
                        </View>
                        <Text style={[S.F18, S.PV10, S.Tcenter, S.CLW, S.FW700]}>Dispensary Sign Up</Text>
                        <View style={[S.Acenter]}>
                            <TouchableOpacity
                                style={[S.avatar]}
                                onPress={() => ActionSheet.show({ options: LAYOUT.BUTTONS, title: "Select Image" }, pickImage)}
                            >
                                {profile_image ? <Image source={{ uri: profile_image }} style={[S.avatar]} /> : null}
                            </TouchableOpacity>
                        </View>
                        <Button transparent block onPress={() => ActionSheet.show({ options: LAYOUT.BUTTONS, title: "Select Image" }, pickImage)}>
                            <Text style={[S.F18, S.CLW]} >ADD PHOTO</Text>
                        </Button>
                        <Item stackedLabel>
                            <Label style={S.label}>Dispensary Name</Label>
                            <Input
                                autoCapitalize={'none'}
                                style={[S.CLW]}
                                value={username}
                                onChangeText={setUsername}
                            />
                        </Item>
                        <Item stackedLabel>
                            <Label style={S.label}>Full Address</Label>
                            <GooglePlacesAutocomplete
                                minLength={1}
                                autoFocus={false}
                                returnKeyType={'search'}
                                keyboardAppearance={'light'}
                                listViewDisplayed='false'
                                fetchDetails={true}
                                onPress={(data, details = null) => { if (details) { onMap(data, details) } }}
                                query={{ key: LAYOUT.googleMapsApiKey, language: 'en' }}
                                styles={{
                                    textInputContainer: { width: '100%', marginTop: normalize(10) },
                                    textInput: { width: '100%', backgroundColor: 'transparent', color: COLOR.whiteColor },
                                }}
                                nearbyPlacesAPI='GooglePlacesSearch'
                                debounce={200}
                            />
                        </Item>
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

                        <Button transparent block style={[S.MT20, S.PL10]}>
                            <CheckBox checked={isTerm} color="grey" onPress={() => setIsTerm(true)} />
                            <Body style={[S.PL20, { flexDirection: 'row' }]}>
                                <Text style={[S.CLW, S.F16]}>I accept the</Text>
                                <Text style={[S.CLW, S.F16]} onPress={() => navigation.navigate('TermsConditonsScreen')}> Terms & Conditions</Text>
                            </Body>
                        </Button>
                        <View style={[S.Acenter, S.PH10]}>
                            <Button primary block rounded iconLeft style={[S.MT20]} onPress={onRegister} disabled={loading}>
                                {loading ?
                                    <ActivityIndicator animating={true} size="small" color={COLOR.greenColor} /> :
                                    <Icon name='verified-user' type='MaterialIcons' style={S.F20} />
                                }
                                <Text style={[S.F18, S.CLW]}>  Get Verified </Text>
                            </Button>
                        </View>
                        <Button transparent block style={S.MT10}>
                            <Text style={[S.F15, S.CLW]}>Have an account?  </Text>
                            <Text onPress={() => navigation.navigate('OwnerSignInScreen')} style={[S.F15, S.CLW, S.TDL]}>Dispensary Sign in!</Text>
                        </Button>
                    </View>
                </Content>
            </ImageBackground>
        </Container>
    )

}

export default OwnerSignUpScreen

const S = StyleSheet.create(Styles)