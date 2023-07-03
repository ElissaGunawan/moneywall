import React, {useEffect, useState} from 'react';
import NavbarHeader from '../components/NavbarHeader'
import Background from '../components/Background'
import NavigationQuest from '../components/NavigationQuest'
import AsyncStorage from '@react-native-async-storage/async-storage';
import BackButton from '../components/BackButton'
import { StyleSheet, Text, View, KeyboardAvoidingView, Image, FlatList, Pressable } from 'react-native'

export default function Quest({ navigation }) {
  const [noData, setNoData] = useState(false);
  const [data, setData] = useState([]);
  const fetchQuestSummary = () => {
    AsyncStorage.getItem('@moneywall:token', (err, token) => {
      console.log(token);
      fetch('http://ec2-54-255-181-27.ap-southeast-1.compute.amazonaws.com:3000/quests?page=1&per_page=25', {
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
        for(let i=0; i<json.quests.length; i++) {
          if(json.quests[i].CompletedAt == null){
            result.push({
              name: json.quests[i].QuestName,
              task : json.quests[i].Reward,
              value : "Not completed",
            })
          }
        }
        if (result.length == 0){
          setNoData(true);
        } else {
          setNoData(false);
        }
        setData(result);
      })
      .catch(error => {
        console.error(error);
      });
    });
  }
  useEffect(() => {
    fetchQuestSummary();
  }, []);
  return (
    <View style={styles.cover}>
      <NavbarHeader page={"Quest"}/>
    <View style={styles.container}>
      <NavigationQuest navigation={navigation} page={'questInProgress'} style={styles.navbarHeader}/>
      <KeyboardAvoidingView style={styles.content}>
      {noData && <Text style={styles.noDataText}>Completed all quests</Text>}
        <View style={styles.contentSummary}>
          <View style={styles.summaryView}>
              <FlatList
                data={data}
                keyExtractor={({name}) => name}
                renderItem={({item}) => (
                <View style={styles.borderItems}>
                  <View style={styles.item}>
                      <Text style={styles.itemDate}>
                        {item.name}
                      </Text>
                      <View style={styles.borderItem}>
                          <Text style={styles.itemName}>
                            {item.task}
                          </Text>
                          <Text style={styles.itemValue}>
                            {item.value}
                          </Text>
                      </View>
                  </View>
                </View>
                )}
              />
              <Pressable
                  style={[styles.button]}
                  onPress={() => navigation.navigate('Profile')}>
                  <Text style={styles.text}>Back</Text>
              </Pressable>
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
      flex: 1,
      width: 200,
      height: 200,
  },
  contentSummary : {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  border : {
    flex: 1,
    flexDirection: 'column',
    borderWidth: 2,
    margin: 15,
  },
  text: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    color: 'black',
  },
  borderItem : {
    flex: 1,
    flexDirection: 'row',
  },
  itemName: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    alignSelf: 'flex-start',
    margin: 10,
  },
  itemValue: {
    justifyContent: 'flex-end',
    margin: 10,
  },
  summaryView: {
    flex: 8,
  },
  item: {
      flex: 1,
      flexDirection: 'column',
    },
    borderItem : {
      flex: 1,
      flexDirection: 'row',
    },
    borderItems : {
        flex: 1,
        backgroundColor: 'white',
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
    },
    itemName: {
      flex: 1,
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      alignSelf: 'flex-start',
      margin: 10,
    },
   itemDate: {
     flex: 1,
     color: 'black',
     margin : 10,
   },
   itemValue: {
       justifyContent: 'flex-end',
       margin: 10,
       color : '#8d99ae',
     },
     noDataText: {
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
      marginTop: 25,
      color : 'black'
    },
    button: {
      borderRadius: 20,
      padding: 10,
      margin : 10,
      width: 75,
      height: 35,
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      alignSelf: 'flex-start',
      backgroundColor: 'white',
  },
})