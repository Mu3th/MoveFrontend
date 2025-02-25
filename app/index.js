import { useRouter } from 'expo-router';
import UserType from './userType';
// import Driver from './driver';
// import OTP_Screen from './OTP_Screen';
import Passenger from './passenger';
import DriverTabs from './driverTabs'
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react';


export default function Index() {

  
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState();
  // const [driverData, setDriverData] = useState();
  const router = useRouter();

  useEffect(() => {
    // getRegions();
    checkData();
  }, []);

  const checkData = async () => {
    //Get regions from database
    // try {
    //   const response = await fetch(`${domain.domain}/complexes`);
    //   if (!response.ok) {
    //     throw new Error(`HTTP error! status: ${response.status}`);
    //   }
    //   const data = await response.json();
    //   setComplexes(data.complexes)
    //   let regionsNames = [];
    //   data.complexes.forEach(item => {
    //     regionsNames.push(item.name.split('-')[0]);
    //   });
    //   setRegions([...new Set(regionsNames)]);
    // } catch (error) {
    //   console.log('There was a problem with the fetch operation: ', error);
    // }
    //Get user type and driver data from local storage
    try {
      const value = await AsyncStorage.getItem('userType');
      if (value !== null) {
        setUserType(value);
      }
      const jsonValue = await AsyncStorage.getItem('DriverData')
      if (jsonValue !== null) {
        setDriverData(JSON.parse(jsonValue));
      }
    } catch (error) {
      console.log("Error: " + error)
    }
    setLoading(false);
  };
  if(!loading){
    if(userType == null){
      return (
        <UserType />
      );
    }else if(userType == "Passenger"){
      return(
        <Passenger />
      );
    } else if(userType == "Driver"){
      return(
        <DriverTabs />
      );
    }
  }
}
