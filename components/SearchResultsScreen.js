import React from "react";
import Trip from "./Trip";
import { View, Text, StyleSheet, FlatList } from "react-native";
import globalStyles from "../styles/globalStyles";

const SearchResultsScreen = ({ navigation, route }) => {
  const { trips, adults, companyName, cost } = route.params;
  console.log("Searchscreen adults: ", adults);

  const handleSelect = (trip, adults) => {
    console.log("Searchscreen handleSelect adults: ", adults);
    navigation.navigate("BookDeparture", { trip, adults, companyName, cost });
  };

  const renderTrip = ({ item: trip }) => (
    <Trip
      trip={trip}
      onSelect={handleSelect}
      adults={adults}
      companyName={companyName}
      cost={cost}
    />
  );

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    // <View style={styles.container}>
    // <Text style={globalStyles.title}>Available Trips</Text>
    <>
      <FlatList

        data={trips}
        keyExtractor={(trip) => trip.trip_id.toString()}
        renderItem={renderTrip}
        contentInsetAdjustmentBehavior="automatic"
        paddingTop={20}
      // paddingLeft={10}
      // paddingRight={10}
      />
    </>
    // </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  tripContainer: {
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    backgroundColor: "#fff",
  },
  tripText: {
    fontSize: 16,
    marginBottom: 5,
  },
});

export default SearchResultsScreen;
