import React from 'react'
import { Image, StyleSheet, KeyboardAvoidingView,TouchableOpacity, View } from 'react-native'
import { Text } from 'react-native-paper'

export default function NavigationDashboard({ navigation,page }) {
  return (
  <KeyboardAvoidingView style={styles.header}>
     <KeyboardAvoidingView style={styles.navbarItems}>
        <KeyboardAvoidingView style={styles.navbarItem}>
            <Image source={require('../assets/income_active.png')} style={styles.icon} />
            <TouchableOpacity onPress={() => navigation.replace('DashboardIncome')}>
                <Text style={[styles.iconText, (page == 'income') ? styles.redText : styles.usualText]}>Income</Text>
            </TouchableOpacity>
        </KeyboardAvoidingView>
     </KeyboardAvoidingView>
     <KeyboardAvoidingView style={styles.navbarItems}>
        <KeyboardAvoidingView style={styles.navbarItem}>
            <Image source={require('../assets/expenses_active.png')} style={styles.icon} />
            <TouchableOpacity onPress={() => navigation.replace('DashboardExpenses')}>
                <Text style={[styles.iconText, (page == 'expenses') ? styles.redText : styles.usualText]}>Expenses</Text>
            </TouchableOpacity>
        </KeyboardAvoidingView>
     </KeyboardAvoidingView>
     <KeyboardAvoidingView style={styles.navbarItems}>
        <KeyboardAvoidingView style={styles.navbarItem}>
            <Image source={require('../assets/account_active.png')} style={styles.icon} />
            <TouchableOpacity onPress={() => navigation.replace('DashboardAccount')}>
                <Text style={[styles.iconText, (page == 'account') ? styles.redText : styles.usualText]}>Account</Text>
            </TouchableOpacity>
            <Text style={styles.iconText}>Account</Text>
        </KeyboardAvoidingView>
     </KeyboardAvoidingView>
     <KeyboardAvoidingView style={styles.navbarItems}>
        <KeyboardAvoidingView style={styles.navbarItem}>
            <Image source={require('../assets/leaderboard.png')} style={styles.icon} />
           <TouchableOpacity onPress={() => navigation.replace('DashboardLeaderboard')}>
                <Text style={[styles.iconText, (page == 'leaderboard') ? styles.redText : styles.usualText]}>Leaderboard</Text>
           </TouchableOpacity>
        </KeyboardAvoidingView>
     </KeyboardAvoidingView>
  </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  header: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  iconText: {
    flex: 1,
    fontSize: 10,
    color: 'black'
  },
  navbarItems: {
    flex: 1,
    top: 30,
  },
  navbarItem: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    flexDirection: 'column',
  },
  icon: {
    width: 30,
    height: 30,
  },
  redText: {
    color: 'red',
  },
})
