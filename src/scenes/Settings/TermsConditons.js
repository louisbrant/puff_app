import React from 'react'
import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import { Container, Icon, Content } from 'native-base'
import { Styles } from "../../constants"
import { Headers } from '../../components'

const TermsConditonsScreen = ({ navigation }) => {
  return (
    <Container>
      <Headers
        title='Terms & Conditons'
        left={
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon type='Entypo' name='chevron-thin-left' style={[S.CLW, S.F20]} />
          </TouchableOpacity>
        }
      />
      <Content style={S.PH20} showsVerticalScrollIndicator={false}>
        <Text style={[S.Tcenter, S.F18, S.CLB, S.MT10]}> {'This privacy notice discloses the privacy practices for https://projectpuff.com/ and its mobile application. Soar also known as Project Puff Co.. This privacy notice applies solely to information collected by this website. It will notify you of the following:'}</Text>
        <Text style={[S.Tcenter, S.F18, S.CLB]}> {"\n1.	What personally identifiable information is collected from you through the website, how it is used and with whom it may be shared.\n2.	What choices are available to you regarding the use of your data.\n3.	The security procedures in place to protect the misuse of your information.\n4.	How you can correct any inaccuracies in the information\n"}</Text>
        <Text style={[S.Tcenter, S.F24, S.CLB, S.FW700]}> {"\nInformation Collection, Use, and Sharing "}</Text>
        <Text style={[S.Tcenter, S.F18, S.CLB]}> {"\nWe are the sole owners of the information collected on this site. We only have access to/collect information that you voluntarily give us via email or other direct contact from you. We will not sell or rent this information to anyone. We will use your information to respond to you, regarding the reason you contacted us."}</Text>
        <Text style={[S.Tcenter, S.F18, S.CLB]}> {"\nWe will not share your information with any third party outside of our organization, other than as necessary to fulfill your request, e.g. to ship an order. Unless you ask us not to, we may contact you via email in the future to tell you about specials, new products or services, or changes to this privacy policy."}</Text>
        <Text style={[S.Tcenter, S.F18, S.CLB]}> {"\nWe will not share your information with any third party outside of our organization, other than as necessary to fulfill your request, e.g. to ship an order. Unless you ask us not to, we may contact you via email in the future to tell you about specials, new products or services, or changes to this privacy policy."}</Text>
        <Text style={[S.Tcenter, S.F18, S.CLB]}> {"\nYour Access to and Control Over Information You may opt out of any future contacts from us at any time. "}</Text>
        <Text style={[S.Tcenter, S.F18, S.CLB]}> {"\nYou can do the following at any time by contacting us via the email address or phone number given on our website: "}</Text>
        <Text style={[S.Tcenter, S.F18, S.CLB]}> {"See what data we have about you, if any. \nChange/correct any data we have about you. \nHave us delete any data we have about you. \nExpress any concern you have about our use of your data.  "}</Text>
        <Text style={[S.Tcenter, S.F18, S.CLB]}> {"\nSecurity\n"}</Text>
        <Text style={[S.Tcenter, S.F18, S.CLB]}> {"We take precautions to protect your information. When you submit sensitive information via the website, your information is protected both online and offline. Wherever we collect sensitive information (such as credit card data), that information is encrypted and transmitted to us in a secure way. "}</Text>
        <Text style={[S.Tcenter, S.F18, S.CLB]}> {'\nYou can verify this by looking for a lock icon in the address bar and looking for "https" at the beginning of the address of the Web page. '}</Text>
        <Text style={[S.Tcenter, S.F18, S.CLB]}> {"\nWhile we use encryption to protect sensitive information transmitted online, we also protect your information offline. Only employees who need the information to perform a specific job (for example, billing or customer service) are granted access to personally identifiable information. "}</Text>
        <Text style={[S.Tcenter, S.F18, S.CLB, S.MB10]}> {"\nThe computers/servers in which we store personally identifiable information are kept in a secure environment. If you feel that we are not abiding by this privacy policy, you should contact us immediately via telephone at 386-218-6985 or paxi@gmail.com. "}</Text>
      </Content>
    </Container>
  )
}

export default TermsConditonsScreen

const S = StyleSheet.create({
  ...Styles,
})