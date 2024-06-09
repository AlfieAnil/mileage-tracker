import React, { useEffect, useState } from "react";
import { DataTable, Provider, Modal, Button, Portal, Text, List, Icon } from "react-native-paper";
import { View, StyleSheet, ScrollView } from "react-native";
import { db, auth } from "../firebaseConfig";
import { executeNativeBackPress } from "react-native-screens";
import { getDocs, collection } from "firebase/firestore";

export default function MileageReview() {
    const [tripsData, setTripsData] = useState([]);

    const [page, setPage] = useState(0);
    const [numberOfItemsPerPageList] = useState(Array.from({ length: 41 }, (_, index) => index + 10));
    const [itemsPerPage, setItemsPerPage] = useState(numberOfItemsPerPageList[0]);
    const from = page * itemsPerPage;
    const to = Math.min((page + 1) * itemsPerPage, tripsData.length);

    const [sortDateDesc, setSortDateDesc] = useState(false);
    const [sortMilesDesc, setSortMilesDesc] = useState(null);

    const [modalVisible, setModalVisible] = useState(false);
    const [selectedTrip, setSelectedTrip] = useState(null);

    useEffect(() => {
        const getTravelData = async() => {
            console.log(`Getting trips: ${auth.currentUser.uid}`);
            try {
                const travelData = await getDocs(collection(db, 'users', auth.currentUser.uid, 'trips'));
                console.log("Travel data: ", travelData);
                const tripsArray = travelData.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                setTripsData(tripsArray.sort((a, b) => b.timestamp - a.timestamp));
            } catch(error) {
                console.log("Error: ", error);
            }
        }

        if (auth.currentUser !== null) {
            getTravelData();
        }
    }, [])

    function getFormattedDate(date){
        return `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`;
    }

    function getFormattedTime(date) {
        return `${('0' + date.getHours()).slice(-2)}:${('0' + date.getMinutes()).slice(-2)}`;
    }

    function handleSort(title){
        if (title === 'date') {
            setSortMilesDesc(null);
            if (sortDateDesc) {
                setTripsData(tripsData.sort((a, b) => b.timestamp - a.timestamp));
            } else {
                setTripsData(tripsData.sort((a, b) => a.timestamp - b.timestamp));
            }
            setSortDateDesc(!sortDateDesc);
        }

        if (title === 'miles') {
            setSortDateDesc(null);
            if (sortMilesDesc) {
                setTripsData(tripsData.sort((a, b) => b.totalDistance - a.totalDistance));
            } else {
                setTripsData(tripsData.sort((a, b) => a.totalDistance - b.totalDistance));
            }
            setSortMilesDesc(!sortMilesDesc);
        }
    }

    const showTableRow = (rowValue) => {
        console.log(rowValue);
        setSelectedTrip(rowValue);
    }

    const handleRowLongPress = (rowValue) => [
        Alert.alert(
            'Are you sure'
        )
    ]

    return (
        <Provider>
            <Portal>
                <Modal visible={selectedTrip ? true : false} animationType="slide" contentContainerStyle={{backgroundColor: "white", padding: 20, marginHorizontal: 15, alignItems: 'center'}} onDismiss={() => setSelectedTrip(null)}>
                    {selectedTrip && (
                        <View>
                            <Text variant="titleMedium" style={{fontWeight: 'bold', textAlign: 'center'}} >{selectedTrip.tripName}</Text>
                        </View>
                    )}
                    <View style={{ flexDirection: 'row' }}>

                        <View style={{ marginRight: 4 }}>
                            <List.Section>
                                <List.Subheader>Date</List.Subheader>
                                <List.Subheader>Time</List.Subheader>
                                <List.Subheader>Miles Travelled</List.Subheader>
                            </List.Section>
                        </View>
                        <View>
                            {selectedTrip && (
                                <List.Section>
                                    <List.Item title={getFormattedDate(new Date(selectedTrip.timestamp.seconds * 1000))} />
                                    <List.Item title={getFormattedTime(new Date(selectedTrip.timestamp.seconds * 1000))} />
                                    <List.Item title={(selectedTrip.totalDistance * 0.000621371).toFixed(1)} />
                                </List.Section>
                            )}
                        </View>
                    </View>

                </Modal>
            </Portal>


            <View>
                <DataTable>
                    <DataTable.Header>
                        <DataTable.Title sortDirection={sortDateDesc === null ? null : sortDateDesc ? 'ascending' : 'descending'}
    onPress={() => handleSort('date')}>Date</DataTable.Title>
                        <DataTable.Title sortDirection={sortDateDesc === null ? null : sortDateDesc ? 'ascending' : 'descending'}
    onPress={() => handleSort('date')}>Time</DataTable.Title>
                        <DataTable.Title>Destination</DataTable.Title>
                        <DataTable.Title numeric sortDirection={sortMilesDesc === null ? null : sortMilesDesc ? 'ascending' : 'descending'}
    onPress={() => handleSort('miles')}>Miles Travelled</DataTable.Title>
                    </DataTable.Header>

                    {tripsData.slice(from, to).map((value, index) => {
                    const date = new Date(value.timestamp.seconds * 1000);
                    return (
                        <DataTable.Row key={index} onPress={() => showTableRow(value)}>
                            <DataTable.Cell>{getFormattedDate(date)}</DataTable.Cell>
                            <DataTable.Cell>{getFormattedTime(date)}</DataTable.Cell>
                            <DataTable.Cell>
                                <ScrollView horizontal={true}>
                                    <Text>{value.tripName}</Text>
                                </ScrollView>
                            </DataTable.Cell>
                            <DataTable.Cell style={{justifyContent: 'flex-end'}}>{(value.totalDistance * 0.000621371).toFixed(1)}</DataTable.Cell>
                        </DataTable.Row>
                    )
                })}

                    <DataTable.Pagination 
                        page={page}
                        numberOfPages={Math.ceil(tripsData.length / itemsPerPage)} 
                        onPageChange={page => setPage(page)}
                        label={`${from + 1}-${to} of ${tripsData.length}`}
                        numberOfItemsPerPageList={numberOfItemsPerPageList}
                        showFastPaginationControls
                        numberOfItemsPerPage={itemsPerPage}
                        onItemsPerPageChange={setItemsPerPage}
                        selectPageDropdownLabel={'Rows Per Page'}
                    />

                    
                </DataTable>
            </View>
        </Provider>
    )
}