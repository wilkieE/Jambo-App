import "react-native-url-polyfill/auto";
import { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";
import Auth from "./components/Auth";
import BookingScreen from "./components/BookingScreen";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AutocompleteDropdownContextProvider } from "react-native-autocomplete-dropdown";
import SearchResultsScreen from "./components/SearchResultsScreen";
import BookDepartureScreen from "./components/BookDepartureScreen";
import TicketScreen from "./components/TicketScreen";
import QRCodeScreen from "./components/QRCodeScreen";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import TicketListScreen from "./components/TicketListScreen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
// import Toast from 'react-native-toast-message';
import Toast, { BaseToast, ErrorToast, SuccessToast } from 'react-native-toast-message';
import { FlatList, ScrollView } from "react-native-gesture-handler";
import { View } from "react-native";
import { Text } from "react-native-elements";
import MoreScreen from "./components/MoreScreen";
import AboutScreen from "./components/AboutScreen";


const HomeStack = createNativeStackNavigator();
const TicketStack = createNativeStackNavigator();
const MoreStack = createNativeStackNavigator();

function HomeStackScreen(session) {
  return (
    <HomeStack.Navigator
      screenOptions={{
        headerShown: true,
        headerLargeTitle: true,
        headerStyle: {
          // backgroundColor: '#4e18a6',
          backgroundColor: '#6a3de8',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <HomeStack.Screen name="Book" options={{ title: 'Search' }}>
        {(props) => (
          <BookingScreen {...props} user={session ? session.user : null} />
        )}
      </HomeStack.Screen>
      <HomeStack.Screen name="SearchResults" options={{ title: "Available Trips" }}>
        {(props) => (
          <SearchResultsScreen
            {...props}
            user={session ? session.user : null}
          />
        )}
      </HomeStack.Screen>
      <HomeStack.Screen name="BookDeparture" options={{ title: "Book Trip" }}>
        {(props) => (
          <BookDepartureScreen
            {...props}
            user={session ? session.user : null}
          />
        )}
      </HomeStack.Screen>
      <HomeStack.Screen name="QRCode">
        {(props) => (
          <QRCodeScreen {...props} user={session ? session.user : null} />
        )}
      </HomeStack.Screen>
    </HomeStack.Navigator>
  );
}

function TicketStackScreen(session) {
  return (
    <TicketStack.Navigator
      initialRouteName="Tickets"
      screenOptions={{
        headerShown: true, headerLargeTitle: true,
        headerStyle: {
          // backgroundColor: '#4e18a6',
          backgroundColor: '#6a3de8',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold'
        },
      }} >
      <TicketStack.Screen name="Tickets" options={{ title: "Your Tickets" }}>
        {(props) => (
          <TicketListScreen {...props} user={session ? session.user : null} />
        )}
      </TicketStack.Screen>
      <TicketStack.Screen name="TicketScreen" options={{ title: "Ticket Details" }}>
        {(props) => (
          <TicketScreen
            {...props}
            user={session ? session.user : null}
          />
        )}
      </TicketStack.Screen>
    </TicketStack.Navigator>
  );
}

function MoreStackScreen(session) {
  return (
    <MoreStack.Navigator
      initialRouteName="More"
      screenOptions={{
        headerShown: true, headerLargeTitle: true,
        headerStyle: {
          // backgroundColor: '#4e18a6',
          backgroundColor: '#6a3de8',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold'
        },
      }} >
      <MoreStack.Screen name="More" options={{ title: "More Options" }}>
        {(props) => (
          <MoreScreen {...props} user={session ? session.user : null} />
        )}
      </MoreStack.Screen>

    </MoreStack.Navigator>
  );
}

const Tab = createBottomTabNavigator();

SplashScreen.preventAutoHideAsync();

const toastConfig = {
  default: (props) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: '#4e18a6' }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 15,
        fontWeight: '400'
      }}
      text2Style={{
        fontSize: 18,
        color: '#4e18a6',
        fontWeight: '400'
      }}
    />
  ),
  login: (props) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: '#6a3de8', backgroundColor: '#ff0000' }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 15,
        fontWeight: 'bold',
        color: '#ffffff',
        fontFamily: 'Poppins-Bold'
      }}
      text2Style={{
        fontSize: 18,
        color: '#ffffff',
        fontWeight: '400'
      }}
    />
  ),
  success: (props) => (
    <SuccessToast
      {...props}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 15,
        fontWeight: '400'
      }}
      text2Style={{
        fontSize: 18,
        color: '#000',
        fontWeight: '400'
      }}
    />
  ),
  error: (props) => (
    <ErrorToast
      {...props}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      backgroundColor="#ff0000"
      text1Style={{
        fontSize: 15,
        fontWeight: '400'
      }}
      text2Style={{
        fontSize: 18,
        color: '#000',
        fontWeight: '400'
      }}
    />
  ),

};

