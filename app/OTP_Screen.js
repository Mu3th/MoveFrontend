import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Alert, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useLocalSearchParams } from 'expo-router';

export function OTP_Screen() {

    const router = useRouter();
    const { phone } = useLocalSearchParams();
    const inputs = [];
    const [otp, setOtp] = useState(['', '', '', '']);

    const handleOtpChange = (value, index) => {
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        // Move focus to the next box if the current one has a value
        if (value && index < newOtp.length - 1) {
            inputs[index + 1].focus();
        }
    };
    const verifyOTP = async () => {
        console.log(phone)
        //get OTP from POST method in server side and compare it with user input
        let serverOTP = "4523";
        if (otp.join('') == serverOTP) {
            Alert.alert("كود الحماية صحيح");
            // Save the data
            //   let DriverData = {
            //     "name": driverName,
            //     "phone": driverPhone,
            //     "passengers_count": passengersCount,
            //     "permit_number": permitNumber,
            //     "complexA": complexA.id,
            //     "complexB": complexB.id,
            //   };
            //   let jsonDriverData = JSON.stringify(DriverData);
            // //   setDriverData(jsonDriverData);
            // console.log("Error: " + jsonDriverData);
            await storeUserType("Driver");
            // try {
            //     await AsyncStorage.setItem('DriverData', jsonDriverData);
            // } catch (e) {
            //     console.log("Error: " + e);
            // }

            router.setParams({ userType: 'Driver' });
            router.dismissAll()
            router.replace('/driverTabs');
        } else {
            Alert.alert("كود الحماية غير صحيح");
        }
    };
    const storeUserType = async (value) => {
        try {
            await AsyncStorage.setItem('userType', value);
            console.log("User Type: " + value);
        } catch (e) {
            console.log("Error: " + e);
        }
    };
    return (
        <View style={{ flex: 1, alignItems: "center", marginVertical: 80 }}>
            <StatusBar backgroundColor="#000" barStyle="light-content" />
            <Text style={{ fontSize: 25, color: "#111" }}>تأكيد رقم الهاتف</Text>
            <Text style={{ fontSize: 15, color: "#111", marginVertical: 15 }}>أدخل الرمز المكون من 4 أرقام الذي تلقيته على هاتفك</Text>
            <Text style={{ fontSize: 16, color: "#111", marginVertical: 14 }}>{`${phone.slice(0, 4)}${'*'.repeat(phone.length - 6)}${phone.slice(-2)}`}</Text>
            <View style={styles.OTPContainer}>
                {otp.map((digit, index) => (
                    <TextInput
                        key={index}
                        style={styles.box}
                        maxLength={1}
                        keyboardType="numeric"
                        onChangeText={(value) => handleOtpChange(value, index)}
                        value={digit}
                        ref={(input) => {
                            inputs[index] = input;
                        }}
                    />
                ))}
            </View>
            <View style={{ width: "100%", paddingHorizontal: 22 }}>
                <TouchableOpacity
                    style={{
                        backgroundColor: "green",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 10,
                        paddingVertical: 10
                    }}
                    onPress={verifyOTP}
                >
                    <Text style={{ color: "white", fontSize: 24 }}>تأكيد</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    OTPContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    box: {
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 5,
        width: 40,
        height: 40,
        margin: 10,
        marginVertical: 30,
        textAlign: 'center',
        fontSize: 20,
    },
});

export default OTP_Screen;