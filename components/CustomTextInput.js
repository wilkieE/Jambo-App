import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";

const CustomTextInput = ({
  iconName,
  placeholder,
  value,
  onChangeText,
  editable,
  numeric,
}) => {
  return (
    <View style={styles.inputContainer}>
      <Feather name={iconName} size={20} color="darkgray" />
      <TextInput
        style={styles.input}
        value={value}
        placeholder={placeholder}
        onChangeText={onChangeText}
        editable={editable === undefined ? true : editable}
        keyboardType={numeric ? "numeric" : "default"}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    borderRadius: 10,
    // marginVertical: 5,
    paddingHorizontal: 15,
    alignItems: "center",
  },
  input: {
    height: 40,
    flex: 1,
    marginLeft: 10,
  },
});

export default CustomTextInput;
