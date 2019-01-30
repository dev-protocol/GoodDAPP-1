// @flow
import React from 'react'

import { createSwitchNavigator } from '@react-navigation/core'

import Rewards from './Rewards'
import BuySell from './BuySell'
import Dashboard from './Dashboard'
import Donate from './Donate'
import TabsView from './TabsView'

// TODO: Should we do this diferently?
import rewardsIcon from '../../assets/rewardsIcon.png'
import homeIcon from '../../assets/homeIcon.png'
import buySellIcon from '../../assets/buySellIcon.png'
import donateIcon from '../../assets/donateIcon.png'

type AppNavigationState = {
  pubkey: string
}

type AppNavigationProps = {
  navigation: any
}

const routes = {
  Rewards: {
    screen: Rewards,
    icon: rewardsIcon
  },
  BuySell: {
    screen: BuySell,
    icon: buySellIcon
  },
  Dashboard: {
    screen: Dashboard,
    icon: homeIcon
  },
  Donate: {
    screen: Donate,
    icon: donateIcon
  }
}

const initialRouteName = 'Dashboard'
const AppNavigator = createSwitchNavigator(routes, { initialRouteName })

/**
 * Switch navigation between all screens on the tabs. Each of this screen should be a StackNavigation
 * Dashboard is the initial route
 */
class AppNavigation extends React.Component<AppNavigationProps, AppNavigationState> {
  static router = AppNavigator.router

  render() {
    return (
      <React.Fragment>
        <AppNavigator navigation={this.props.navigation} screenProps={{ routes }} />
      </React.Fragment>
    )
  }
}

export default AppNavigation
