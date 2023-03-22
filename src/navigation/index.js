import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { AppState } from 'react-native'
import GuestNavigation from './Guest'
import LoggedNavigation from './Logged'
import { Database } from '../constants'

const Navigation = () => {
  const { user, isLogin } = useSelector(state => state.auth)
  const [appState, setAppState] = useState(AppState.currentState)

  const _handleAppState = (next) => {
    if (isLogin) {
      if (appState.match(/inactive|background/) && next === 'active') {
        Database.ref(`user/${user.uid}`).set(true)
      } else {
        Database.ref(`user/${user.uid}`).set(false)
      }
    }
    setAppState(next)
  }

  const userSetting = () => {
    if (isLogin) {
      Database.ref(`user/${user.uid}`).set(true)
    } else {
      Database.ref(`user/${user.uid}`).set(false)
    }
  }

  useEffect(() => {
    AppState.addEventListener('change', _handleAppState)
    if (user) {
      Database.ref(`user/${user.uid}`).onDisconnect().set(false)
      userSetting()
    }
    return () => {
      AppState.removeEventListener('change', _handleAppState)
    }
  }, [])

  useEffect(() => {
    if (user)
      userSetting()
  }, [isLogin])

  if (isLogin) {
    return <LoggedNavigation />
  } else {
    return <GuestNavigation />
  }
}

export default Navigation