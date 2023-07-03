import React from 'react'
import { Image, StyleSheet, KeyboardAvoidingView,TouchableOpacity } from 'react-native'
import { Text } from 'react-native-paper'

export default function NavbarHeader({ page }) {
  return (
  <KeyboardAvoidingView style={styles.container}>
    <Text style={styles.homepage}>{page}</Text>
  </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor : '#37474F',
  },
  homepage: {
    margin: 10,
    color : 'white',
  },
  profile: {
    margin: 10,
  },
  profileImage: {
    width: 30,
    height: 30,
  },
})
