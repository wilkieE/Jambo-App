// AutocompleteLocationInput.js
import React from "react";
import { View, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { AutocompleteDropdown } from "react-native-autocomplete-dropdown";
import globalStyles from "../styles/globalStyles";

const AutocompleteLocationInput = ({
  getSuggestions,
  location,
  setLocation,
  placeholder,
}) => (
  <View style={globalStyles.inputContainer}>
    <AutocompleteDropdown
      dataSet={getSuggestions(location)}
      onChangeText={(text) => setLocation(text)}
      onSelectItem={(item) => setLocation(item)}
      textInputProps={{
        placeholder: placeholder,
        autoCorrect: false,
        autoCapitalize: "none",
        style: {
          // backgroundColor: "#ff0000",
          borderRadius: 5,
          paddingLeft: 8,
        },
      }}
      inputContainerStyle={{
        borderRadius: 5,
        marginLeft: 2,
        backgroundColor: "#ffffff",
      }}
      containerStyle={{ flexGrow: 1, flexShrink: 1 }}
      ChevronIconComponent={
        <Feather name="chevron-down" size={20} color="#000000" />
      }
      ClearIconComponent={<Feather name="x-circle" size={16} color="#000000" />}
      // inputHeight={50}
      showChevron={true}
      closeOnBlur={false}
    />
  </View>
);

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    backgroundColor: "#ffffff", // card-based design
    borderRadius: 10, // larger border radius
    marginVertical: 5,
    paddingHorizontal: 5, // larger horizontal padding
    paddingVertical: 10, // vertical padding
    alignItems: "center",
    shadowColor: "#000", // drop shadow for card-based design
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    borderWidth: 0.5,
    borderColor: "#003d30",
    borderColor: "#aaa",
  },
});

export default AutocompleteLocationInput;
