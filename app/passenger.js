import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, Linking, StatusBar, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SelectList } from 'react-native-dropdown-select-list';
import DOMAIN from '../constants/domain';
import colors from '../constants/Colors';

function carsCards(car) {
  const call_onPress = () => {
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
    fetch(`${DOMAIN}/user-action`, {
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
      <TouchableOpacity onPress={call_onPress} style={{
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


  useEffect(() => {
    getRegions();
  }, []);

  const getRegions = async () => {
    //Get regions from database
    try {
      const response = await fetch(`${DOMAIN}/complexes`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setComplexes(data);
      const seen = new Set();
      let regionsNames = [];
      for (const item of data) {
        // Get name before the dash or full name if no dash
        const baseName = item.name.split(' - ')[0].trim();
        if (!seen.has(baseName)) {
          seen.add(baseName);
          regionsNames.push({ id: item.id, name: baseName });
        }
      }
      setRegions(regionsNames);
    } catch (error) {
      console.log('There was a problem with the fetch operation: ', error);
    }
  };
  const search_onPress = async () => {
    if (from_text && to_text) {
      try {
        const response = await fetch(`${DOMAIN}/cars/?from=${from_text}&to=${to_text}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setCars(data.drivers);
      } catch (error) {
        console.log('There was a problem with the fetch operation: ', error);
      }
    } else {
      alert("الرجاء ادخال منطقة الانطلاق ومنطقة الوصول", [{ text: "تم", }]);
    }
  };
  const delete_user_data = async () => {
    try {
      await AsyncStorage.removeItem('userType')
      await AsyncStorage.removeItem('DriverData')
    } catch (e) {
      // remove error
    }
  };

  const [from_text, setFromText] = useState('');
  const [to_text, setToText] = useState('');
  const [fromRegions, setFromRegions] = useState([]);
  const [toRegions, setToRegions] = useState([]);
  const [cars, setCars] = useState([]);
  const [regions, setRegions] = useState([]);
  const [complexes, setComplexes] = useState([]);
  return (
    <View style={styles.container}>

      <StatusBar backgroundColor="#000" barStyle="light-content" />
      {/* <SelectList
        boxStyles={{width: "100%"}}
        inputStyles={{width: "60%"}}
        placeholder="اختر نوع السيارة"
        searchPlaceholder="ابحث عن نوع السيارة"
        // dropdownStyles={{width: "60%"}}

        // setSelected={(val) => setSelected(val)} 
        data={data}
        save="value"
      /> */}
      <View style={styles.containerA}>
        <View style={{ width: "80%", height: "100%", backgroundColor: "#fff", flex: 4 }}>
          <TextInput
            placeholder='منطقة الانطلاق'
            onPressIn={() => { setFromText("") }}
            style={styles.textInput}
            onChangeText={text => {
              setFromText(text);
              setFromRegions(text ? regions.filter(item => item.name.includes(text)) : []);
            }}
            value={from_text}
          />
        </View>
      </View>
      <View style={[{ width: "90%", maxWidth: 450, position: 'absolute', top: 65, zIndex: 1, borderColor: 'gray', borderRadius: 5 }, fromRegions.length == 0 ? { borderWidth: 0 } : { borderWidth: 2, borderBottomWidth: 0 }]}>
        <FlatList
          data={fromRegions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity style={{ height: 40 }} onPress={() => { setFromText(item.name); setFromRegions([]); }}>
                <Text style={styles.cardText}>{item.name}</Text>
              </TouchableOpacity>
            )
          }}
        />
      </View>

      <View style={styles.containerA}>
        <View style={{ width: "80%", height: "100%", backgroundColor: "#fff", flex: 4 }}>
          <TextInput
            placeholder='منطقة الوصول'
            onPressIn={() => { setToText("") }}
            style={styles.textInput}
            onChangeText={text => {
              setToText(text);
              setToRegions(text ? regions.filter(item => item.name.includes(text)) : []);
            }}
            value={to_text}
          />
        </View>
      </View>
      <View style={[{ width: "90%", maxWidth: 450, position: 'absolute', top: 135, zIndex: 1, borderColor: 'gray', borderRadius: 5 }, toRegions.length == 0 ? { borderWidth: 0 } : { borderWidth: 2, borderBottomWidth: 0 }]}>
        <FlatList
          data={toRegions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity style={{ height: 40 }} onPress={() => { setToText(item.name); setToRegions([]) }}>
                <Text style={styles.cardText}>{item.name}</Text>
              </TouchableOpacity>
            )
          }}
        />
      </View>
      <TouchableOpacity onPress={search_onPress} onLongPress={delete_user_data}>
        <View style={{ width: 324, height: 40, backgroundColor: colors.primary, borderRadius: 5, margin: 10, alignItems: 'center', }}>
          <Text style={{ fontSize: 24, color: '#fff' }}>بحث</Text>
        </View>
      </TouchableOpacity>
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
          style={{ width: "90%", maxWidth: 450, borderTopColor: 'gray', borderTopWidth: 2 }}
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
    maxWidth: 450,
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
