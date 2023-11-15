// DateTimeSelector.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Feather } from "@expo/vector-icons";
import { dateTimeSelectorStyles as styles } from "../styles/dateTimeSelectorStyles";
import { Icon } from "react-native-elements";

const DateTimeSelector = ({ label, date, time, setDate }) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  // const [showTimePicker, setShowTimePicker] = useState(false);

  const dateFormatter = new Intl.DateTimeFormat("en-US");
  // const timeFormatter = new Intl.DateTimeFormat("en-US", {
  //   hour: "2-digit",
  //   minute: "2-digit",
  // });

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === "ios");
    setDate(currentDate);
    // onDateChange(currentDate);
  };

  // const onChangeTime = (event, selectedTime) => {
  //   const currentTime = selectedTime || time;
  //   setShowTimePicker(Platform.OS === "ios");
  //   setTime(currentTime);
  //   onTimeChange(currentTime);
  // };

  if (Platform.OS === "ios") return (
    <View style={styles.datePickerContainer}>
      <View style={styles.row}>
        {/* <TextInput
          style={styles.input}
          value={date ? dateFormatter.format(date) : "Select Date"}
          editable={false}
        /> */}
        <Feather name="calendar" size={18} color="darkgray" />
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={onChangeDate}
          minimumDate={new Date()}
          maximumDate={new Date(new Date().setDate(new Date().getDate() + 30))} // cant book further than 30 days in future
          marginLeft={-10}
          iconButton={<Icon name="calendar" size={18} color="#000" />}
        />
        {/* <TouchableOpacity
          style={styles.iconButton}
          // onPress={() => setShowDatePicker(true)}
          onPress={() => setShowDatePicker(true)}
        >
          <Feather name="calendar" size={18} color="white" />
        </TouchableOpacity> */}
      </View>
      {/* {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={onChangeDate}
          iconButton={styles.iconButton}
        />
      )} */}

      {/* <Text style={styles.label}>Time</Text>
      <View style={styles.row}>
        <Feather name="clock" size={20} color="darkgray" />
        <TextInput
          style={styles.input}
          value={time ? timeFormatter.format(time) : "Select Time"}
          editable={false}
        />
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => setShowTimePicker(true)}
        >
          <Feather name="edit-2" size={20} color="white" />
        </TouchableOpacity>
      </View>
      {showTimePicker && (
        <DateTimePicker
          value={time}
          mode="time"
          display="default"
          is24Hour={true}
          onChange={onChangeTime}
        />
      )} */}
    </View>
  );

  return (
    <View style={styles.datePickerContainer}>
      <View style={styles.row}>
        <TextInput
          style={styles.input}
          value={date ? dateFormatter.format(date) : "Select Date"}
          editable={false}
        />
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Feather name="calendar" size={20} color="white" />
        </TouchableOpacity>
      </View>
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={onChangeDate}
        />
      )}

      {/* <Text style={styles.label}>Time</Text>
      <View style={styles.row}>
        <Feather name="clock" size={20} color="darkgray" />
        <TextInput
          style={styles.input}
          value={time ? timeFormatter.format(time) : "Select Time"}
          editable={false}
        />
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => setShowTimePicker(true)}
        >
          <Feather name="edit-2" size={20} color="white" />
        </TouchableOpacity>
      </View>
      {showTimePicker && (
        <DateTimePicker
          value={time}
          mode="time"
          display="default"
          is24Hour={true}
          onChange={onChangeTime}
        />
      )} */}
    </View>
  );
};

export default DateTimeSelector;
