import React, { Fragment, useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { StyleSheet, TouchableOpacity, Text, Image, FlatList } from "react-native"
import { Container, Icon, View } from "native-base"
import { Styles, Firestore } from "../../constants"
import { Dispensary, ProductItem, Headers, Loading } from "../../components"

const MyDispensary = ({ navigation }) => {
  const { user } = useSelector(state => state.auth)
  const [products, setProducts] = useState([])
  const [entities, setEntities] = useState({})
  const [loading, setLoading] = useState(false)

  const Error = (error) => {
    console.log(error)
    setLoading(false)
  }

  const Success = (querySnapshot) => {
    const productsData = []
    querySnapshot.forEach(doc => {
      const entity = doc.data()
      if (entity.ratings && Object.keys(entity.ratings).length) {
        let ratings = Object.values(entity.ratings)
        let rate = ratings.reduce((a, b) => a + b) / ratings.length
        entity.rateCount = ratings.length
        entity.rate = rate
      } else {
        entity.rateCount = 0
        entity.rate = 0
      }
      entity.id = doc.id
      productsData.push(entity)
    })
    setProducts(productsData)
    setLoading(false)
  }

  const loadData = () => {
    setLoading(true)
    Firestore.collection("strains")
      .where("dispensary_id", "==", user.uid)
      .get().then(Success).catch(Error)

    Firestore.collection("users").doc(user.uid).get().then(postSnap => {
      const entity = postSnap.data()
      if (entity.ratings && Object.keys(entity.ratings).length) {
        let ratings = Object.values(entity.ratings)
        let rate = ratings.reduce((a, b) => a + b) / ratings.length
        entity.rateCount = ratings.length
        entity.rate = rate
      } else {
        entity.rateCount = entity.rate = 0
      }
      setEntities(entity)
    })
  }

  useEffect(() => {
    loadData()
  }, [navigation])

  useEffect(() => {
    navigation.addListener("focus", loadData)
  }, [])

  return (
    <Container style={[S.BKBase]}>
      <Headers
        title="My Dispensary"
        left={
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon type="Entypo" name="chevron-thin-left" style={[S.CLW, S.F20]} />
          </TouchableOpacity>
        }
        right={
          <TouchableOpacity style={[S.Jcenter, S.MB10, S.PL10]} onPress={() => navigation.navigate("CreateDStrainScreen")}>
            <Icon name="add-circle-outline" type="MaterialIcons" style={[S.F35, S.CLW]} />
          </TouchableOpacity>
        }
      />
      {
        Object.keys(entities).length > 1 ?
          <Fragment>
            <View style={[S.BKW, S.PB30]}>
              <Text style={[S.F18, S.FW700, S.CLG, S.PL25, S.MT20]}>FIND IT</Text>
              <Dispensary item={entities} show />
            </View>
            <View style={[S.P20, S.BKW, S.MT10]}>
              <View style={[S.ROW, S.Jbetween]}>
                <View style={[S.ROW]}>
                  <Text style={[S.F18, S.FW700, S.CLG]}>PHOTOS  </Text>
                  <Text style={[S.F18, S.CLGY]}>({entities.images ? entities.images.length : 0} Photos)</Text>
                </View>
                <TouchableOpacity onPress={() => navigation.navigate("MyPhotosScreen", entities)}>
                  <Text style={[S.F18, S.FW700, S.CLinfo]}>SEE ALL</Text>
                </TouchableOpacity>
              </View>
              {
                entities.images && entities.images.length ?
                  <View style={[S.ROW, S.PT10]}>
                    {entities.images.slice(0, 4).map((item, key) => (
                      <Image source={{ uri: item }} style={[S.icons, S.MR20, { resizeMode: "contain" }]} key={key} />
                    ))}
                    {
                      entities.images.length > 4 ?
                        <TouchableOpacity style={[S.icons, S.BKBase, S.Jcenter, S.Acenter]} onPress={() => navigation.navigate("MyPhotosScreen", entities)}>
                          <Text style={[S.F13, S.FW700, S.CLIcon]}>{"View\nMore"}</Text>
                        </TouchableOpacity> : null
                    }
                  </View> : null
              }
            </View>
            {
              products.length ?
                <View style={[S.PH20, S.PT10, S.MT10, S.BKW]}>
                  <Text style={[S.F18, S.FW700, S.CLG]}>MENU</Text>
                </View>
                : null
            }
            <FlatList
              data={products}
              style={[S.BKW]}
              contentContainerStyle={S.PH20}
              refreshing={loading}
              onRefresh={loadData}
              contentContainerStyle={[S.PH15, S.PV15]}
              showsVerticalScrollIndicator={false}
              keyExtractor={(item, index) => `${index}`}
              renderItem={({ item }) => <ProductItem item={item} />}
            />
          </Fragment>
          : <Loading />
      }
    </Container >
  )
}

export default MyDispensary

const S = StyleSheet.create({
  ...Styles,
})