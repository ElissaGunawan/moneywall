import React, {useEffect, useState} from 'react';
import NavbarHeader from '../components/NavbarHeader'
import Background from '../components/Background'
import NavigationDashboard from '../components/NavigationDashboard'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet, Text, View, KeyboardAvoidingView, Image, FlatList } from 'react-native'

export default function Dashboard({ navigation }) {
  const [data, setData] = useState([]);
  const [firstData, setFirstData] = useState([]);
  const [secondData, setSecondData] = useState([]);
  const [thirdData, setThirdData] = useState([]);
  const fetchLeaderboardSummary = () => {
    AsyncStorage.getItem('@moneywall:token', (err, token) => {
      console.log(token);
      fetch('http://ec2-54-255-181-27.ap-southeast-1.compute.amazonaws.com:3000/leaderboard?page=1&per_page=5', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': token,
        }
      })
      .then(response => response.json())
      .then(json => {
        console.log(json);
        var result = [];
        for(let i=0; i<json.users.length; i++) {
          if (i == 0) {
            setFirstData({
              id: i+1,
              name: json.users[i].Name,
              level: Math.floor(json.users[i].Exp / 50) + 1,
              avatar: json.users[i].AvatarURL,
            });
          } else if (i == 1) {
            setSecondData({
              id: i+1,
              name: json.users[i].Name,
              level: Math.floor(json.users[i].Exp / 50) + 1,
              avatar: json.users[i].AvatarURL,
            })
          } else if (i == 2) {
            setThirdData({
              id: i+1,
              name: json.users[i].Name,
              level: Math.floor(json.users[i].Exp / 50) + 1,
              avatar: json.users[i].AvatarURL,
            })
          } else {
            result.push({
              id: i+1,
              name: json.users[i].Name,
              level: Math.floor(json.users[i].Exp / 50) + 1,
              avatar: json.users[i].AvatarURL,
            })
          }
        }
        setData(result);
      })
      .catch(error => {
        console.error(error);
      });
    });
  }
  useEffect(() => {
    fetchLeaderboardSummary();
  }, []);
  return (
    <View style={styles.cover}>
    <NavbarHeader page={"Home"}/>
    <View style={styles.container}>
      <NavigationDashboard navigation={navigation}  page={'leaderboard'} style={styles.navbarHeader}/>
      <KeyboardAvoidingView style={styles.content}>
        <Image source={require('../assets/first.png')} style={styles.chartSize} />
        <Image source={{uri: firstData.avatar}} style={{ width: 50, height: 50}}/>
        <Text style={styles.textColor}>{firstData.name}</Text>
        <View style={styles.borderItem}>
            <Text style={styles.textColor}>Level </Text>
            <Text style={styles.textColor}>{firstData.level}</Text>
        </View>
        <View style={styles.contentSummary}>
            <View style={styles.content}>
                <Image source={require('../assets/second.png')} style={styles.chartSize} />
                <Image source={{uri: secondData.avatar}} style={{ width: 50, height: 50}}/>
                <Text style={styles.textColor}>{secondData.name}</Text>
                <View style={styles.borderItem}>
                    <Text style={styles.textColor}>Level </Text>
                    <Text style={styles.textColor}>{secondData.level}</Text>
                </View>
            </View>

            <View style={styles.content}>
                <Image source={require('../assets/third.png')} style={styles.chartSize} />
                <Image source={{uri: thirdData.avatar}} style={{ width: 50, height: 50}}/>
                <Text style={styles.textColor}>{thirdData.name}</Text>
                <View style={styles.borderItem}>
                    <Text style={styles.textColor}>Level </Text>
                    <Text style={styles.textColor}>{thirdData.level}</Text>
                </View>
            </View>
        </View>
        <View style={styles.contentSummary}>
            <View style={styles.border}>
                <Text style={styles.text}>Leaderboard</Text>
                <View style={styles.summaryView}>
                    <FlatList
                      data={data}
                      keyExtractor={({name}) => name}
                      renderItem={({item}) => (
                        <View style={styles.borderItemRanking}>
                            <Text style={styles.itemId}>
                                {item.id}
                            </Text>
                            <Text style={styles.itemName}>
                              {item.name}
                            </Text>
                            <Text style={styles.textColor}>Level </Text>
                            <Text style={styles.itemValue}>
                              {item.level}
                            </Text>
                        </View>
                      )}
                    />
                </View>
            </View>
        </View>
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
    height: 40,
    width: 40,
    resizeMode: 'contain',
  },
  imageSize: {
    flex: 1,
    resizeMode: 'contain',
  },
  logoSize: {
    width : 30,
    height : 30,
  },
  contentSummary : {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  contentText : {
      flex: 1,
      flexDirection: 'column',
    },
  border : {
    flex: 1,
    flexDirection: 'column',
    borderWidth: 2,
    margin: 15,
  },
  text: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    fontWeight: 'bold',
    color: 'black',
  },
  borderItem : {
    flex: 1,
    flexDirection: 'row',
  },
  borderItemRanking : {
    flex: 1,
    flexDirection: 'row',
    margin: 5,
  },
  itemName: {
    flex: 1.5,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    alignSelf: 'flex-start',
    color: 'black',
  },
  itemValue: {
    justifyContent: 'flex-end',
    color: 'black',
  },
  itemId : {
    flex: 1,
    fontWeight: 'bold',
    color: 'black',
  },
  summaryView: {
    flex: 8,
  },
  textColor: {
    color: 'black',
  }
})