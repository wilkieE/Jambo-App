import React from "react";
import PropTypes from "prop-types";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";

const companyLogos = {
  "Modern Coast": require("../assets/companylogos/Modern_Coast.png"),
};
const formatCurrency = (amount) => {
  const dollars = Math.floor(amount);
  const cents = ((amount - dollars) * 100).toFixed(0);
  return { dollars, cents };
};

const amenities = [
  { name: "wifi", icon: "wifi" },
  { name: "luggage", icon: "work" },
  { name: "toilet", icon: "wc" },
  { name: "ac", icon: "ac-unit" },
  { name: "power", icon: "power" },
];
const getRandomAmenities = () => {
  return amenities.map((amenity) => ({
    ...amenity,
    available: Math.random() >= 0.5,
  }));
};

const OldTicket = ({ trip, onSelect, adults, companyName, cost }) => {
  const randomAmenities = getRandomAmenities();

  const logoSource = companyLogos[companyName];
  const { dollars, cents } = formatCurrency(cost);

  const { trips } = trip;
  const { trip_time } = trips;
  const isExpired = (trip.trips.trip_time < new Date().toISOString());

  return (
    <TouchableOpacity style={styles.tripContainer} onPress={() => onSelect(trip, adults, companyName, cost)} >
      <Image source={logoSource} style={styles.logo} />
      <View style={styles.textContainer}>
        <View style={styles.timeRow}>
          <Text style={styles.timeText}>{formatTime(trip_time)}</Text>
          <View style={styles.timeLine}>
            <Text style={styles.durationText}>1hr 45m</Text>
          </View>
          <Text style={styles.timeText}>{getEndTime(trip_time)}</Text>
        </View>
        <View style={styles.detailsRow}>
          <MaterialIcons name="event-seat" size={18} color="#555" />
          <Text style={styles.seatsText}>{trip.adults}</Text>
          <MaterialIcons
            name="business"
            size={18}
            color="#555"
            style={styles.companyIcon}
          />
          <Text style={styles.companyText}>{companyName} | </Text>
          {isExpired ? (
            <>
              <MaterialIcons name="error" style={styles.companyIcon} size={18} color="red" />
              <Text style={[styles.companyText, { color: 'red' }]}>
                {formatDate(trip_time)}
              </Text>
            </>

          ) : (<Text style={styles.companyText}>{formatDate(trip_time)}</Text>)}

        </View>
        <View style={styles.footerRow}>
          <View style={styles.featuresContainer}>
            {randomAmenities.map((amenity, index) => (
              <MaterialIcons
                key={index}
                name={amenity.icon}
                size={13}
                color={amenity.available ? "#1E90FF" : "#aaa"}
                style={styles.featureIcon}
              />
            ))}
          </View>
          <View style={styles.costContainer}>
            <View style={styles.costContainer}>
              <Text style={styles.costDollarText}>UGX{dollars}</Text>
              <View style={styles.centsContainer}>
                <Text style={styles.costCentsText}>.{cents}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const formatTime = (isoString) => {
  const date = new Date(isoString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};
const formatDate = (isoString) => {
  const date = new Date(isoString);
  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'short' });
  const year = date.getFullYear();

  return `${day} ${month}`;
};
const getEndTime = (isoString) => {
  const date = new Date(isoString);
  date.setHours(date.getHours() + 1);
  date.setMinutes(date.getMinutes() + 45);
  return formatTime(date.toISOString());
};

const styles = StyleSheet.create({
  tripContainer: {
    flexDirection: "row",
    paddingVertical: 20,
    paddingHorizontal: 15,
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: "#aaa",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    backgroundColor: "#fff",
    alignItems: "center",
    transition: "all 0.2s ease-in-out",
  },
  textContainer: {
    flex: 1,
    marginLeft: 20,
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", // Makes sure items take the full width
    marginTop: 6,
  },
  featuresContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10, // Adjust spacing as per design requirements
  },
  costContainer: {
    flexDirection: "row",
    alignItems: "center", // Keeps dollar and cents aligned
  },
  featureIcon: {
    marginRight: 3, // Space between icons
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 3,
  },

  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  timeLine: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 6,
    borderBottomWidth: 0.5,
    borderColor: "#aaa",
  },
  durationText: {
    color: "#777",
    fontSize: 12,
    position: "absolute",
    backgroundColor: "#fff",
    paddingHorizontal: 5,
  },
  timeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#333",
  },
  detailsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 0,
  },
  seatsText: {
    fontSize: 14,
    marginLeft: 5,
    marginRight: 10,
    color: "#555",
  },
  companyIcon: {
    marginRight: 5,
  },
  companyText: {
    fontSize: 14,
    color: "#555",
  },
  costDollarText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#000",
    marginBottom: -4, // This can help in precise positioning, adjust as needed
  },
  centsContainer: {
    flexDirection: "row",
    alignItems: "flex-start", // Aligns at the top
  },
  costCentsText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
    marginRight: 10,
  },
  logo: {
    width: 90,
    height: 40,
    borderColor: "#eee",
    borderWidth: 0,
  },
});

OldTicket.propTypes = {
  trip: PropTypes.object.isRequired,
  adults: PropTypes.number.isRequired,
  companyName: PropTypes.string.isRequired,
  cost: PropTypes.number.isRequired,
};

export default OldTicket;
