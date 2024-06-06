import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '@rneui/themed';
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import harvesine from 'haversine-distance';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from './components/MileageTracker';

function NotificationsScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button onPress={() => navigation.goBack()} title="Go back home" />
    </View>
  );
}






const Drawer = createDrawerNavigator();
export default function App() {
  // const [travel, setTravel] = useState({
  //   'positions': [],
  //   'totalDistance': 0
  // });

  // const [monitor, setMonitor] = useState(false);
  // const [watchId, setWatchId] = useState(null);

  // useEffect(() => {

  //   const calcDistance = () => {
  //     if (travel.length > 1) {
  //       const point_a = {lat: travel[travel.length-1].latitude, lng: travel[travel.length-1].longitude};
  //       const point_b = {lat: travel[travel.length-2].latitude, lng: travel[travel.length-2].longitude};
  //       return harvesine(point_a, point_b);
  //     }
  //   }

  //   const calculateDistance = (p_travels, c_coords) => {
  //     if (p_travels.length == 0) {
  //       return 0;
  //     } else {
  //       const point_a = {lat: p_travels[p_travels.length-1].latitude, lng: p_travels[p_travels.length-1].longitude};
  //       const point_b = {lat: c_coords.latitude, lng: c_coords.longitude};
  //       // console.log("change = ", harvesine(point_a, point_b));
  //       return harvesine(point_a, point_b);
  //     }
  //   }
  //   const startTracking = async() => {
  //     let { status } = await Location.requestForegroundPermissionsAsync()
  //     console.log("Status: ", status);

  //     if (status !== 'granted') {
  //       alert("Location permission is required for this app");
  //       return;
  //     }

  //     // shows what to use for background
  //     // Subscribe to location updates from the device. Please note that updates will only occur while the application is in the foreground. To get location updates while in background you'll need to use Location.startLocationUpdatesAsync.
      
  //      Location.watchPositionAsync({
  //       accuracy: Location.Accuracy.High,
  //       timeInterval: 1000,
  //       distanceInterval: 1
  //     },
  //     (position) => {
  //       // console.log("Position: ", position.coords);
  //       setTravel((previousTravel) => {
  //         // const updatedTravel = [...previousTravel, position.coords];
  //         // console.log("Size: ", previousTravel.length);
  //         // return updatedTravel;
  //         console.log("Total Distance = ", previousTravel.totalDistance);
  //         const updatedTravel = {
  //           'positions': [...previousTravel.positions, position.coords],
  //           'totalDistance': previousTravel.totalDistance + calculateDistance(previousTravel.positions, position.coords)
  //         };
  //         return updatedTravel;
  //       })
  //     }).then((locWatch) => {
  //       setWatchId(locWatch);
  //     })
  //   }

  //   if (monitor) {
  //     startTracking();
  //   } else {
  //     console.log("Should stop");
  //     if (watchId) {
  //       console.log("exists");
  //       watchId.remove();
  //     }
  //   }
  // }, [monitor])

  return (
    <NavigationContainer>

      <Drawer.Navigator initialRouteName='Home'>
        <Drawer.Screen name='Home' component={HomeScreen} />
      </Drawer.Navigator>

    </NavigationContainer>
  );
}


