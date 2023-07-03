import React, {useEffect, useState} from 'react';
import NavbarHeader from '../components/NavbarHeader'
import Background from '../components/Background'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet, Text, View, KeyboardAvoidingView, Image, TouchableOpacity } from 'react-native'
import Button from '../components/Button';
import { useIsFocused } from '@react-navigation/native';

export default function Profile({ navigation }) {
  const [data, setData] = useState([]);
  const isFocused = useIsFocused();
  const fetchProfileSummary = () => {
    AsyncStorage.getItem('@moneywall:token', (err, token) => {
      console.log(token);
      fetch('http://ec2-54-255-181-27.ap-southeast-1.compute.amazonaws.com:3000/profile', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': token,
        }
      })
      .then(response => response.json())
      .then(json => {
        var result = {};
        console.log(json);
        result = {
          id : json.user.ID,
          name: json.user.Name,
          email: json.user.Email,
          avatar: json.user.AvatarURL,
          level: Math.floor(json.user.Exp / 50) + 1,
          exp: json.user.Exp % 50,
        };
        console.log(result);
        setData(result);
      })
      .catch(error => {
        console.error(error);
      });
    });
  }
  useEffect(() => {
    fetchProfileSummary();
  }, [isFocused]);
  return (
    <View style={styles.cover}>
    <NavbarHeader page={"Profile"}/>
    <View style={styles.container}>
      <KeyboardAvoidingView style={styles.header}>
        <KeyboardAvoidingView style={styles.navbarItems}>
            <KeyboardAvoidingView style={styles.navbarItem}>
                <TouchableOpacity onPress={() => navigation.navigate('Quest')}>
                    <Text style={[styles.iconText]}>Quest</Text>
                </TouchableOpacity>
            </KeyboardAvoidingView>
        </KeyboardAvoidingView>
        <KeyboardAvoidingView style={styles.navbarItems}>
            <KeyboardAvoidingView style={styles.navbarItem}>
                <TouchableOpacity onPress={() => navigation.navigate('Achievement')}>
                    <Text style={[styles.iconText]}>Achievement</Text>
                </TouchableOpacity>
            </KeyboardAvoidingView>
        </KeyboardAvoidingView>
      </KeyboardAvoidingView>
      <KeyboardAvoidingView style={styles.content}>
        <TouchableOpacity onPress={() => navigation.navigate('EditProfile',data)}>
            <Text style={[styles.iconTextEditProfile]}>Edit Profile</Text>
        </TouchableOpacity>
        <Image source={{uri: data.avatar, cache: "reload"}} style={{ width: 100, height: 100, marginTop: 10, marginBottom: 10, }} />
            <Text style={styles.textColor}>{data.name}</Text>
            <Text style={styles.textColor}>{data.email}</Text>
            <View style={styles.contentSummary}>
                <View style={styles.border}>
                    <View style={styles.summaryView}>
                        <Text style={styles.textColor}>Level : {data.level} </Text>
                        <Text style={styles.textColor}>Current Exp : {data.exp}</Text>
                    </View>
                </View>
            </View>
        <Button style={styles.button}
          mode="contained"
          onPress={() => navigation.navigate('StartScreen')}
          >
          Log out
        </Button> 
      </KeyboardAvoidingView>
    </View>
    </View>
  )
}


const styles = StyleSheet.create({
    container: {
        flex: 11,
        flexDirection: 'column',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor : '#E0E0E0',
    },
    cover: {
      flex: 1,
    },
  navbarHeader: {
    flex: 1,
  },
  content: {
    flex: 8,
    justifyContent: 'flex-start',
    alignSelf: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  chartSize: {
    flex: 1,
    resizeMode: 'contain',
    margin : 10,
  },
  logoSize: {
      width : 30,
      height : 30,
    },
  contentSummary : {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  contentText : {
      flex: 1,
      flexDirection: 'column',
    },
  border : {
    borderWidth: 2,
    margin: 45,
  },
  borderItem : {
    flexDirection: 'row',
    margin : 10,
  },
  text: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  summaryView: {
    flex: 5,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    margin : 10,
  },
  button : {
    backgroundColor: '#A86464',
  },
  navbarItems: {
    flex: 1,
  },
  navbarItem: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    flexDirection: 'column',
  },
  header: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  iconTextEditProfile: {
    color : 'red',
    fontWeight: 'bold',
  },
  iconText: {
    color : 'black',
    fontWeight: 'bold',
  },
  textColor : {
    color : 'black'
  }
})