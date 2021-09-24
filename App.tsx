import React from 'react';
import { ThemeProvider } from 'styled-components';
import AppLoading from 'expo-app-loading';

import theme from './src/global/styles/theme'

import { 
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold
} from '@expo-google-fonts/poppins'

import { NavigationContainer } from '@react-navigation/native'

import { StatusBar } from 'expo-status-bar';

import { Dashboard } from './src/screens/Dashboard';
import { Register } from './src/screens/Register'
import { CategorySelect } from './src/screens/CategorySelect';
import { AppRoutes } from './src/routes/app.routes';

export default function App() {

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold
  })

  if (!fontsLoaded) {
    return <AppLoading />
  }

  return (
    <ThemeProvider theme={theme} >
      <NavigationContainer>
        <AppRoutes />
      </NavigationContainer>
      <StatusBar style="light" />
    </ThemeProvider>
  )
}
