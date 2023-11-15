import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { bookTicket } from "../lib/utils";
import globalStyles from "../styles/globalStyles";
import styles from "../styles/bookDepartureStyles";

// Step 1: Import the TicketComponent
import TicketComponent from "./TicketComponent"; // Adjust the path based on your project structure
import { ActivityIndicator } from "react-native-paper";
import Toast from "react-native-toast-message";

const BookDepartureScreen = ({ navigation, route, user }) => {
  const { trip, adults, companyName, cost } = route.params;
  const [errorMessage, setErrorMessage] = useState(null);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirmBooking = async () => {
    setIsLoading(true);
    const seatsToBook = trip.availableSeats.slice(0, adults);
    setBookedSeats(seatsToBook);
    const result = await bookTicket(trip.trip_id, seatsToBook, user);

    if (result.success) {
      // setBookingConfirmed(true);
      Toast.show({ type: 'success', text1: 'Booking Confirmed!', text2: 'Your ticket has been booked successfully.' });
      navigation.navigate('TicketsTab', { screen: 'TicketScreen', params: { trip, adults, companyName, cost }, initial: false });
      setErrorMessage(null);
    } else {
      setErrorMessage(result.errorMessage);
    }
    setIsLoading(false);
  };
  const companyLogos = {
    "Modern Coast": require("../assets/companylogos/Modern_Coast.png"),
  };
  return (
    <ScrollView style={[globalStyles.container, { paddingHorizontal: 40 }]} contentInsetAdjustmentBehavior="automatic">
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          marginVertical: 140,
        }}
      >
        <Text style={styles.tripInfo}>
          Departure Time: {formatTime(trip.trip_time)}
        </Text>
        <Text style={styles.tripInfo}>
          Departure Date: {formatDate(trip.trip_time)}
        </Text>
        <Text style={styles.tripInfo}>Number of Tickets: {adults}</Text>
        <Text style={styles.tripInfo}>Bus ID: {trip.bus_id}</Text>
        {isLoading ? (
          <ActivityIndicator
            size="large"
            color="#00ff00"
            style={{ marginTop: 20 }}
          />
        ) : (
          <TouchableOpacity
            style={[globalStyles.button]}
            onPress={handleConfirmBooking}
          >
            <Text style={globalStyles.buttonText}>Confirm Booking</Text>
          </TouchableOpacity>
        )}
      </View>

      {errorMessage && (
        <Text style={globalStyles.errorText}>{errorMessage}</Text>
      )}
    </ScrollView>
  );

  function formatTime(isoString) {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  function formatDate(isoString) {
    const date = new Date(isoString);
    const weekday = (date.toLocaleString('en-US', { weekday: 'short' })).substring(0, 3);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();

    return `${weekday}, ${day} ${month} ${year}`;
  };
};

export default BookDepartureScreen;
