import { StyleSheet } from "react-native";

export const dateTimeSelectorStyles = StyleSheet.create({
  datePickerContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 0,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  label: {
    fontSize: 16,
    fontFamily: "Poppins-Bold",
    color: "darkgray",
    marginBottom: 5,
  },
  iconButton: {
    backgroundColor: "#4e18a6",
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  input: {
    height: 40,
    // flex: 1,
    // marginLeft: 10,
    // borderColor: "lightgray",
    // borderWidth: 1,
    // borderRadius: 5,
    // paddingHorizontal: 10,
  },
});
