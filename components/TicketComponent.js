import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { TouchableRipple } from "react-native-paper";
import Icon from "react-native-vector-icons/Feather";


const formatTime = (isoString) => {
  const date = new Date(isoString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};
function formatDate(isoString) {
  const date = new Date(isoString);
  const weekday = (date.toLocaleString('en-US', { weekday: 'short' })).substring(0, 3);
  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'short' });
  const year = date.getFullYear();

  return `${weekday}, ${day} ${month} ${year}`;
};

const DetailRow = ({ icon, label, value }) => (
  <View style={styles.detailRow}>
    <Icon name={icon} size={22} color={colors.iconColor} style={styles.icon} />
    <Text style={styles.ticketDetail}>
      {label}: <Text style={styles.boldDetail}>{value}</Text>
    </Text>
  </View>
);

export default function TicketComponent({ trip, adults, user, bookedSeats, companyName, companyLogos, }) {
  // const [isExpired, setIsExpired] = React.useState(false);
  trip_time = trip.trip_time ?? trip.trips.trip_time;
  bus_id = trip.bus_id ?? trip.trips.bus_id;
  const isExpired = (trip_time < new Date().toISOString());


  return (
    <TouchableRipple style={styles.ticketContainer} onPress={() => { }}>
      <>
        <Image source={companyLogos[companyName]} style={styles.logo} />
        <Text style={styles.confirmationText}>Digital Ticket</Text>
        {isExpired ? (
          <Text style={{ color: 'red' }}>Expired</Text>
        ) : (null)
        }
        <View style={styles.divider} />

        <View style={styles.ticketDetailsContainer}>
          <View style={styles.rowContainer}>
            <DetailRow icon="map-pin" label="Trip ID" value={trip.trip_id} />
            <DetailRow icon="clock" label="Departure" value={formatTime(trip_time)} />
            <DetailRow icon="calendar" label="Date" value={formatDate(trip_time)} />
          </View>
          <View style={styles.rowContainer}>
            <DetailRow icon="user" label="Tickets" value={adults} />
            <DetailRow icon="hash" label="Bus ID" value={bus_id} />
          </View>
        </View>

        <View style={styles.qrContainer}>
          <QRCode
            value={JSON.stringify({
              tripId: trip.trip_id,
              userId: user.id,
              seats: bookedSeats,
            })}
            size={150}
            style={styles.qrCode}
          />
          <Text style={styles.qrCaption}>Scan to Check-in</Text>
        </View>
      </>
    </TouchableRipple >
  );
}

const colors = {
  primary: "#336699",
  secondary: "#555",
  tertiary: "#ddd",
  quaternary: "#333",
  iconColor: "#336699",
  bgColor: "#FFF",
  qrBg: "#F7F9FC",
};

const styles = StyleSheet.create({
  ticketContainer: {
    backgroundColor: colors.bgColor,
    padding: 20,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
    width: "100%",
    alignSelf: "center",
    marginBottom: 20,
  },
  divider: {
    height: 1,
    width: "90%",
    backgroundColor: colors.tertiary,
    marginVertical: 15,
  },
  ticketTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: colors.primary,
    letterSpacing: 1,
  },
  ticketDetailsContainer: {
    width: "100%",
    marginBottom: 20,
    alignItems: "flex-start",
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  ticketDetail: {
    fontSize: 15,
    marginLeft: 10,
    color: colors.secondary,
    fontFamily: "Poppins-Regular",
  },
  boldDetail: {
    color: colors.quaternary,
    fontFamily: "Poppins-Bold",
    fontWeight: "600",
  },
  logo: {
    width: 120,
    height: 120,
    resizeMode: "contain",
    // marginBottom: 10,
  },
  qrCode: {
    alignSelf: "center",
  },
  icon: {
    opacity: 0.9,
  },
  qrContainer: {
    alignSelf: "center",
    padding: 20,
    borderRadius: 15,
    backgroundColor: colors.qrBg,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 5,
    alignItems: "center",
    // marginBottoms: 10,
  },
  qrCaption: {
    marginTop: 10,
    fontSize: 14,
    color: colors.secondary,
  },
  confirmationText: {
    fontSize: 20,
    color: "purple",
    fontFamily: "Poppins-Bold",
  },
});

