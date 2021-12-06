import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import { SignIn } from '../screens/SignIn'

const { Navigator, Screen } = createStackNavigator()

export function AuthRoutes() {
  return (
    <Navigator screenOptions={{ header: () => false }} >
      <Screen 
        name="SignIn"
        component={SignIn}
      />
    </Navigator>
  )
}

