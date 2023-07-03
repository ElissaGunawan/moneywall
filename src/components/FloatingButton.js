import React from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { StyleSheet } from 'react-native'

export default props => (
  <TouchableOpacity onPress={props.onPress} style={props.style}>
    <View style={styles.view}>
      <Image source={require('../assets/plus_icon.png')} style={styles.image} />
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  image: {
    width: 20,
    height: 20,
    top : 15,
    left : 15,
  },
  view : {
    backgroundColor: 'grey',
    width: 50,
    height: 50,
    borderRadius: 50,
  }
})
