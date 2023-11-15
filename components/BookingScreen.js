import React, { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  View,
  Switch,
} from "react-native";
import { supabase } from "../lib/supabase";
import AutocompleteLocationInput from "./AutocompleteLocationInput";
import DateTimeSelector from "./DateTimeSelector";
import CustomTextInput from "./CustomTextInput";
import {
  searchTrips,
  checkSeatAvailability,
  getCompanyDetailsByTripId,
  validateBookingParameters,
} from "../lib/utils";
import { Alert } from "react-native";
import globalStyles from "../styles/globalStyles";
import bookingScreenStyles from "../styles/bookingScreenStyles";
import Toast from 'react-native-toast-message';
import { Button } from 'react-native';

const BookingScreen = ({ navigation, user }) => {
  const [departureDate, setDepartureDate] = useState(new Date());
  const [returnDate, setReturnDate] = useState(new Date());
  const [adults, setAdults] = useState("0");
  const [loading, setLoading] = useState(false);
  const [showReturn, setShowReturn] = useState(false);

  const [locations, setLocations] = useState([]);

  const [from, setFrom] = useState(null);
  const [to, setTo] = useState(null);

  // Fetch locations and set suggestions list
  useEffect(() => {
    const fetchLocations = async () => {
      let { data, error } = await supabase.from("locations").select("*");

      if (error) console.error("Error fetching locations: ", error);
      else setLocations(data);
    };

    fetchLocations();
  }, []);

  useEffect(() => {
    console.log("from: ", from);
    console.log("to: ", to);
    console.log("departureDate: ", departureDate.toLocaleDateString());
    console.log("returnDate: ", returnDate.toLocaleDateString());
    console.log("adults: ", adults);
  }, [from, to, departureDate, returnDate, adults]);

  // Function to get suggestions based on user input
  const getSuggestions = (q) => {
    if (typeof q !== "string" || q.length < 1) {
      return;
    }

    const filterToken = q.toLowerCase();
    const newSuggestions = locations
      .filter((location) =>
        location.location_name.toLowerCase().includes(filterToken)
      )
      .map((location) => ({
        id: location.location_id,
        title: location.location_name,
      }));

    return newSuggestions;
  };
  const search = async () => {
    const validationMessage = validateBookingParameters(
      from,
      to,
      adults,
      showReturn,
      returnDate
    );
    if (validationMessage) {
      Toast.show({ type: "error", text1: "Missing Data", text2: validationMessage });
      return;
    }
    setLoading(true);

    // Get trips
    //TODO optimize searchtrips. the loop is taking too long
    const startTime = performance.now();

    const trips = await searchTrips(from, to, departureDate).catch((error) => {
      console.error("Error searching trips: ", error);
    });

    const endTime = performance.now();
    // Calculate the elapsed time in milliseconds
    const elapsedTime = endTime - startTime;

    console.log(`searchTrips took ${elapsedTime} milliseconds to complete.`);


    if (!trips) {
      setLoading(false);
      return;
    }
    // console.log("trips: ", trips);
    console.log("number of trips: ", trips.length);

    const startTime2 = performance.now();

    const availableTrips = await checkSeatAvailability(trips, adults);
    const endTime2 = performance.now();
    const elapsedTime2 = endTime2 - startTime2;
    console.log(`checkSeatAvailability took ${elapsedTime2} milliseconds to complete.`);


    // console.log("availableTrips: ", availableTrips[0]);

    if (availableTrips.length > 0) {
      const startTime3 = performance.now();
      const { companyName, cost } = await getCompanyDetailsByTripId(
        availableTrips[0].trip_id
      );
      navigation.navigate("SearchResults", {
        trips: availableTrips,
        adults: adults,
        companyName: companyName,
        cost: cost,
      });
      const endTime3 = performance.now();
      const elapsedTime3 = endTime3 - startTime3;
      console.log(`getCompanyDetailsByTripId took ${elapsedTime3} milliseconds to complete.`);

    } else {
      console.log("No trips available");
      Alert.alert(
        "Search Result",
        "No available trips found, please select another date or route",
        [
          {
            text: "OK",
            onPress: () => console.log("OK Pressed"),
          },
        ]
      );
    }

    setLoading(false);
  };

  const isSearchDisabled =
    !from || !to || (showReturn && !returnDate) || parseInt(adults, 10) <= 0;

  const setTestingValues = () => {
    setFrom({ id: 1, title: "Kampala" });
    setTo({ id: 2, title: "Jinja" });
    setDepartureDate(new Date()); // Note: Month is 0-indexed, so 8 = September
    setReturnDate(new Date()); // Note: Month is 0-indexed, so 8 = September
    setAdults("1");
  };

  return (
    // <ScrollView scrollEnabled={false} style={globalStyles.container}>
    <ScrollView scrollEnabled={true} contentInsetAdjustmentBehavior="automatic">
      <View style={globalStyles.container} paddingTop={30} paddingHorizontal={10}>
        {/* <Text style={globalStyles.title}>Search</Text> */}

        <View style={bookingScreenStyles.toggleContainerParent}>
          <View style={bookingScreenStyles.toggleContainerHeadings}>
            <TouchableOpacity onPress={() => setShowReturn(false)}>
              <Text
                style={
                  !showReturn ? globalStyles.label : globalStyles.disabledLabel
                }
              >
                One-Way
              </Text>
            </TouchableOpacity>
            <View style={{ width: 10 }} />
            <TouchableOpacity onPress={() => setShowReturn(true)}>
              <Text
                style={
                  showReturn ? globalStyles.label : globalStyles.disabledLabel
                }
              >
                Round Trip
              </Text>
            </TouchableOpacity>
          </View>
          <View style={bookingScreenStyles.toggleContainer}>
            <Text style={globalStyles.regularText}>Return?</Text>
            <Switch
              trackColor={{ false: "#767577", true: "#a39f9f" }}
              thumbColor={showReturn ? "#4e18a6" : "#f4f3f4"}
              onValueChange={() => setShowReturn((prevState) => !prevState)}
              value={showReturn}
            />
          </View>
        </View>
        <View style={bookingScreenStyles.inputsParentContainer}>
          <View style={bookingScreenStyles.rowContainer}>
            <View style={bookingScreenStyles.rowInputContainer}>
              <Text style={globalStyles.label}>Depart</Text>
              <AutocompleteLocationInput
                getSuggestions={getSuggestions}
                location={from}
                setLocation={setFrom}
                placeholder={"Kampala"}
              />
            </View>

            <View style={bookingScreenStyles.rowInputContainer}>
              <Text style={globalStyles.label}>Arrive</Text>
              <AutocompleteLocationInput
                getSuggestions={getSuggestions}
                location={to}
                setLocation={setTo}
                placeholder={"Jinja"}
              />
            </View>
          </View>

          <View style={bookingScreenStyles.spaceBetweenContainer}>
            <View
              style={[
                bookingScreenStyles.rowInputContainer,
                { maxWidth: "45%" },
              ]}
            >
              <Text style={globalStyles.label}>Date</Text>
              <View style={globalStyles.inputContainer}>
                <DateTimeSelector
                  label="Departure"
                  date={departureDate}
                  setDate={setDepartureDate}
                />
              </View>
            </View>

            <View
              style={[
                bookingScreenStyles.rowInputContainer,
                { maxWidth: "45%" },
              ]}
            >
              <Text style={globalStyles.label}>Passengers</Text>
              <View style={globalStyles.inputContainer}>
                <CustomTextInput
                  iconName="users"
                  placeholder="0"
                  value={adults}
                  onChangeText={setAdults}
                  editable={true}
                  numeric={true}
                />
              </View>
            </View>
          </View>
          {showReturn && (
            <View
              style={[
                bookingScreenStyles.rowInputContainer,
                { marginTop: 10, paddingHorizontal: 10 },
              ]}
            >
              <Text style={globalStyles.label}>Return</Text>
              <View style={globalStyles.inputContainer}>
                <DateTimeSelector
                  label="Return"
                  date={returnDate}
                  setDate={setReturnDate}
                />
              </View>
            </View>
          )}
          <View style={{ height: 18 }} />
          <View style={bookingScreenStyles.rowContainer}>
            <TouchableOpacity
              style={[
                bookingScreenStyles.searchButton,
                isSearchDisabled && bookingScreenStyles.disabledButton,
              ]}
              onPress={search}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={bookingScreenStyles.buttonText}>Search</Text>
              )}
            </TouchableOpacity>
            {/* 
            <TouchableOpacity onPress={setTestingValues} style={bookingScreenStyles.searchButton}>
              <Text style={bookingScreenStyles.buttonText}>Set Test Values</Text>
            </TouchableOpacity> */}
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default BookingScreen;