export default function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth
      .getSession()
      .then((session) => {
        setSession(session);
      })
      .catch((error) => {
        console.error("Error getting session:", error);
      });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  const [fontsLoaded] = useFonts({
    "Poppins-Regular": require("./assets/fonts/Poppins-Regular.ttf"),
    "Poppins-Bold": require("./assets/fonts/Poppins-Bold.ttf"),
  });

  useEffect(() => {
    const hideSplashScreen = async () => {
      if (fontsLoaded) {
        await SplashScreen.hideAsync();
      }
    };

    hideSplashScreen();
    console.log("fontsLoaded: ", fontsLoaded);
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }
  return (
    <AutocompleteDropdownContextProvider>
      <NavigationContainer>
        <Tab.Navigator
          initialRouteName="Booking"
          screenOptions={{
            // tabBarActiveTintColor: "#4a148c",
            tabBarActiveTintColor: "#6a3de8",
            tabBarInactiveTintColor: "grey",
            tabBarStyle: [
              {
                display: "flex",
              },
              null,
            ],
          }}
        >
          {session && session.user ? (
            <>
              <Tab.Screen
                name="Booking"
                initialRouteName="Book"
                options={{
                  headerShown: false,
                  // tabBarLabel: "",
                  tabBarIcon: ({ color }) => (
                    <Ionicons name="search-outline" size={28} color={color} />
                  ),
                }}
              >
                {(props) => (
                  <HomeStackScreen
                    {...props}
                    user={session ? session.user : null}
                  />
                )}
              </Tab.Screen>

              <Tab.Screen
                name="TicketsTab"
                initialRouteName="Tickets"
                options={{
                  title: "Tickets",
                  headerShown: false,
                  // tabBarLabel: "",
                  tabBarIcon: ({ color }) => (
                    <Ionicons name="bus-outline" size={28} color={color} />
                  ),
                }}
              >
                {(props) => (
                  <TicketStackScreen
                    {...props}
                    user={session ? session.user : null}
                  />
                )}
              </Tab.Screen>

              <Tab.Screen
                name="MoreTab"
                initialRouteName="More"
                options={{
                  title: "More",
                  headerShown: false,
                  // tabBarLabel: "",
                  tabBarIcon: ({ color }) => (
                    <Ionicons name="information-circle-outline" size={28} color={color} />
                  ),
                }}
              >
                {(props) => (
                  <MoreStackScreen
                    {...props}
                    user={session ? session.user : null}
                  />
                )}
              </Tab.Screen>
            </>
          ) : (
            <Tab.Screen
              name="Auth"
              component={Auth}
              options={{
                headerShown: true,
                headerTransparent: true,
                headertranslucent: true,
                headerTitle: "",
                headerStyle: { backgroundColor: "#6a3de8" },
                tabBarStyle: { display: "none" },
              }}
            />
          )}
        </Tab.Navigator>
      </NavigationContainer>
      <Toast config={toastConfig} position="top" topOffset={60} keyboardOffset={10} style={{ borderLeftColor: '#4e18a6' }} />
    </AutocompleteDropdownContextProvider>
  );
}
