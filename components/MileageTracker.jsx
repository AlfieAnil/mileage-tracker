import { View, Text, StyleSheet, Alert } from "react-native";
import { useState, useEffect } from "react";
import { StatusBar } from 'expo-status-bar';
import * as Location from 'expo-location';
import harvesine from 'haversine-distance';
import { Dialog, Modal, PaperProvider, Portal, TextInput, Button, Snackbar } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { addDoc, collection, doc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";

export default function HomeScreen() {
    const [travel, setTravel] = useState({
        'positions': [],
        'totalDistance': 0
      });
    
      const [monitor, setMonitor] = useState(false);
      const [watchId, setWatchId] = useState(null);

      const [modalVisible, setModalVisible] = useState(false);
      const [travelName, setTravelName] = useState('');

      const [snackbarText, setSnackbarText] = useState('');
      const [snackbarVisible, setSnackBarVisible] = useState(false);
    
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

      const findDestination = async() => {
        let geocode = await Location.reverseGeocodeAsync({
            longitude: travel.positions[travel.positions.length-1].longitude,
            latitude: travel.positions[travel.positions.length-1].latitude,
        });

        console.log(geocode[0].name + ', ' + geocode[0].city, ", ", geocode[0].region);
        return geocode[0];
      }

      const checkEndTrip = () => {
        Alert.alert('Are you sure?', 'Are you sure you want to end this trip?', [
            {
                'text': 'No, keep going',
                onPress: () => {console.log("Keep going"); setMonitor(true)}
            },
            {
                text: 'Yes, end trip',
                onPress: () => setModalVisible(true)
            }
        ])
      }

      const recordTripWithDestination = async() => {
        let tripName = await findDestination();
        let tripNameFull = tripName.name + ', ' + tripName.city + ', ' + tripName.region;
        recordTrip(tripNameFull);
      }
      
      const recordTrip = async(tripName) => {
        setModalVisible(false);
        console.log("Journey Name: ", tripName);
        try {
            const docRef = await addDoc(collection(doc(db, 'users', auth.currentUser.uid), 'trips'), {
                tripName: tripName,
                timestamp: new Date(),
                totalDistance: travel.totalDistance
            });

            resetTrip();
            showSnackBar("Trip recorded successfully!")
        } catch(e) {
            console.log("Exception: ", e)
            showSnackBar("There was an error when recording this trip.")
        }
      }

      const showSnackBar = (text) => {
        setSnackbarText(text);
        setSnackBarVisible(true);
      }

      const resetTrip = () => {
        setTravelName('');
        setTravel({
            'positions': [],
            'totalDistance': 0
          });
      }

      return (
        <PaperProvider>
            <Portal>
                <Modal visible={modalVisible} onDismiss={() => {setModalVisible(travelName === '')}} contentContainerStyle={{backgroundColor: "white", padding: 20, marginHorizontal: 15, alignItems: 'center'}} >
                    <Text style={[styles.promptHeading, {marginBottom: 8}]}>Give your journey a Name</Text>

                    <TextInput mode="outlined" style={styles.travelInput} value={travelName} onChangeText={(value) => setTravelName(value)} />
                    <Button onPress={() => recordTrip(travelName)} mode="contained" style={{width: "100%", marginTop: 4}}>Submit</Button>

                    <Button icon="map-marker"  onPress={recordTripWithDestination} style={{marginTop: 16}}>Use my current location instead</Button>
                </Modal>
            </Portal>

            <View style={styles.container}>
            {/* <Text style={styles.milesHeading}>Distance Travelled</Text> */}
            <View style={[{width: '100%', flexDirection: 'row', justifyContent: 'center', alignContent: 'flex-end', alignItems: 'center'}]}>
            <Text style={styles.milesHeading}>{(travel.totalDistance * 0.000621371).toFixed(1)}</Text>
            <Text style={[{marginLeft: 10}]}>miles</Text>
            </View>

            <View>
            <Button disabled={monitor} type="clear" titleStyle={styles.startButton} onPress={() => setMonitor(true)}>Start</Button>

            <Button disabled={!monitor} type='clear'titleStyle={styles.endButton} onPress={() => {setMonitor(false); checkEndTrip()}}>End</Button>

            {/* <Button type="clear" onPress={findDestination}>Find Destination</Button> */}
            </View>
            
            {/* <Text>{travel.totalDistance} metres</Text> */}
            <StatusBar style="auto" />

            <Snackbar visible={snackbarVisible} onDismiss={() => setSnackBarVisible(false)} action={{label: 'Okay', onPress: () => setSnackBarVisible(false)}}>{snackbarText}</Snackbar>
            </View>
        </PaperProvider>
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
    },

    promptHeading: {
        fontSize: 20,
        fontWeight: 'bold'
    },

    travelInput: {
        width: "100%"
    }
  });