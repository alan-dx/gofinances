import React from 'react'


import { Dashboard } from '../screens/Dashboard'
import { Register } from '../screens/Register'

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

const { Navigator, Screen } = createBottomTabNavigator()

export function AppRoutes() {
  return (
    <Navigator>
      <Screen 
        name="Listagem"
        component={Dashboard}
      />

      <Screen 
        name="Cadastrar"
        component={Register}
      />
    </Navigator>
  )
}