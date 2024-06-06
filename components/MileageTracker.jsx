import { View, Text, StyleSheet } from "react-native";
import { useState, useEffect } from "react";
import { Button } from "@rneui/base";
import { StatusBar } from 'expo-status-bar';
import * as Location from 'expo-location';
import harvesine from 'haversine-distance';

export default function HomeScreen() {
    const [travel, setTravel] = useState({
        'positions': [],
        'totalDistance': 0
      });
    
      const [monitor, setMonitor] = useState(false);
      const [watchId, setWatchId] = useState(null);
    
      useEffect(() => {
    
        const calcDistance = () => {
          if (travel.length > 1) {
            const point_a = {lat: travel[travel.length-1].latitude, lng: travel[travel.length-1].longitude};
            const point_b = {lat: travel[travel.length-2].latitude, lng: travel[travel.length-2].longitude};
            return harvesine(point_a, point_b);
          }
        }
    
        const calculateDistance = (p_travels, c_coords) => {
          if (p_travels.length == 0) {
            return 0;
          } else {
            const point_a = {lat: p_travels[p_travels.length-1].latitude, lng: p_travels[p_travels.length-1].longitude};
            const point_b = {lat: c_coords.latitude, lng: c_coords.longitude};
            // console.log("change = ", harvesine(point_a, point_b));
            return harvesine(point_a, point_b);
          }
        }
        const startTracking = async() => {
          let { status } = await Location.requestForegroundPermissionsAsync()
          console.log("Status: ", status);
    
          if (status !== 'granted') {
            alert("Location permission is required for this app");
            return;
          }
    
          // shows what to use for background
          // Subscribe to location updates from the device. Please note that updates will only occur while the application is in the foreground. To get location updates while in background you'll need to use Location.startLocationUpdatesAsync.
          
           Location.watchPositionAsync({
            accuracy: Location.Accuracy.High,
            timeInterval: 1000,
            distanceInterval: 1
          },
          (position) => {
            // console.log("Position: ", position.coords);
            setTravel((previousTravel) => {
              // const updatedTravel = [...previousTravel, position.coords];
              // console.log("Size: ", previousTravel.length);
              // return updatedTravel;
              console.log("Total Distance = ", previousTravel.totalDistance);
              const updatedTravel = {
                'positions': [...previousTravel.positions, position.coords],
                'totalDistance': previousTravel.totalDistance + calculateDistance(previousTravel.positions, position.coords)
              };
              return updatedTravel;
            })
          }).then((locWatch) => {
            setWatchId(locWatch);
          })
        }
        console.log(monitor);
        if (monitor) {
          startTracking();
        } else {
          console.log("Should stop");
          if (watchId) {
            console.log("exists");
            watchId.remove();
          }
        }
      }, [monitor])

      return (
    <View style={styles.container}>
        {/* <Text style={styles.milesHeading}>Distance Travelled</Text> */}
        <View style={[{width: '100%', flexDirection: 'row', justifyContent: 'center', alignContent: 'flex-end', alignItems: 'center'}]}>
          <Text style={styles.milesHeading}>{(travel.totalDistance * 0.000621371).toFixed(1)}</Text>
          <Text style={[{marginLeft: 10}]}>miles</Text>
        </View>

        <View>
          <Button disabled={monitor} type="clear" titleStyle={styles.startButton} onPress={() => setMonitor(true)}>Start</Button>

          <Button disabled={!monitor} type='clear'titleStyle={styles.endButton} onPress={() => setMonitor(false)}>End</Button>
        </View>
        
        {/* <Text>{travel.totalDistance} metres</Text> */}
        <StatusBar style="auto" />
      </View>
      );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
  
    milesHeading: {
      fontSize: 45,
      fontWeight: 'bold',
      textAlign: 'center'
    },
  
    startButton: {
      fontSize: 25,
      marginTop: 35
    },
  
    endButton: {
      fontSize: 20,
      color: "red"
    }
  });