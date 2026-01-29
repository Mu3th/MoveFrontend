import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';
import Passenger from './passenger';
import Driver from './driver'

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
