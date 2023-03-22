import React from 'react'
import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from '@react-navigation/stack'
import SignIn from '../scenes/Auth/SignIn'
import SignUp from '../scenes/Auth/SignUp'
import OwnerSignIn from '../scenes/Auth/OwnerSignIn'
import OwnerSignUp from '../scenes/Auth/OwnerSignUp'
import Forgot from '../scenes/Auth/Forgot'
import TermsConditons from '../scenes/Settings/TermsConditons'
import { LAYOUT } from "../constants"

const Stack = createStackNavigator()

const Guest = () => {
	return (
		<NavigationContainer>
			<Stack.Navigator initialRouteName='SignInScreen'>
				<Stack.Screen name="SignInScreen" component={SignIn} options={LAYOUT.headerOption} />
				<Stack.Screen name="SignUpScreen" component={SignUp} options={LAYOUT.headerOption} />
				<Stack.Screen name="OwnerSignInScreen" component={OwnerSignIn} options={LAYOUT.headerOption} />
				<Stack.Screen name="OwnerSignUpScreen" component={OwnerSignUp} options={LAYOUT.headerOption} />
				<Stack.Screen name="ForgotScreen" component={Forgot} options={LAYOUT.headerOption} />
				<Stack.Screen name="TermsConditonsScreen" component={TermsConditons} options={LAYOUT.headerOption} />
			</Stack.Navigator>
		</NavigationContainer>
	)
}

export default Guest