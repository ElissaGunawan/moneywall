import React from 'react'
import { Account, Achievement, AchievementCompleted, DashboardAccount, DashboardExpenses, DashboardIncome, DashboardLeaderboard, Expenses, Income, Leaderboard, LoginScreen, Profile, Quest, QuestCompleted, RegisterScreen, StartScreen, EditAccount, EditIncome, EditExpense, EditProfile } from './src/screens'
import { createStackNavigator } from '@react-navigation/stack'
import { NavigationContainer, getFocusedRouteNameFromRoute } from '@react-navigation/native'
import { Provider } from 'react-native-paper'
import { theme } from './src/core/theme'
import 'react-native-gesture-handler';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image, StyleSheet } from 'react-native'

const Tab = createBottomTabNavigator();

const Stack = createStackNavigator()

function Stacks() {
  return (
    <Stack.Navigator
    screenOptions={{ headerShown: false }}
    >
      
      <Stack.Screen name="StartScreen" component={StartScreen} />
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
      <Stack.Screen name="DashboardIncome" component={DashboardIncome} />
      <Stack.Screen name="DashboardExpenses" component={DashboardExpenses} />
      <Stack.Screen name="DashboardAccount" component={DashboardAccount} />
      <Stack.Screen name="DashboardLeaderboard" component={DashboardLeaderboard} />
      <Stack.Screen name="Income" component={Income} />
      <Stack.Screen name="Expenses" component={Expenses} />
      <Stack.Screen name="Account" component={Account} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="EditAccount" component={EditAccount} />
      <Stack.Screen name="EditIncome" component={EditIncome} />
      <Stack.Screen name="EditExpense" component={EditExpense} />
      <Stack.Screen name="EditProfile" component={EditProfile} />
    </Stack.Navigator>
  )
}

const ProfileStack = createStackNavigator()

function ProfileStacks() {
  return (
    <ProfileStack.Navigator
    screenOptions={{ headerShown: false }}
    >
      <ProfileStack.Screen name="Profile" component={Profile} />
      <ProfileStack.Screen name="Quest" component={Quest} />
      <ProfileStack.Screen name="QuestCompleted" component={QuestCompleted} />
      <ProfileStack.Screen name="Achievement" component={Achievement} />
      <ProfileStack.Screen name="AchievementCompleted" component={AchievementCompleted} />
      <ProfileStack.Screen name="EditProfile" component={EditProfile} />
    </ProfileStack.Navigator>
  )
}
const AccountStack = createStackNavigator()

function AccountStacks() {
  return (
    <AccountStack.Navigator
    screenOptions={{ headerShown: false }}
    >
      <AccountStack.Screen name="Account" component={Account} />
      <AccountStack.Screen name="EditAccount" component={EditAccount} />
    </AccountStack.Navigator>
  )
}
const IncomeStack = createStackNavigator()

function IncomeStacks() {
  return (
    <IncomeStack.Navigator
    screenOptions={{ headerShown: false }}
    >
      <IncomeStack.Screen name="Income" component={Income} />
      <IncomeStack.Screen name="EditIncome" component={EditIncome} />
    </IncomeStack.Navigator>
  )
}
const ExpenseStack = createStackNavigator()

function ExpenseStacks() {
  return (
    <ExpenseStack.Navigator
    screenOptions={{ headerShown: false }}
    >
      <ExpenseStack.Screen name="Expenses" component={Expenses} />
      <ExpenseStack.Screen name="EditExpense" component={EditExpense} />
    </ExpenseStack.Navigator>
  )
}

export default function App () {
  return (
    <Provider theme={theme}>
      <NavigationContainer>
        <Tab.Navigator screenOptions={{ headerShown: false }}>
          <Tab.Screen name="Home" component={Stacks} options={({ route }) => {
          const focusedRouteName = getFocusedRouteNameFromRoute(route) ?? 'StartScreen';
            if (focusedRouteName === 'LoginScreen') {
              return {
                tabBarStyle: { display: 'none' }
              };
            }
            if (focusedRouteName === 'StartScreen') {
              return {
                tabBarStyle: { display: 'none' },
              };
            }
            if (focusedRouteName === 'RegisterScreen') {
              return {
                tabBarStyle: { display: 'none' },
              };
            }
            return {
              tabBarStyle: { display: 'flex' },
              tabBarIcon: ({focused}) => (
                <Image style= {styles.icon} source={focused ? require('./src/assets/home_active.png') : require('./src/assets/home_inactive.png')} /> )
            };
          }}
          />
          <Tab.Screen name="Income" component={IncomeStacks} options={{
            tabBarIcon: ({focused}) => (
              <Image style= {styles.icon} source={focused ? require('./src/assets/income_active.png') : require('./src/assets/income_inactive.png')} /> )
          }
          }/>
          <Tab.Screen name="Expenses" component={ExpenseStacks} options={{
            tabBarIcon: ({focused}) => (
              <Image style= {styles.icon} source={focused ? require('./src/assets/expenses_active.png') : require('./src/assets/expenses_inactive.png')} /> )
          }
          }/>
          <Tab.Screen name="Account" component={AccountStacks} options={{
            tabBarIcon: ({focused}) => (
              <Image style= {styles.icon} source={focused ? require('./src/assets/account_active.png') : require('./src/assets/account_inactive.png')} /> )
          }
          }/>
          <Tab.Screen name="Profile" component={ProfileStacks} options={{
            tabBarIcon: ({focused}) => (
              <Image style= {styles.icon} source={focused ? require('./src/assets/user_active.png') : require('./src/assets/user_inactive.png')} /> )
          }
          } />
        </Tab.Navigator>
      </NavigationContainer>
    </Provider>
  )
}
const styles = StyleSheet.create({
  icon: {
    width: 30,
    height: 30,
  },
})
