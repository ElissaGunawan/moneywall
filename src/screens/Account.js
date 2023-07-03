import React, {useEffect, useState} from 'react';
import NavbarHeader from '../components/NavbarHeader'
import { useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet, Text, View, KeyboardAvoidingView, Image, FlatList, SafeAreaView, StatusBar, Pressable, Modal, TextInput, TouchableOpacity } from 'react-native'

export default function Account({ navigation }) {
  const [data, setData] = useState([]);
  const [noData, setNoData] = useState(false);
  const [accountName, setAccountName] = useState({ value: '', error: '' })
  const [accountAmount, setAccountAmount] = useState({ value: '', error: '' })
  const isFocused = useIsFocused();
  const fetchAccountSummary = () => {
    AsyncStorage.getItem('@moneywall:token', (err, token) => {
      console.log(token);
      fetch('http://ec2-54-255-181-27.ap-southeast-1.compute.amazonaws.com:3000/accounts?page=1&per_page=10', {
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
        if (json.accounts.length == 0) {
          setNoData(true);
        } else {
          setNoData(false);
        }
        for(let i=0; i<json.accounts.length; i++) {
          result.push({
            id: json.accounts[i].ID,
            name: json.accounts[i].AccountName,
            value: json.accounts[i].Amount,
          })
        }
        setData(result);
      })
      .catch(error => {
        console.error(error);
      });
    });
  }
  const accountDelete = (id) => {
    AsyncStorage.getItem('@moneywall:token', (err, token) => {
      console.log(token);
      fetch('http://ec2-54-255-181-27.ap-southeast-1.compute.amazonaws.com:3000/accounts/'+id, {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': token,
        }
      })
      .then(response => response.json())
      .then(json => {
        fetchAccountSummary();
      })
      .catch(error => {
        console.error(error);
      });
    });
  }
  useEffect(() => {
    fetchAccountSummary();
  }, [isFocused]);

  const [modalVisible, setModalVisible] = useState(false);
  const onYesPressed =() => {
    AsyncStorage.getItem('@moneywall:token', (err, token) => {
      console.log(accountName.value);
      console.log(accountAmount.value);
      fetch('http://ec2-54-255-181-27.ap-southeast-1.compute.amazonaws.com:3000/accounts', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': token,
        },
        body: JSON.stringify({
          accountName: accountName.value,
          amount: Number(accountAmount.value),
        }),
      })
      .then(response => response.json())
      .then(json => {
        console.log(json);
        setModalVisible(!modalVisible);
        fetchAccountSummary();
      })
      .catch(error => {
        console.error(error);
      });
    });
  }
  const formatMoney = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  const [searchName, setSearchName] = useState({ value: '', error: '' })
  const [account, setAccount] = useState({ value: '', error: '' })
  const [category, setCategory] = useState({ value: '', error: '' })
  const [notes, setNotes] = useState({ value: '', error: '' })
  return (
    <View style={styles.cover}>
    <NavbarHeader page={"Account"}/>
    <View style={styles.container}>
      <KeyboardAvoidingView style={styles.content}>
          <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}>
                    <View style={styles.centeredView}>
                      <View style={styles.modalView}>
                        <Text style={styles.modalText}>New Account</Text>
                        <View style={styles.inputBox}>
                            <Text style={styles.textColor}>Account</Text>
                            <TextInput
                              style={styles.input}
                              label="Name"
                              returnKeyType="next"
                              value={accountName.value}
                              placeholder="Account"
                              placeholderTextColor="black"
                              onChangeText={(text) => setAccountName({ value: text, error: '' })}
                           />
                        </View>
                        <View style={styles.inputBox}>
                            <Text style={styles.textColor}>Amount</Text>
                            <TextInput
                              style={styles.input}
                              label="Amount"
                              returnKeyType="next"
                              value={accountAmount.value}
                              placeholder="Amount"
                              placeholderTextColor="black"
                              onChangeText={(text) => setAccountAmount({ value: text, error: '' })}
                           />
                        </View>
                        <View style={styles.inputBox}>
                            <Pressable
                                style={[styles.button, styles.buttonYes]}
                                onPress={() => onYesPressed()}>
                                <Text style={styles.textStyle}>Yes</Text>
                              </Pressable>
                            <Pressable
                              style={[styles.button, styles.buttonCancel]}
                              onPress={() => setModalVisible(!modalVisible)}>
                              <Text style={styles.textStyle}>Cancel</Text>
                            </Pressable>
                        </View>
                      </View>
                    </View>
            </Modal>
            <Pressable
                style={[styles.button, styles.buttonOpen]}
                onPress={() => setModalVisible(true)}>
                <Text style={styles.text}>Add new account</Text>
            </Pressable>
          <View style={styles.contentSummary}>
              <View style={styles.summaryView}>
                  {noData && <Text style={styles.noDataText}>No Data Yet</Text>}
                  <FlatList
                    data={data}
                    keyExtractor={({id}) => id}
                    renderItem={({item}) => (
                    <View style={styles.borderItems}>
                      <View style={styles.icon}>
                        <TouchableOpacity onPress={() => accountDelete(item.id)} >
                          <Image style={styles.imageIcon} source={require('../assets/trash.png')} />
                        </TouchableOpacity>
                      </View>
                      <View style={styles.icon}>
                        <TouchableOpacity onPress={() => navigation.navigate('EditAccount', item)} >
                          <Image style={styles.imageIcon} source={require('../assets/edit.png')} />
                        </TouchableOpacity>
                      </View>
                      <View style={styles.borderItem}>
                          <Text style={styles.itemName}>
                            {item.name}
                          </Text>
                          <Text style={styles.itemValue}>
                            Rp {formatMoney(item.value)}
                          </Text>
                      </View>
                    </View>
                    )}
                  />
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
    containers: {
        flex: 8,
        marginTop: StatusBar.currentHeight || 0,
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
  header: {
      flex : 1,
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      alignSelf: 'flex-start',
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
    iconText: {
        flex: 1,
        fontSize: 15,
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
        color: 'black'
      },
      itemDate: {
          flex: 1,
          color: '#8d99ae',
          margin : 10,
        },
      itemValue: {
        justifyContent: 'flex-end',
        margin: 10,
        color: 'black'
      },
    contentSummary : {
        flex: 6,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
      },
      summaryView: {
          flex: 8,
      },
    floatinBtn: {
        bottom: 10,
        left: 140,
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
      },
      modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
      },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        margin : 10,
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        alignSelf: 'flex-end',
    },
    buttonOpen: {
      backgroundColor: 'white',
    },
    buttonCancel: {
        backgroundColor: 'red',
    },
    buttonYes: {
        backgroundColor: 'green',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
      },
    text: {
      color: 'black',
      fontWeight: 'bold',
      textAlign: 'center',
    },
      modalText: {
        marginBottom: 15,
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 20,
        color: 'black',
      },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 12,
      },
    inputBox: {
        flexDirection: 'row',
        justifyContent: 'center',
          alignItems: 'center',
          alignSelf: 'center',
    },
    icon : {
      flex: 1,
      flexDirection: 'row',
      alignSelf: 'flex-end',
      alignItems: 'flex-end',
      marginBottom: 10, 
    },
    imageIcon: {
      width: 30,
      height: 30,
    },
    noDataText: {
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
      marginTop: 25,
      color : 'black'
    },
    textColor: {
      color: 'black'
    }
})