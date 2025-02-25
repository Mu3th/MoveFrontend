import * as React from 'react';
import { Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';
// import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import Passenger from './passenger';
import Driver from './driver'

function HomeScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Home!</Text>
    </View>
  );
}
const Tab = createBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator 
    initialRouteName="Driver"
    screenOptions={{
        tabBarActiveTintColor: "green",
        headerShown: false,
      }}>
      <Tab.Screen 
      name="Driver" 
      component={Driver}
      options={{
        title: 'سائق',
        tabBarIcon: ({ color, focused }) => (
          // <TabBarIcon name={focused ? 'car' : 'car-outline'} color={color} />
          <Ionicons name={focused ? 'car' : 'car-outline'} size={24} color={color} />
        ),
      }}
       />
      <Tab.Screen 
      name="Passenger" 
      component={Passenger}
      options={{
        title: 'راكب',
        tabBarIcon: ({ color, focused }) => (
          // <TabBarIcon name={focused ? 'search' : 'search-outline'} color={color} />
          <Ionicons name={focused ? 'man' : 'man-outline'} size={24} color={color} />
        ),
      }}
       />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
      <MyTabs />
  );
}
