// import UserType from './userType';
// import Passenger from './passenger';
// import DriverTabs from './driverTabs'
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import React, { useState, useEffect } from 'react';

// export default function Index() {

//   const [loading, setLoading] = useState(true);
//   const [userType, setUserType] = useState();

//   useEffect(() => {
//     checkData();
//   }, []);

//   const checkData = async () => {
//     //Get user type from local storage
//     try {
//       const value = await AsyncStorage.getItem('userType');
//       if (value !== null) {
//         setUserType(value);
//       }
//     } catch (error) {
//       console.log("Error: " + error)
//     }
//     setLoading(false);
//   };

//   if(!loading){
//     if(userType == null){
//       return (
//         <UserType />
//       );
//     }else if(userType == "Passenger"){
//       return(
//         <Passenger />
//       );
//     } else if(userType == "Driver"){
//       return(
//         <DriverTabs />
//       );
//     }
//   }
// }

import { View, Image, StyleSheet } from "react-native";

export default function WelcomeScreen() {
  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/rakeb.png")}
        style={styles.image}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
});