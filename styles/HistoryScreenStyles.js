import { StyleSheet } from "react-native";

const TicketListScreenStyles = StyleSheet.create({
  inputsParentContainer: {
    // paddingHorizontal: 10,
  },
  carousel: {
    height: "20%",
    width: "100%",
  },
  title: {
    fontSize: 32,
    fontFamily: "Poppins-Bold",
    textAlign: "center",
    marginVertical: 10,
    color: "#4e18a6",
  },
  searchButton: {
    backgroundColor: "#4e18a6",
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 20,
    fontFamily: "Poppins-Bold",
  },
  rowContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    // borderRadius: 8,
    // marginVertical: 10,
    // shadowColor: "#000",
    // shadowOffset: {
    //   width: 0,
    //   height: 1,
    // },
    // shadowOpacity: 0.2,
    // shadowRadius: 1.41,
    // elevation: 2,
  },
  rowInputContainer: {
    flex: 1,
    // backgroundColor: "blue",
    // marginLeft: 5,
    // marginRight: 5,
  },
  toggleContainerParent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: "5%",
    minHeight: 50,
    marginTop: 10,
    paddingHorizontal: 10,
  },
  spaceBetweenContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    // height: "5%",
    minHeight: 50,
    marginTop: 10,
    paddingHorizontal: 10,
  },
  toggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    // width: "50%",
    marginVertical: 10,
  },
  toggleContainerHeadings: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "50%",
    marginVertical: 10,
  },
  toggleLabel: {
    fontSize: 16,
    color: "#333",
    fontFamily: "Poppins-Bold",
  },
});

export default TicketListScreenStyles;
