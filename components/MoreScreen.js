import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Linking, TouchableOpacity } from 'react-native';
import Toast from 'react-native-toast-message';
import { Ionicons } from "@expo/vector-icons";
// import { Image } from 'react-native-elements';
import { supabase } from '../lib/supabase';
import { ActivityIndicator } from 'react-native-paper';
import { Image } from 'react-native-svg';
import globalStyles from '../styles/globalStyles';
// import { getBuildNumber, getVersion } from 'react-native-device-info';

const MoreScreen = ({ navigation }) => {
    // Define the list of items for the "More" screen
    const moreItems = [
        { title: 'Profile', action: () => handleNavigation('Profile') },
        { title: 'About', action: () => handleNavigation('About') },
        { title: 'Terms and Conditions', action: () => handleNavigation('Terms') },
        { title: 'Privacy Policy', action: () => handleNavigation('Privacy') },
        { title: 'Settings', action: () => handleNavigation('Settings') },
        { title: 'Feedback', action: () => handleFeedback() },
        { title: 'Log Out', action: () => logout() },
    ];
    const [isLoading, setisLoading] = useState(false);

    // Function to handle navigation for each item
    const handleNavigation = (item) => {
        // navigation.navigate(item);
        Toast.show({ type: 'success', text2: `${item} Coming Soon` });
    };

    function logout() {
        setisLoading(true);
        supabase.auth.signOut();
        // setisLoading(false);
    }

    // Function to handle feedback
    const handleFeedback = () => {
    };

    if (isLoading) {
        return (
            <ScrollView contentContainerStyle={globalStyles.containerEmpty} contentInsetAdjustmentBehavior="automatic" paddingTop={50}>
                <ActivityIndicator size="large" color="#0000ff" />
            </ScrollView>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container} contentInsetAdjustmentBehavior="automatic" paddingTop={50}>

            {moreItems.map((item, index) => (
                <TouchableOpacity key={index} onPress={item.action}>
                    <View style={styles.itemContainer}>
                        <Text style={styles.itemText}>{item.title}</Text>
                        <Ionicons name="ios-arrow-forward" size={20} color="grey" />
                    </View>
                </TouchableOpacity>
            ))}
            <View style={styles.versionContainer}>
                <Ionicons name="ios-information-circle-outline" size={20} color="grey" />
                {/* <Text style={styles.versionText}>App Version: {`${getVersion} (${getBuildNumber})`}</Text> */}
                <Text style={styles.versionText}>App Version: {`1.0.0 (Beta Build 6)`}</Text>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    versionContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignContent: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 2,
        padding: 20,
    },
    versionText: {
        fontSize: 14,
        // fontWeight: 500,
        color: 'grey',
        textAlign: 'right',
    },
    itemContainer: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    itemText: {
        fontSize: 16,
        fontFamily: "Poppins-Regular",
    },
});

export default MoreScreen;
