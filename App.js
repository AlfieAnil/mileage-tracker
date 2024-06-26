import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '@rneui/themed';
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import harvesine from 'haversine-distance';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator, DrawerItem } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './components/MileageTracker';
import SignUp from './components/authentication/sign-up';
import { app, auth } from './firebaseConfig';
import SignIn from './components/authentication/sign-in';
import LogoutScreen from './components/authentication/log-out';
import { getAuth } from 'firebase/auth';
import MileageReview from './components/MileageReview';

function NotificationsScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button onPress={() => navigation.goBack()} title="Go back home" />
    </View>
  );
}





const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();


export default function App() {
  const [authenticated, setAuthenticated] = useState(null);
  const appAuth = getAuth(app);
  useEffect(() => {
    getAuth(app).onAuthStateChanged((user) => {
      console.log("current user = ", user);
      setAuthenticated(appAuth.currentUser !== null)
    })
  }, [])

  if (authenticated === false) {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName='Sign-up'>
          <Stack.Screen name='Sign-up' component={SignUp} options={{headerBackVisible: false, headerShown: false}} />
          <Stack.Screen name='Sign-in' component={SignIn} options={{headerBackVisible: false, headerShown: false}} />
        </Stack.Navigator>
      </NavigationContainer>
    )
  }

  if (authenticated === true) {
    return (
      <NavigationContainer>

        <Drawer.Navigator initialRouteName='Home'>
          <Drawer.Screen name='Home' component={HomeScreen} />
          <Drawer.Screen name='My Travels' component={MileageReview} />
          
          <Drawer.Screen name='Logout' component={LogoutScreen} options={{drawerLabelStyle: {color: "red"}}} />
        </Drawer.Navigator>

      </NavigationContainer>
    );
  }
}


