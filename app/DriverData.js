import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, FlatList, Alert, StatusBar } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';


export function DriverData() {

  const router = useRouter();
  // const params = useLocalSearchParams();

  const [driverName, setDriverName] = useState("");
  const [driverPhone, setDriverPhone] = useState("");
  const [passengersCount, setPassengersCount] = useState("");
  const [permitNumber, setPermitNumber] = useState("");
  //   const [complexes, setComplexes] = useState([]);
  const [complexes, setComplexes] = useState([{ id: 0, name: 'جنين 1' }, { id: 1, name: 'جنين 2' }, { id: 2, name: 'نابلس 1' }, { id: 3, name: 'نابلس 2' }]);
  const [complexA, setComplexA] = useState("");
  const [complexB, setComplexB] = useState("");
  const [complexesA, setComplexesA] = useState([]);
  const [complexesB, setComplexesB] = useState([]);


  const handleSubmit = async () => {
    // Validate the inputs
    if (driverName.split(" ").length < 3 || driverName.split(" ").some((word) => word.length < 3 && word.length > 0)) {
      Alert.alert("", "الاسم الثلاثي غير صحيح", [{ text: "تم", }]);
      return;
    }
    if (driverPhone.length !== 10) {
      Alert.alert("", "رقم الجوال غير صحيح", [{ text: "تم", }]);
      return;
    }
    if (passengersCount < 4 || passengersCount > 60
    ) {
      Alert.alert("", "عدد الركاب غير صحيح", [{ text: "تم", }]);
      return;
    }
    if (permitNumber.split("-")[0].length != 1 || permitNumber.split("-")[1].length != 4) {
      Alert.alert("", "الرجاء ادخال رقم خط صحيح (x-xxxx)", [{ text: "تم", }]);
      return;
    }
    if (complexA == "" || complexB == "") {
      Alert.alert("", "الرجاء ادخال مجرى الخط"), [{ text: "تم", }];
      return;
    }

    // Save the data
    let DriverData = {
      name: driverName,
      phone: driverPhone,
      passengers_count: passengersCount,
      permit_number: permitNumber,
      complexA: complexA.id,
      complexB: complexB.id,
    };
    let jsonDriverData = JSON.stringify(DriverData);

    // router.navigate('/OTP_Screen');
    router.push({pathname: '/OTP_Screen', params: {userType: 'Driver', driverData: jsonDriverData, phone: driverPhone}});
    // router.setParams({ userType: 'Driver' });
    // router.setParams({ driverData: jsonDriverData });
  };

  return (
    <View style={[styles.container]}>
      <StatusBar backgroundColor="#000" barStyle="light-content" />
      <TextInput
        style={styles.input}
        placeholder="اسم السائق الثلاثي"
        value={driverName}
        onChangeText={setDriverName}
      />
      <TextInput
        style={styles.input}
        placeholder="رقم السائق"
        value={driverPhone}
        onChangeText={setDriverPhone}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="عدد الركاب"
        value={passengersCount}
        onChangeText={setPassengersCount}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="رقم الخط"
        value={permitNumber}
        onChangeText={setPermitNumber}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        onPressIn={() => { setComplexA("") }}
        placeholder="المجمع الأول"
        value={complexA.name}
        onChangeText={(text) => { text == "" ? setComplexesA([]) : setComplexesA(complexes.filter(item => item.name.includes(text))) }}
      />
      <View style={[{ width: "70%", maxHeight: 120, position: 'absolute', top: 490, left: 60, zIndex: 1, borderColor: 'gray', borderRadius: 5, }, complexesA.length == 0 ? { borderWidth: 0 } : { borderWidth: 2, borderBottomWidth: 0 }]}>
        <FlatList
          data={complexesA}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity style={{ height: 40 }} onPress={() => { setComplexA(item); setComplexesA([]) }}>
                <Text style={styles.cardText}>{item.name}</Text>
              </TouchableOpacity>
            )
          }}
        />
      </View>
      <TextInput
        style={styles.input}
        onPressIn={() => { setComplexB("") }}
        placeholder="المجمع الثاني"
        value={complexB.name}
        onChangeText={(text) => { text == "" ? setComplexesB([]) : setComplexesB(complexes.filter(item => item.name.includes(text))) }}
      />
      <View style={[{ width: "70%", maxHeight: 120, position: 'absolute', top: 560, left: 60, zIndex: 1, borderColor: 'gray', borderRadius: 5 }, complexesB.length == 0 ? { borderWidth: 0 } : { borderWidth: 2, borderBottomWidth: 0 }]}>
        <FlatList
          data={complexesB}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity style={{ height: 40 }} onPress={() => { setComplexB(item); setComplexesB([]) }}>
                <Text style={styles.cardText}>{item.name}</Text>
              </TouchableOpacity>
            )
          }}
        />
      </View>
      <TouchableOpacity style={[styles.button, styles.input]} onPress={handleSubmit}>
        <Text style={styles.text}>حفظ</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 150
  },
  input: {
    width: "70%",
    height: 50,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    margin: 10,
    textAlign: 'right',
  },
  button: {
    backgroundColor: "green",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "#fff",
    fontSize: 24,
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
});

export default DriverData;