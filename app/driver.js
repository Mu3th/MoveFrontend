import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Alert, TouchableOpacity, StatusBar } from 'react-native';
import * as Location from 'expo-location';
import { getDistance, getPreciseDistance } from 'geolib';

// import domain from '../constants/domain';

const Driver = (props) => {
  const [locationServiceEnabled, setLocationServiceEnabled] = useState(false);
  const [displayCurrentAddress, setDisplayCurrentAddress] = useState(
    'Wait, we are fetching you location...'
  );
  const [currentPosition, setCurrentPosition] = useState({});

  // useEffect(() => {
  //   CheckIfLocationEnabled();
  //   GetCurrentLocation();
  // }, []);

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
      // console.log(latitude)
      // console.log(longitude)
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

  const calculatePreciseDistance = (Position) => {
    return getPreciseDistance(Position, currentPosition);
  };
  setOrder_onPress = async () => {
    // console.log("Set Order");
    let driverComplexes;
    const response = await fetch(`${domain.domain}/driver-complexes/${props.driverData.permit_number}`);
    const json = await response.json();
    driverComplexes = json.complexes;
    let permit = props.driverData.permit_number;
    let fromComplex, toComplex;
    await CheckIfLocationEnabled();
    if (locationServiceEnabled) {
      await GetCurrentLocation();
      // console.log("current location ", currentPosition);
      for (let i = 0; i < driverComplexes.length; i++) {
        let distance = calculatePreciseDistance({ latitude: parseFloat(driverComplexes[i].lat), longitude: parseFloat(driverComplexes[i].log) });
        if (distance < 50) {
          fromComplex = driverComplexes[i].name;
          toComplex = driverComplexes[(i+1)%2].name;
          let body = {
            "permit": permit,
            "status": "inQueue",
            "fromComplex": fromComplex,
            "toComplex": toComplex,
            "timestamp": Date.now()
          }
          await fetch(`${domain.domain}/driver-status`, {
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
      Alert.alert("بعيد", `انت تبعد حوالي  متر عن المجمع`,
        [{ text: 'تم' }],
        { cancelable: false })
    };
  };
  go_onPress = () => {
    let body = {
      "permit": props.driverData.permit_number,
      "status": "onRoad",
      "timestamp": Date.now()
    }
    fetch(`${domain.domain}/driver-status`, {
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
  OOS_onPress = () => {
    let body = {
      "permit": props.driverData.permit_number,
      "status": "OOS",
      "timestamp": Date.now()
    }
    fetch(`${domain.domain}/driver-status`, {
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
      <TouchableOpacity style={styles.contentContainer} onPress={this.setOrder_onPress}>
        <Text style={styles.title}>احجز دورك</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.contentContainer} onPress={this.go_onPress}>
        <Text style={styles.title}>انطلاق</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.contentContainer} onPress={this.OOS_onPress}>
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
    // paddingTop: 10,
  },
});

export default Driver;