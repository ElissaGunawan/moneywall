import React, {useEffect, useState} from 'react';
import moment from "moment";
import NavbarHeader from '../components/NavbarHeader'
import Button from '../components/Button'
import DatePicker from 'react-native-date-picker'
import { useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SelectList } from 'react-native-dropdown-select-list';
import { StyleSheet, Text, View, KeyboardAvoidingView, Image, FlatList, SafeAreaView, StatusBar, Pressable, Modal, TextInput, TouchableOpacity } from 'react-native'

export default function EditIncome({ route, navigation }) {
    const [incomeName, setIncomeName] = useState({ value: '', error: '' })
    const [dataDropDownList, setDataDropDownList] = useState([]);
    const [defaultAccount, setDefaultAccount] = useState([]);
    const [selected, setSelected] = useState([]);
    const [incomeDate, setIncomeDate] = useState(new Date());
    const [incomeOpen, setIncomeOpen] = useState(false);
    const [amount, setAmount] = useState([]);
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
            for(let i=0; i<json.accounts.length; i++) {
              result.push({
                key: json.accounts[i].ID,
                value: json.accounts[i].AccountName,
              })
            }
            setDataDropDownList(result);
          })
          .catch(error => {
            console.error(error);
          });
        });
      }
    const updateIncome =() => {
        console.log(route.params.id);
      AsyncStorage.getItem('@moneywall:token', (err, token) => {
        fetch('http://ec2-54-255-181-27.ap-southeast-1.compute.amazonaws.com:3000/incomes/'+route.params.id, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Authorization': token,
          },
          body: JSON.stringify({
            IncomeName: incomeName,
            Date: formatDate(incomeDate),
            AccountID: selected,
            Amount: Number(amount),
          }),
        })
        .then(response => response.json())
        .then(json => {
            navigation.navigate('Income')
        })
        .catch(error => {
          console.error(error);
        });
      });
    }
    
    const formatDate = (dateVal) => {
      return moment(dateVal).format('DD/MM/YYYY');
    }
    useEffect(() => {
      setIncomeName(route.params.name);
      setIncomeDate(moment(route.params.date, 'DD/MM/YYYY', true).toDate());
      setDefaultAccount({
          key: route.params.accountid,
          value: route.params.account,
      });
      setAmount(route.params.value.toString());
      fetchAccountSummary();
    }, []);
  return (
    <View style={styles.cover}>
    <NavbarHeader page={"Edit Income"}/>
    <View style={styles.container}>
      <KeyboardAvoidingView style={styles.content}>
          <View style={styles.contentSummary}>
              <View style={styles.summaryView}>
                <View style={styles.borderItems}>
                    <View style={styles.borderItem}>
                        <Text style={styles.itemName}>
                            Date : 
                            </Text>
                            <Pressable
                                style={[styles.button, styles.buttonOpen]}
                                onPress={() => setIncomeOpen(true)}>
                                <Text style={styles.text}>{formatDate(incomeDate)}</Text>
                            </Pressable>
                            <DatePicker
                            modal
                            mode="date"
                            open={incomeOpen}
                            date={incomeDate}
                            onConfirm={(incomeDate) => {
                                setIncomeOpen(false);
                                setIncomeDate(incomeDate);
                            }}
                            onCancel={() => {
                                setIncomeOpen(false)
                            }}
                            />
                    </View>
                    <View style={styles.borderItem}>
                        <Text style={styles.itemName}>
                        Name : 
                        </Text>
                        <TextInput
                            style={styles.input}
                            label="IncomeName"
                            returnKeyType="next"
                            placeholder="Income Name"
                            placeholderTextColor="black"
                            value={incomeName}
                            onChangeText={(text) => setIncomeName(text)}
                        />
                    </View>
                    <View style={styles.borderItem}>
                        <Text style={styles.itemName}>
                            Account Name : 
                        </Text>
                        <SelectList 
                            setSelected={(val) => setSelected(val)} 
                            data={dataDropDownList} 
                            defaultOption={defaultAccount}
                            save="key"
                            dropdownTextStyles={{color: "black"}}
                            inputStyles={{color: "black"}}
                        />
                    </View>
                    <View style={styles.borderItem}>
                        <Text style={styles.itemName}>
                            Amount : 
                        </Text>
                        <TextInput
                            style={styles.input}
                            label="Amount"
                            returnKeyType="next"
                            placeholder="Amount"
                            placeholderTextColor="black"
                            value={amount}
                            onChangeText={(text) => setAmount(text)}
                        />
                    </View>
                    </View>
                    <Pressable
                        style={[styles.buttonYes]}
                        onPress={() => updateIncome()}>
                        <Text style={styles.textStyle}>Update</Text>
                    </Pressable>
                    <Pressable
                        style={[styles.buttonCancel]}
                        onPress={() => navigation.replace('Income')}>
                        <Text style={styles.textStyle}>Cancel</Text>
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
        backgroundColor : 'white',
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
        flexDirection: 'row',
      },
      borderItems : {
          flex: 1,
          backgroundColor: 'white',
          padding: 20,
      },
      itemName: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        alignSelf: 'flex-start',
        margin: 20,
        fontWeight: 'bold',
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
        width: 100,
        height: 70,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        bottom: 50,
        padding: 20,
        borderRadius: 20,
    },
    buttonYes: {
        backgroundColor: 'green',
        width: 100,
        height: 70,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        bottom: 60,
        padding: 20,
        borderRadius: 20,
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
      },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 12,
        flex: 2,
        textAlign: 'center',
        color: 'black'
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
})