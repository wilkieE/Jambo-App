import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { bookTicket } from "../lib/utils";
import globalStyles from "../styles/globalStyles";
import styles from "../styles/bookDepartureStyles";

// Step 1: Import the TicketComponent
import TicketComponent from "./TicketComponent"; // Adjust the path based on your project structure

const TicketScreen = ({ navigation, route, user }) => {
    const { trip, adults, companyName, cost } = route.params;
    const [errorMessage, setErrorMessage] = useState(null);
    const [bookedSeats, setBookedSeats] = useState([]);
    const [bookingConfirmed, setBookingConfirmed] = useState(false);

    const handleConfirmBooking = async () => {
        const seatsToBook = trip.availableSeats.slice(0, adults);
        setBookedSeats(seatsToBook);
        const result = await bookTicket(trip.trip_id, seatsToBook, user);

        if (result.success) {
            setBookingConfirmed(true);
            setErrorMessage(null);
        } else {
            setErrorMessage(result.errorMessage);
        }
    };
    const companyLogos = {
        "Modern Coast": require("../assets/companylogos/Modern_Coast.png"),
    };
    return (
        <ScrollView style={[globalStyles.container, { paddingHorizontal: 40 }]} contentInsetAdjustmentBehavior="automatic">
            <Text style={globalStyles.title}>
                Ticket Details
            </Text>

            <View style={{ justifyContent: "center", alignItems: "center" }}>
                {/* <Text style={styles.confirmationText}>View your trip details!</Text> */}
                <TicketComponent
                    trip={trip}
                    adults={adults}
                    user={user}
                    bookedSeats={bookedSeats}
                    companyName={companyName}
                    companyLogos={companyLogos}
                />
            </View>

            {errorMessage && (
                <Text style={globalStyles.errorText}>{errorMessage}</Text>
            )}
        </ScrollView>
    );
};

export default TicketScreen;
