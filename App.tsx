import React from 'react';

import 'intl'
import 'intl/locale-data/jsonp/pt-BR'

import { ThemeProvider } from 'styled-components';
import AppLoading from 'expo-app-loading';

import theme from './src/global/styles/theme'

import { 
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold
} from '@expo-google-fonts/poppins'

import { Routes } from './src/routes'

import { StatusBar } from 'expo-status-bar';

import { AuthProvider, useAuth } from './src/hooks/auth'

export default function App() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold
  })

  const { userStorageLoading } = useAuth() 

  if (!fontsLoaded || userStorageLoading) {
    return <AppLoading />
  }

  return (
    <ThemeProvider theme={theme} >
      {/* <NavigationContainer>
        <AuthProvider>
          <SignIn />
        </AuthProvider>
      </NavigationContainer> */}
      <AuthProvider>
        <Routes />
      </AuthProvider>
      <StatusBar style="light" />
    </ThemeProvider>
  )
}
