import React, {useEffect, useState} from 'react';
import moment from "moment";
import { useIsFocused } from '@react-navigation/native';
import NavbarHeader from '../components/NavbarHeader'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SelectList } from 'react-native-dropdown-select-list'
import { StyleSheet, Text, View, KeyboardAvoidingView, Image, FlatList, SafeAreaView, StatusBar, Pressable, Modal, TextInput, TouchableOpacity } from 'react-native'
import Button from '../components/Button';
import DatePicker from 'react-native-date-picker'

export default function Dashboard({ navigation }) {
  let currentdate = new Date();
  const [data, setData] = useState([]);
  const [noData, setNoData] = useState(false);
  const [dataDropDownList, setDataDropDownList] = useState([]);
  const [startDate, setStartDate] = useState(new Date(currentdate.setMonth(currentdate.getMonth()-1)));
  const [endDate, setEndDate] = useState(new Date());
  const [startOpen, setStartOpen] = useState(false)
  const [endOpen, setEndOpen] = useState(false)
  const isFocused = useIsFocused();
  const [incomeDate, setIncomeDate] = useState(new Date());
  const [incomeOpen, setIncomeOpen] = useState(false);
  
  const fetchIncomeSummary = (startDateInput,endDateInput) => {
    AsyncStorage.getItem('@moneywall:token', (err, token) => {
      console.log(token);
      if (startDateInput != null) {
        startDateParam = startDateInput 
      } else {
        startDateParam = startDate
      }
      if (endDateInput != null) {
        endDateParam = endDateInput 
      } else {
        endDateParam = endDate
      }
      fetch('http://ec2-54-255-181-27.ap-southeast-1.compute.amazonaws.com:3000/incomes?page=1&per_page=10&start_date='+ formatDate(startDateParam) +'&end_date='+ formatDate(endDateParam), {
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
        if (json.incomes.length == 0) {
          setNoData(true);
        } else {
          setNoData(false);
        }
        for(let i=0; i<json.incomes.length; i++) {
          result.push({
            id: json.incomes[i].ID,
            date: json.incomes[i].Date,
            account : json.incomes[i].AccountName,
            accountid: json.incomes[i].AccountID,
            name: json.incomes[i].IncomeName,
            value: json.incomes[i].Amount,
          })
        }
        setData(result);
      })
      .catch(error => {
        console.error(error);
      });
    });
  }
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
  const incomeDelete = (id) => {
    AsyncStorage.getItem('@moneywall:token', (err, token) => {
      console.log(token);
      fetch('http://ec2-54-255-181-27.ap-southeast-1.compute.amazonaws.com:3000/incomes/'+id, {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': token,
        }
      })
      .then(response => response.json())
      .then(json => {
        fetchIncomeSummary();
      })
      .catch(error => {
        console.error(error);
      });
    });
  }
  const formatDate = (dateVal) => {
    return moment(dateVal).format('DD/MM/YYYY');
  }
  const formatMoney = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  useEffect(() => {
    fetchIncomeSummary();
    fetchAccountSummary();
  }, [isFocused]);
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState({ value: '', error: '' })
  const [amount, setAmount] = useState({ value: '', error: '' })
  const [selected, setSelected] = React.useState("");

  const onYesPressed =() => {
    AsyncStorage.getItem('@moneywall:token', (err, token) => {
      console.log('selected',selected);
      fetch('http://ec2-54-255-181-27.ap-southeast-1.compute.amazonaws.com:3000/incomes', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': token,
        },
        body: JSON.stringify({
          Date: formatDate(incomeDate),
          IncomeName: name.value,
          AccountID: Number(selected),
          Amount: Number(amount.value)
        }),
      })
      .then(response => response.json())
      .then(json => {
        console.log(json);
        fetchIncomeSummary();
        setModalVisible(!modalVisible);
      })
      .catch(error => {
        console.error(error);
      });
    });
  }
  return (
    <View style={styles.cover}>
    <NavbarHeader page={"Income"}/>
    <View style={styles.container}>
      <KeyboardAvoidingView style={styles.content}>
          <Modal
                  animationType="slide"
                  transparent={true}
                  visible={modalVisible}
                  onRequestClose={() => {
                    Alert.alert('Modal has been closed.');
                    setModalVisible(!modalVisible);
                  }}>
                  <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                      <Text style={styles.modalText}>New Income</Text>
                      <View style={styles.inputBox}>
                          <Text style={styles.textColor}>Date</Text>
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
                      <View style={styles.inputBox}>
                        <Text style={styles.textColor}>Account  </Text>
                        <SelectList 
                            setSelected={(val) => setSelected(val)} 
                            data={dataDropDownList} 
                            save="key"
                            dropdownTextStyles={{color: "black"}}
                            inputStyles={{color: "black"}}
                        />
                      </View>
                      <View style={styles.inputBox}>
                        <Text style={styles.textColor}>Name</Text>
                        <TextInput
                          style={styles.input}
                          label="Date"
                          returnKeyType="next"
                          value={name.value}
                          placeholder="Name"
                          placeholderTextColor="black"
                          onChangeText={(text) => setName({ value: text, error: '' })}
                       />
                      </View>
                      <View style={styles.inputBox}>
                          <Text style={styles.textColor}>Amount</Text>
                          <TextInput
                                style={styles.input}
                                label="Date"
                                returnKeyType="next"
                                value={amount.value}
                                placeholder="Amount"
                                placeholderTextColor="black"
                                onChangeText={(text) => setAmount({ value: text, error: '' })}
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
                  <Text style={styles.text}>Add new income</Text>
          </Pressable>
          <KeyboardAvoidingView style={styles.header}>
            <KeyboardAvoidingView style={styles.navbarItems}>
                <KeyboardAvoidingView style={styles.navbarItem}>
                  <Pressable
                    style={[styles.button, styles.buttonOpen]}
                    onPress={() => setStartOpen(true)}>
                    <Text style={styles.text}>{formatDate(startDate)}</Text>
                  </Pressable>
                  <DatePicker
                      modal
                      mode="date"
                      open={startOpen}
                      date={startDate}
                      onConfirm={(startDate) => {
                        setStartOpen(false);
                        setStartDate(startDate);
                        fetchIncomeSummary(startDate,null);
                      }}
                      onCancel={() => {
                        setStartOpen(false)
                      }}
                    />
              </KeyboardAvoidingView>
             </KeyboardAvoidingView>
             <KeyboardAvoidingView style={styles.navbarItems}>
                <KeyboardAvoidingView style={styles.navbarItem}>
                  <Pressable
                    style={[styles.button, styles.buttonOpen]}
                    onPress={() => setEndOpen(true)}>
                    <Text style={styles.text}>{formatDate(endDate)}</Text>
                  </Pressable>
                  <DatePicker
                      modal
                      mode="date"
                      open={endOpen}
                      date={endDate}
                      onConfirm={(endDate) => {
                        setEndOpen(false);
                        setEndDate(endDate);
                        fetchIncomeSummary(null,endDate);
                      }}
                      onCancel={() => {
                        setEndOpen(false)
                      }}
                    />
             </KeyboardAvoidingView>
             </KeyboardAvoidingView>
          </KeyboardAvoidingView>
          <View style={styles.contentSummary}>
              <View style={styles.summaryView}>
                  {noData && <Text style={styles.noDataText}>No Data Yet</Text>}
                  <FlatList
                    data={data}
                    keyExtractor={({id}) => id}
                    renderItem={({item}) => (
                    <View style={styles.borderItems}>
                        <View style={styles.icon}>
                          <TouchableOpacity onPress={() => incomeDelete(item.id)} >
                            <Image style={styles.imageIcon} source={require('../assets/trash.png')} />
                          </TouchableOpacity>
                        </View>
                        <View style={styles.icon}>
                          <TouchableOpacity onPress={() => navigation.navigate('EditIncome',item)} >
                            <Image style={styles.imageIcon} source={require('../assets/edit.png')} />
                          </TouchableOpacity>
                        </View>
                      <View style={styles.item}>
                          <Text style={styles.itemDate}>
                              {item.date}
                          </Text>
                          <Text style={styles.itemDate}>
                            {item.account}
                          </Text>
                          <View style={styles.borderItem}>
                              <Text style={styles.itemName}>
                                {item.name}
                              </Text>
                              <Text style={styles.itemValue}>
                                Rp {formatMoney(item.value)}
                              </Text>
                          </View>
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
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
    navbarItems: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
      flexDirection: 'column',
    },
    navbarItem: {
      flex: 1,
    },
    imageIcon: {
      width: 30,
      height: 30,
    },
    iconText: {
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
      itemImage : {
        flex: 1,
        flexDirection: 'row',
        alignSelf: 'flex-end',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
      },
      icon : {
        flex: 1,
        flexDirection: 'row',
        alignSelf: 'flex-end',
        alignItems: 'flex-end',
        marginBottom: 10, 
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
    buttonDelete : {
      backgroundColor: '#A86464',
      width: 50,
      height: 50,
    },
    buttonEdit : {
      backgroundColor: 'green',
    },
    datepicker: {
      flex: 1,
      top: 5,
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