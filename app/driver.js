import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Alert, TouchableOpacity, StatusBar } from 'react-native';
import * as Location from 'expo-location';
import { getPreciseDistance } from 'geolib';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DOMAIN from '../constants/domain';

const Driver = (props) => {
  const [locationServiceEnabled, setLocationServiceEnabled] = useState(false);
  const [currentPosition, setCurrentPosition] = useState({});
  const [driverData, setDriverData] = useState();

  useEffect(() => {
    CheckIfLocationEnabled();
    GetCurrentLocation();
    getDriverDataFromAsyncStorage();
  }, []);

  const GetCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert(
        'Permission not granted',
        'Allow the app to use location service.',
        [{ text: 'تم' }],
        { cancelable: false }
      );
    }

    let { coords } = await Location.getCurrentPositionAsync();

    if (coords) {
      const { latitude, longitude } = coords;
      setCurrentPosition({ latitude: latitude, longitude: longitude });
    }
  };

  const CheckIfLocationEnabled = async () => {
    let enabled = await Location.hasServicesEnabledAsync();

    if (!enabled) {
      Alert.alert(
        'خدمة الموقع غير ممكّنة',
        'يرجى تمكين خدمات الموقع الخاصة بك للمتابعة',
        [{ text: 'تم' }],
        { cancelable: false }
      );
    } else {
      setLocationServiceEnabled(enabled);
    }
  };
  const getDriverDataFromAsyncStorage = async () => {
    //Get driver data from local storage
    try {
      const jsonValue = await AsyncStorage.getItem('DriverData')
      if (jsonValue !== null) {
        setDriverData(JSON.parse(jsonValue));
      }
    } catch (error) {
      console.log("Error: " + error)
    }
  };
  const calculatePreciseDistance = (Position) => {
    return getPreciseDistance(Position, currentPosition);
  };
  const setOrder_onPress = async () => {
    let permit = driverData.permit;
    let driverComplexes;
    const response = await fetch(`${DOMAIN}/driver-complexes/${permit}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    driverComplexes = await response.json();
    let fromComplex, toComplex;
    await CheckIfLocationEnabled();
    if (locationServiceEnabled) {
      for (let i = 0; i < driverComplexes.length; i++) {
        let distance = calculatePreciseDistance({ latitude: parseFloat(driverComplexes[i].lat), longitude: parseFloat(driverComplexes[i].long) });
        if (distance < 50) {
          fromComplex = driverComplexes[i].name;
          toComplex = driverComplexes[(i + 1) % 2].name;
          let body = {
            "permit": permit,
            "status": "inQueue",
            "fromComplex": fromComplex,
            "toComplex": toComplex,
            "timestamp": Date.now()
          }
          await fetch(`${DOMAIN}/driver-status`, {
            method: "PUT",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
          })
          Alert.alert("قريب", `تم حجز الدور بنجاح في ${fromComplex}`,
            [{ text: 'تم' }],
            { cancelable: false });
          return;
        }
      }
      Alert.alert("بعيد", `انت تبعد أكثر من 50 متر عن مركز المجمع`,
        [{ text: 'تم' }],
        { cancelable: false })
    };
  };
  const go_onPress = () => {
    let body = {
      "permit": driverData.permit,
      "status": "onRoad",
      "timestamp": Date.now()
    }
    fetch(`${DOMAIN}/driver-status`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
    Alert.alert("انطلاق", "نتمنى لك رحلة آمنة",
      [{ text: 'تم' }],
      { cancelable: false });
  };
  const OOS_onPress = () => {
    let body = {
      "permit": driverData.permit,
      "status": "OOS",
      "timestamp": Date.now()
    }
    fetch(`${DOMAIN}/driver-status`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
    Alert.alert("خارج الخدمة", "نتمنى لك يوم سعيد",
      [{ text: 'تم' }],
      { cancelable: false });
  };
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#000" barStyle="light-content" />
      <TouchableOpacity style={styles.contentContainer} onPress={setOrder_onPress}>
        <Text style={styles.title}>احجز دورك</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.contentContainer} onPress={go_onPress}>
        <Text style={styles.title}>انطلاق</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.contentContainer} onPress={OOS_onPress}>
        <Text style={styles.title}>خارج الخدمة</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingTop: 30
  },
  contentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 30,
    height: 120,
    width: 250,
    borderColor: 'green',
    borderWidth: 10,
    borderRadius: 75,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#DA2C38',
  },
});

export default Driver;