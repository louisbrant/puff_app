import React from 'react'
import { Provider } from 'react-redux'
import { LogBox } from 'react-native'
import { Root, StyleProvider } from 'native-base'
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from './src/redux/Store'
import { LAYOUT } from './src/constants'
import Navigation from './src/navigation'
import getTheme from "./src/theme/components"
import variables from "./src/theme/variables/commonColor"

LogBox.ignoreLogs(LAYOUT.Warning)

const App = () => {
  return (
    <StyleProvider style={getTheme(variables)}>
      <Provider store={store}>
        <PersistGate persistor={persistor} loading={null}>
          <Root>
            <Navigation />
          </Root>
        </PersistGate>
      </Provider>
    </StyleProvider>
  )
}

export default App