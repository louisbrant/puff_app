import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { StyleSheet, TouchableOpacity, View, Text, Image, ActivityIndicator, Picker } from "react-native"
import { Container, Icon, Content, Button, Item, Textarea, Input } from "native-base"
import normalize from "react-native-normalize"
import * as ImagePicker from "expo-image-picker"
import { COLOR, Styles, Firestore, Images, Storage, LAYOUT } from "../../constants"
import { GetDate } from "../../redux/actions/authActions"
import { Headers } from "../../components"

const CreateStrainScreen = ({ navigation, route: { params } }) => {
  const { user } = useSelector(state => state.auth)
  const [name, setName] = useState("")
  const [guide, setGuide] = useState("")
  const [details, setDetails] = useState("")
  const [description, setDescription] = useState("")
  const [photo, setPhoto] = useState(null)
  const [THC, setTHC] = useState("")
  const [CBD, setCBD] = useState("")
  const [delta, setDelta] = useState("")
  const [delta8, setDelta8] = useState("")
  const [deltaUnit, setDeltaUnit] = useState("mg")
  const [delta8Unit, setDelta8Unit] = useState("mg")
  const [THCUnit, setTHCUnit] = useState("mg")
  const [CBDUnit, setCBDUnit] = useState("mg")
  const [loading, setLoading] = useState(false)

  const upload = async (uri, path) => {
    const response = await fetch(uri)
    const blob = await response.blob()
    let photoRef = `${path}-${GetDate().createdAtSeconds}.jpg`
    const ref = Storage.child("strains").child(photoRef)
    await ref.put(blob)
    return { photoRef, photo: await ref.getDownloadURL() }
  }

  const remove = async (ref) => {
    Storage.child("strains").child(ref).delete().then(() => {
      console.log("photo remove success")
    }).catch(err => {
      console.log(err.message)
    })
  }


  const Error = (err) => {
    alert(err.message)
    setLoading(false)
  }

  const Success = (err) => {
    alert("Success")
    setLoading(false)
    navigation.goBack()
  }

  const submit = async () => {
    if (!name) {
      alert("Please enter name!")
    } else if (!details) {
      alert("Wrong Strain Details!")
    } else if (!guide) {
      alert("Wrong Strain Guide!")
    } else if (!description) {
      alert("Wrong Description!")
    } else if (!photo) {
      alert("Please add Strain Image!")
    } else {
      setLoading(true)
      const dispensary_id = user.uid
      const date = GetDate()
      const url = await upload(photo, dispensary_id)
      if (params && params.update) {
        await remove(params.photoRef)
        const strain = {
          dispensary_id,
          name,
          details,
          guide,
          description,
          THC,
          CBD,
          delta,
          delta8,
          deltaUnit,
          delta8Unit,
          THCUnit,
          CBDUnit,
          updatedAt: date.createdAt,
          updatedAtSeconds: date.createdAtSeconds,
          ...url,
        }
        Firestore.collection("strains").doc(params.id).set(strain, { merge: true }).then(Success).catch(Error)
      } else {
        const strain = {
          dispensary_id,
          name,
          details,
          guide,
          description,
          THC,
          CBD,
          delta,
          delta8,
          deltaUnit,
          delta8Unit,
          THCUnit,
          CBDUnit,
          createdAt: date.createdAt,
          createdAtSeconds: date.createdAtSeconds,
          ...url,
        }
        Firestore.collection("strains").add(strain).then(Success).catch(Error)
      }
    }
  }

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: false,
      })
      if (!result.cancelled) {
        setPhoto(result.uri)
      }
    } catch (e) { console.log(e) }
  }

  useEffect(() => {
    if (params && params.update) {
      setName(params.name)
      setGuide(params.guide)
      setDetails(params.details)
      setDescription(params.description)
      setPhoto(params.photo)
      setTHC(params.THC)
      setCBD(params.CBD)
      setDelta(params.delta)
      setDelta8(params?.delta8)
      setDeltaUnit(params?.deltaUnit)
      setDelta8Unit(params?.delta8Unit)
      setTHCUnit(params?.THCUnit)
      setCBDUnit(params?.CBDUnit)
    } else {
      setName("")
      setGuide("")
      setDetails("")
      setDescription("")
      setPhoto(null)
      setTHC("")
      setCBD("")
      setDelta("")
      setDelta8("")
      setDeltaUnit("mg")
      setDelta8Unit("mg")
      setTHCUnit("mg")
      setCBDUnit("mg")
    }
  }, [params])

  return (
    <Container>
      <Headers
        title={"Create Strain"}
        left={
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon type="Entypo" name="chevron-thin-left" style={[S.CLW, S.F20]} />
          </TouchableOpacity>
        }
      />
      <Content style={[S.BKBase]} showsVerticalScrollIndicator={false}>
        <View style={[S.PH20, S.PV20]}>
          {
            photo ?
              <TouchableOpacity onPress={pickImage} style={[[S.cameraCover, S.Hidden]]}>
                <Image source={{ uri: photo }} style={[S.cameraPhoto]} />
              </TouchableOpacity> :
              <View style={[S.cameraCover]}>
                <TouchableOpacity onPress={pickImage}>
                  <Image source={Images.cameraIcon} style={[S.cameraIcon]} />
                </TouchableOpacity>
              </View>
          }
          <Item regular style={[S.MT15, S.Border]}>
            <Icon name="box" type="Feather" style={[S.InputIcon]} />
            <Input
              value={name}
              onChangeText={setName}
              placeholder="Name"
              style={[S.InputText]}
            />
          </Item>
          <Item regular style={[S.MT15, S.Border]}>
            <Icon name="text-document" type="Entypo" style={[S.InputIcon]} />
            <Picker
              selectedValue={details}
              onValueChange={setDetails}
              style={[S.W90P, S.CLB, S.H50]}
              textStyle={[S.CLB]}
              mode="dropdown"
              placeholder="Strain Details"
              placeholderStyle={{ color: COLOR.blackColor }}
            >
              {LAYOUT.StrainDetails.map((item, key) => <Picker.Item key={key} {...item} />)}
            </Picker>
          </Item>
          <Item regular style={[S.MT15, S.Border]}>
            <Icon name="tago" type="AntDesign" style={[S.InputIcon]} />
            <Picker
              selectedValue={guide}
              onValueChange={setGuide}
              style={[S.W90P, S.CLB, S.H50]}
              textStyle={[S.CLB]}
              mode="dropdown"
              placeholder="Strain Guide"
              placeholderStyle={{ color: COLOR.blackColor }}
            >
              {LAYOUT.StrainGuide.map((item, key) => <Picker.Item key={key} {...item} />)}
            </Picker>
          </Item>
          <Item regular style={[S.MT15, S.Border]}>
            <Input
              value={delta}
              onChangeText={setDelta}
              placeholder="Delta 10"
              style={[S.InputText]}
            />
            <Picker
              selectedValue={deltaUnit}
              onValueChange={setDeltaUnit}
              style={[{ width: "30%" }, S.CLB, S.H50]}
              textStyle={[S.CLB]}
              mode="dropdown"
              placeholder="Delta 10 Unit"
              placeholderStyle={{ color: COLOR.blackColor }}
            >
              {LAYOUT.StrainUnit.map((item, key) => <Picker.Item key={key} {...item} />)}
            </Picker>
          </Item>
          <Item regular style={[S.MT15, S.Border]}>
            <Input
              value={delta8}
              onChangeText={setDelta8}
              placeholder="Delta 8"
              style={[S.InputText]}
            />
            <Picker
              selectedValue={delta8Unit}
              onValueChange={setDelta8Unit}
              style={[{ width: "30%" }, S.CLB, S.H50]}
              textStyle={[S.CLB]}
              mode="dropdown"
              placeholder="Delta 8 Unit"
              placeholderStyle={{ color: COLOR.blackColor }}
            >
              {LAYOUT.StrainUnit.map((item, key) => <Picker.Item key={key} {...item} />)}
            </Picker>
          </Item>
          <Item regular style={[S.MT15, S.Border]}>
            <Input
              value={THC}
              onChangeText={setTHC}
              placeholder="THC"
              style={[S.InputText]}
            />
            <Picker
              selectedValue={THCUnit}
              onValueChange={setTHCUnit}
              style={[{ width: "30%" }, S.CLB, S.H50]}
              textStyle={[S.CLB]}
              mode="dropdown"
              placeholder="THC Unit"
              placeholderStyle={{ color: COLOR.blackColor }}
            >
              {LAYOUT.StrainUnit.map((item, key) => <Picker.Item key={key} {...item} />)}
            </Picker>
          </Item>
          <Item regular style={[S.MT15, S.Border]}>
            <Input
              value={CBD}
              onChangeText={setCBD}
              placeholder="CBD"
              style={[S.InputText]}
            />
            <Picker
              selectedValue={CBDUnit}
              onValueChange={setCBDUnit}
              style={[{ width: "30%" }, S.CLB, S.H50]}
              textStyle={[S.CLB]}
              mode="dropdown"
              placeholder="CBD Unit"
              placeholderStyle={{ color: COLOR.blackColor }}
            >
              {LAYOUT.StrainUnit.map((item, key) => <Picker.Item key={key} {...item} />)}
            </Picker>
          </Item>
          <Item regular style={[S.MT15, S.Astart, S.Border]}>
            <Icon name="book-open" type="Feather" style={[S.MT15, S.InputIcon]} />
            <Textarea
              value={description}
              onChangeText={setDescription}
              rowSpan={4}
              maxLength={400}
              placeholder="Description"
              placeholderTextColor={COLOR.InputBorder}
              style={[S.PR50, S.MT15, { borderColor: "transparent" }]}
            />
          </Item>
          <Button success full onPress={submit} style={[S.ROW, S.MT20]} disabled={loading}>
            {loading ?
              <ActivityIndicator animating={true} size="small" color={COLOR.greenColor} /> :
              <Text style={[S.F18, S.CLW]}>Submit</Text>
            }
          </Button>
        </View>
      </Content>
    </Container>
  )
}

export default CreateStrainScreen

const S = StyleSheet.create({
  ...Styles,
  cameraCover: {
    width: "100%",
    height: normalize(180),
    borderRadius: 5,
    borderColor: COLOR.Tag3Color,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cameraPhoto: {
    height: normalize(180),
    width: "100%",
    resizeMode: "contain"
  },
  cameraIcon: {
    width: normalize(50),
    height: normalize(50),
    resizeMode: "contain"
  },
  InputIcon: {
    fontSize: normalize(24),
    color: COLOR.TextColor
  },
  InputText: {
    color: COLOR.blackColor
  },
  Border: {
    borderColor: COLOR.Tag3Color
  }
})