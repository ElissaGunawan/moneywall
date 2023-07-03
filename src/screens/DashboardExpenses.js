import React, {useEffect, useState} from 'react';
import moment from "moment";
import NavbarHeader from '../components/NavbarHeader'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import NavigationDashboard from '../components/NavigationDashboard'
import { PieChart } from "react-native-gifted-charts";
import { StyleSheet, Text, View, KeyboardAvoidingView, Image, FlatList } from 'react-native'

export default function Dashboard({ navigation }) {
  let currentdate = new Date();
  const [data, setData] = useState([]);
  const [noData, setNoData] = useState(false);
  const [dataGraph, setDataGraph] = useState([]);
  const startDate = new Date(currentdate.setMonth(currentdate.getMonth()-1));
  const endDate = new Date();
  const isFocused = useIsFocused();
  const generateColor = () => {
    const randomColor = Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, '0');
    return `#${randomColor}`;
  };
  const fetchExpensesSummary = () => {
    AsyncStorage.getItem('@moneywall:token', (err, token) => {
      console.log(token);
      fetch('http://ec2-54-255-181-27.ap-southeast-1.compute.amazonaws.com:3000/expensedashboard?start_date='+ formatDate(startDate) +'&end_date='+ formatDate(endDate), {
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
        var resultGraph = [];
        var totalAmount = 0;
        if (json.expenses.length == 0) {
          setNoData(true);
        } else {
          setNoData(false);
        }
        for(let i=0; i<json.expenses.length; i++) {
          totalAmount += json.expenses[i].Amount;
        }
        for(let i=0; i<json.expenses.length; i++) {
          var color = generateColor();
          resultGraph.push({
            value: Math.round(json.expenses[i].Amount*100/totalAmount),
            color: color,
          })
          result.push({
            name: json.expenses[i].CategoryName,
            value: json.expenses[i].Amount,
            color: color,
          })
        }
        setDataGraph(resultGraph);
        setData(result);
      })
      .catch(error => {
        console.error(error);
      });
    });
  }
  useEffect(() => {
    fetchExpensesSummary();
  }, [isFocused]);
  const formatDate = (dateVal) => {
    return moment(dateVal).format('DD/MM/YYYY');
  }
  const formatMoney = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  return (
    <View style={styles.cover}>
    <NavbarHeader page={"Home"}/>
    <View style={styles.container}>
      <NavigationDashboard navigation={navigation}  page={'expenses'} style={styles.navbarHeader}/>
      <KeyboardAvoidingView style={styles.content}>
          {noData && <Text style={styles.noDataText}>No Data Yet</Text>}
          <PieChart
            data={dataGraph}
            showText
            textColor="black"
            radius={100}
            textSize={10}
            focusOnPress
            showValuesAsLabels
            showTextBackground
            textBackgroundRadius={15}
          />
        <View style={styles.contentSummary}>
            <View style={styles.border}>
                <Text style={styles.text}>Expenses</Text>
                <View style={styles.summaryView}>
                    {noData && <Text style={styles.noDataText}>No Data Yet</Text>}
                    <FlatList
                      data={data}
                      keyExtractor={({name}) => name}
                      renderItem={({item}) => (
                        <View style={styles.borderItem}>
                            <Text style={[styles.itemName, {color: item.color}]}>
                              {item.name}
                            </Text>
                            <Text style={styles.itemValue}>
                              Rp.  {formatMoney(item.value)}
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
    fontWeight: 'bold',
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
    fontWeight: 'bold',
  },
  itemValue: {
    justifyContent: 'flex-end',
    margin: 10,
    fontWeight: 'bold',
    color: 'black'
  },
  summaryView: {
    flex: 8,
  },
  noDataText: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 25,
    color : 'black'
  }
})