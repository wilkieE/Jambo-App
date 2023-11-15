import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, FlatList, VirtualizedList, TouchableOpacity, ScrollView } from "react-native";
import globalStyles from "../styles/globalStyles";
import { fetchUserTickets } from "../lib/utils";
import OldTicket from "./OldTicket";
import { ActivityIndicator } from "react-native-paper";
// import { ScrollView } from "react-native-gesture-handler";
import { supabase } from "../lib/supabase";
import { Image } from "react-native-elements";

const TicketListScreen = ({ navigation, user }) => {
  const [userTickets, setUserTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTickets = async () => {
      const { success, userTickets, errorMessage } = await fetchUserTickets(
        user.id
      );

      if (success) {
        setUserTickets(userTickets);
      } else {
        setError(errorMessage);
      }

      setIsLoading(false);
    };

    fetchTickets();
  }, [user.id]);

  const handleSelect = (trip, adults, companyName, cost) => {
    console.log("Searchscreen handleSelect adults: ", adults);
    navigation.navigate("TicketScreen", { trip, adults, companyName, cost });
  };

  const renderTrip = ({ item: trip }) => (
    <OldTicket
      trip={trip}
      onSelect={handleSelect}
      adults={trip.adults}
      companyName={trip.companyName}
      cost={trip.cost}
    />
  );

  function logout() {
    setIsLoading(true);
    supabase.auth.signOut();
    setIsLoading(false);
  }
  if (isLoading || !user || !userTickets || !userTickets.length || !userTickets[0] || error) {
    return (
      <ScrollView contentContainerStyle={styles.containerEmpty} contentInsetAdjustmentBehavior="automatic">
        {/* <Text style={globalStyles.title}>Ticket History</Text> */}

        {isLoading && (
          <View style={styles.containerEmpty}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View >
        )}

        {
          error && (
            <>
              <Image source={require("../assets/tickets-svgrepo.png")} style={{ width: 100, height: 100, marginBottom: 30 }} />
              <Text style={globalStyles.errorText}>Error</Text>
              <Text>{userTickets.length}</Text>
              <Text>Error: {error}</Text>
            </>
          )
        }

        {
          userTickets.length === 0 && !isLoading && (
            <>
              <Image source={require("../assets/tickets-svgrepo.png")} style={{ width: 100, height: 100, marginBottom: 30 }} />
              <Text style={styles.textTitle}>You do not have any tickets yet</Text>
              <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Book')} >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={globalStyles.buttonText}>Book trip now!</Text>
                )}
              </TouchableOpacity>
            </>
          )
        }
      </ScrollView >
    );
  }
  return (
    <FlatList
      width={'100%'}
      data={userTickets}
      keyExtractor={(trip) => trip.trip_id.toString()}
      renderItem={renderTrip}
      contentContainerStyle={styles.container}
      contentInsetAdjustmentBehavior="automatic"
    />
  );

};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingVertical: 20,
    // flex: 1,
    // width: '100%',
    // display: "flex",
    // alignItems: "stretch",

  },
  containerEmpty: {
    display: "flex",
    minHeight: "80%",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  textTitle: {
    fontSize: 22,
    fontWeight: "500",
    marginBottom: 10,
  },
  ticketItem: {
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
  button: {
    padding: 10,
    borderRadius: 8,
    // backgroundColor: "#4e18a6",
    backgroundColor: '#6a3de8',
    color: "#4e18a6",
    margin: 'auto',
    marginTop: 30,
    width: 200,
    alignItems: "center",
    alignSelf: "center",
  },
  imageIcon: {
    width: 150,
    height: 150,
    alignSelf: 'center',
  },
});

export default TicketListScreen;
