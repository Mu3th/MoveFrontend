import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, Linking, StatusBar } from 'react-native';
import React, { useState, useEffect } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SelectList } from 'react-native-dropdown-select-list';
// import { useRouter, useLocalSearchParams } from 'expo-router';

// import domain from '../constants/domain';
import colors from '../constants/Colors';

function carsCards(car) {
  call_onPress = () => {
    Linking.openURL(`tel:${car.phone}`);
    let date = new Date();
    let current_date = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    let current_time = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    let body = {
      "passengerName": "",
      "passengerPhone": "",
      "driverPhone": car.phone,
      "time": `${current_date} ${current_time}`
    }
    fetch(`${domain.domain}/user-action`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
  };
  return (
    <View style={{
      width: "100%",
      height: 100,
      borderBottomWidth: 2,
      borderBottomColor: "gray",
      flexDirection: "row-reverse",
      padding: "3%"
    }}>
      <View style={{
        width: "85%",
      }}>
        <Text style={{
          height: "50%",
          fontSize: 20,
          fontWeight: 'bold',
          textAlign: "right",
          textAlignVertical: 'center',
        }}>{car.driverName}</Text>
        <View style={{
          flexDirection: "row-reverse",
          height: "50%",
        }}>
          <Text style={{
            width: "35%",
            fontSize: 14,
            fontWeight: 'bold',
            textAlign: "right",
            textAlignVertical: 'center',
          }}>{`عدد الركاب: ${car.passengers}`}</Text>
          {car.status == "onRoad" ?
            <Text style={[{ backgroundColor: "#DA2C38" }, styles.driverData]}>ع الطريق</Text> : car.status == "inQueue" ?
              <Text style={[{ backgroundColor: "#87C38F" }, styles.driverData]}>في المجمع</Text> : null
          }
        </View>
      </View>
      <TouchableOpacity onPress={this.call_onPress} style={{
        width: "15%",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <Icon name="phone" size={35} color="green" />
      </TouchableOpacity>
    </View>
  );
}
export default function App(props) {
  search_onPress = async () => {
    // console.log(regions);
    if (from_text && to_text) {
      try {
        const response = await fetch(`${domain.domain}/cars/?from=${from_text}&to=${to_text}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setCars(data.drivers);
      } catch (error) {
        console.log('There was a problem with the fetch operation: ', error);
      }
    }
  };
  // deleteData = async () => {
  //   try {
  //     await AsyncStorage.removeItem('@MyApp_key')
  //   } catch(e) {
  //     // remove error
  //   }
  // }

  const [from_text, setFromText] = useState('');
  const [to_text, setToText] = useState('');
  const [fromRegions, setFromRegions] = useState([]);
  const [toRegions, setToRegions] = useState([]);
  // const [cars, setCars] = useState(require('./carsList.json').cars);
  const [cars, setCars] = useState([]);
  const [regions, setRegions] = useState(props.regions);
  // const router = useRouter();
  // const param = useLocalSearchParams();

  return (
    <View style={styles.container}>
      {/* <SelectList
        // boxStyles={{width: "60%"}}
        // inputStyles={{width: "60%"}}
        // dropdownStyles={{width: "60%"}}

        // setSelected={(val) => setSelected(val)} 
        data={regions}
        save="name"
      /> */}
      
      <StatusBar backgroundColor="#000" barStyle="light-content" />
      <View style={styles.containerA}>
        <View style={{ width: "80%", height: "100%", backgroundColor: "#fff", flex: 4 }}>
          <TextInput
            placeholder='منطقة الانطلاق'
            onPressIn = {()=>{setFromText("")}}
            style={styles.textInput}
            onChangeText={text => {
              setFromText(text);
              // console.log(text ? regions.filter(item => item.includes(text)) : []);
              setFromRegions(text ? regions.filter(item => item.includes(text)) : []);
            }}
            value={from_text}
          />
        </View>
      </View>
      <View style={[{ width: "90%", position: 'absolute', top: 65, left: 20, zIndex: 1, borderColor: 'gray', borderRadius: 5}, fromRegions.length == 0 ?  {borderWidth: 0} : {borderWidth: 2, borderBottomWidth: 0}]}>
        <FlatList
          data={fromRegions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity style={{ height: 40 }} onPress={() => { setFromText(item); setFromRegions([]);}}>
                <Text style={styles.cardText}>{item}</Text>
              </TouchableOpacity>
            )
          }}
        />
      </View>

      <View style={styles.containerA}>
        <View style={{ width: "80%", height: "100%", backgroundColor: "#fff", flex: 4 }}>
          <TextInput
            placeholder='منطقة الوصول'
            onPressIn = {()=>{setToText("")}}
            style={styles.textInput}
            onChangeText={text => {
              setToText(text);
              // console.log(regions.filter(item => item.includes(text))); 
              setToRegions(text ? regions.filter(item => item.includes(text)) : []);
            }}
            value={to_text}
          />
        </View>
      </View>
      <View style={[{ width: "90%", position: 'absolute', top: 135, left: 20, zIndex: 1, borderColor: 'gray', borderRadius: 5}, toRegions.length == 0 ?  {borderWidth: 0} : {borderWidth: 2, borderBottomWidth: 0}]}>
        <FlatList
          data={toRegions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity style={{ height: 40 }} onPress={() => { setToText(item); setToRegions([]) }}>
                <Text style={styles.cardText}>{item}</Text>
              </TouchableOpacity>
            )
          }}
        />
      </View>
      <View style={{ width: 350, height: 40, backgroundColor: colors.primary, borderRadius: 5, margin: 10, alignItems: 'center', }}>
        <TouchableOpacity onPress={this.search_onPress}>
          <Text style={{ fontSize: 24, color: '#fff' }}>بحث</Text>
        </TouchableOpacity>
      </View>
      <View style={{ width: 350, height: 40, backgroundColor: colors.primary, borderRadius: 5, margin: 10, alignItems: 'center', }}>
        <TouchableOpacity onPress={
          async () => {
            try {
              await AsyncStorage.removeItem('userType')
              await AsyncStorage.removeItem('DriverData')
            } catch (e) {
              // remove error
            }
          }
        }>
          <Text style={{ fontSize: 24, color: '#fff' }}>احذف</Text>
        </TouchableOpacity>
      </View>
      {cars.length == 0 && <Text style={{
        height: "50%",
        width: 200,
        fontSize: 30,
        fontWeight: 'bold',
        // textAlign: "right",
        textAlignVertical: 'center',
      }}>لا توجد سيارات في الخدمة حاليا</Text>}
      {cars.length > 0 &&
        <FlatList
          style={{ width: "90%", borderTopColor: 'gray', borderTopWidth: 2 }}
          data={cars}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            return (
              carsCards(item)
            )
          }}
        />}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    marginTop: 30
    // paddingHorizontal: 20,
    // paddingVertical: 50,
  },
  textInput: {
    width: "100%",
    height: "100%",
    borderColor: 'gray',
    borderWidth: 2,
    borderRadius: 5,
    paddingRight: 10,
    textAlign: 'right',
  },
  containerA: {
    width: "90%",
    height: 40,
    backgroundColor: "#fff",
    margin: 10,
    marginTop: 20,
    flexDirection: "row"
  },
  cardText: {
    width: "100%",
    height: 40,
    textAlignVertical: 'center',
    paddingRight: 10,
    fontSize: 15,
    borderColor: 'gray',
    borderBottomWidth: 2,
    backgroundColor: "#fff",
  },
  driverData: {
    width: "30%",
    borderRadius: 15,
    marginVertical: "2%",
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: "center",
    textAlignVertical: 'center',
  },
});
