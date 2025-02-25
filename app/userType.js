import { StyleSheet, Text, View, TouchableOpacity, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function UserType() {

    const router = useRouter();

    passenger = async () => {
        // console.log(`Passenger`);
        await storeUserType("Passenger");
        router.replace('/passenger');
        router.setParams({ userType: 'Passenger' });
    };
    driver = async () => {
        // console.log(`Driver`);
        // await storeUserType("Driver");
        router.navigate('/DriverData');
        router.setParams({ userType: 'Driver' });
    };
    const storeUserType = async (value) => {
        try {
            await AsyncStorage.setItem('userType', value);
        } catch (e) {
            console.log("Error: " + e);
        }
    };
    return (
        <View style={styles.container}>
            <StatusBar backgroundColor="#000" barStyle="light-content" />
            <TouchableOpacity onPress={this.passenger}>
                <View style={styles.contentContainer}>
                    <Ionicons name={'man'} size={60} color={'red'} />
                    <Text style={styles.title}>راكب</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.driver}>
                <View style={styles.contentContainer}>
                    <Ionicons name={'car'} size={60} color={'red'} />
                    <Text style={styles.title}>سائق</Text>
                </View>
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
        margin: 20,
        height: 150,
        width: 150,
        borderColor: 'green',
        borderWidth: 10,
        borderRadius: 75,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#FD0139',
        paddingTop: 10,
    },
});

export default UserType;