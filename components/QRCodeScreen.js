// screens/QRCodeScreen.js
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import QRCode from "react-native-qrcode-svg";

const QRCodeScreen = ({ route }) => {
  const { tripId, userId, seats } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Booking QR Code</Text>
      <QRCode value={JSON.stringify({ tripId, userId, seats })} size={200} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontFamily: "Poppins-Bold",
  },
});

export default QRCodeScreen;
