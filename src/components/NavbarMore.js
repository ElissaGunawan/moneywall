import React from 'react'
import { Image, StyleSheet, KeyboardAvoidingView,TouchableOpacity, View } from 'react-native'
import { Text } from 'react-native-paper'

export default function NavbarMore({ navigation, page }) {
  return (
  <KeyboardAvoidingView style={styles.header}>
     <KeyboardAvoidingView style={styles.navbarItems}>
        <KeyboardAvoidingView style={styles.navbarItem}>
            <TouchableOpacity onPress={() => navigation.replace('Quest')}>
                <Text style={[styles.iconText, (page == 'questInProgress') ? styles.redText : styles.usualText]}>Quest</Text>
            </TouchableOpacity>
        </KeyboardAvoidingView>
     </KeyboardAvoidingView>
     <KeyboardAvoidingView style={styles.navbarItems}>
        <KeyboardAvoidingView style={styles.navbarItem}>
            <TouchableOpacity onPress={() => navigation.replace('Achievement')}>
                <Text style={[styles.iconText, (page == 'achievementInProgress') ? styles.redText : styles.usualText]}>Achievement</Text>
            </TouchableOpacity>
        </KeyboardAvoidingView>
     </KeyboardAvoidingView>
     <KeyboardAvoidingView style={styles.navbarItems}>
        <KeyboardAvoidingView style={styles.navbarItem}>
            <TouchableOpacity onPress={() => navigation.replace('Leaderboard')}>
                <Text style={[styles.iconText , (page == 'leaderboard') ? styles.redText : styles.usualText]}>Leaderboard</Text>
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
    fontSize: 15,
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
