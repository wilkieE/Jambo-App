import React, { useState } from "react";
import { ActivityIndicator, Alert, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { supabase } from "../lib/supabase";
import { Button, Image, Input, Text } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";
const colors = {
  oliveGreen: "#005647",
  orange: "#D96E11",
  white: "#FFFFFF",
};
import * as Linking from "expo-linking";
import { startAsync } from "expo-auth-session";
import { KeyboardAvoidingView } from "react-native";
import Toast from "react-native-toast-message";
import globalStyles from "../styles/globalStyles";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function signInWithEmail() {
    setLoading(true);
    //check if email is a valid email and password is at least 6 characters and nothing is blank
    if (!email || !password) {
      Toast.show({ type: 'login', text1: "Error!", text2: "Email and password cannot be blank." });
      setLoading(false);
      return;
    }
    // check if email is valid using regex
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      Toast.show({ type: 'login', text1: "Error!", text2: "Email is invalid." });
      setLoading(false);
      return;
    }
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) Toast.show({ type: 'login', text1: error.message });
    setLoading(false);
  }

  async function signUpWithEmail() {
    setLoading(true);
    //check if email is a valid email and password is at least 6 characters and nothing is blank
    if (!email || !password) {
      Toast.show({ type: 'login', text1: "Error!", text2: "Email and password cannot be blank." });
      setLoading(false);
      return;
    }
    if (password.length < 4) {
      Toast.show({ type: 'login', text1: "Error!", text2: "Password must be at least 4 characters." });
      setLoading(false);
      return;
    }
    // check if email is valid using regex
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      Toast.show({ type: 'login', text1: "Error!", text2: "Email is invalid." });
      setLoading(false);
      return;
    }
    const { error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) Toast.show({ type: 'login', text1: error.message });
    if (!error) Toast.show({ type: "success", autoHide: false, text2: "Please check your email for verification link", text1: "Account created!" });
    setLoading(false);
  }

  //sign in with google
  async function signInWithGoogle() {
    setLoading(true);

    try {
      const returnUrl = Linking.createURL("/auth/callback");
      const payload = await startAsync({
        authUrl: `https://kwyezimolkwsbblpvdgz.supabase.co/auth/v1/authorize?provider=google&redirect_to=${returnUrl}`,
        returnUrl,
      });
      console.log(payload);

      if (!payload.params?.access_token) {
        throw new Error("No access token found");
      }

      const { access_token, refresh_token } = payload.params;
      if (access_token && refresh_token) {
        const response = await supabase.auth.setSession({
          access_token,
          refresh_token,
        });
        const {
          data: { session, user },
          error: respError,
        } = response;
        error = respError;
      }

      if (error) {
        throw new Error(error.message);
      }
    } catch (error) {
      Toast.show({ type: 'login', text1: "Error!", text2: error.message || "An unexpected error occurred." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={require('../assets/busicon.png')} style={styles.image} />
        <Text style={styles.title}>Jambo</Text>
        <Text style={styles.subtitle}>Book your Bus Trip today</Text>
      </View>
      {loading && <ActivityIndicator size="large" color={colors.orange} />}

      <View style={styles.inputContainer}>
        <Input
          label="Email"
          leftIcon={{
            type: "font-awesome",
            name: "envelope",
            color: colors.oliveGreen,
          }}
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder="email@address.com"
          autoCapitalize={"none"}
          inputStyle={styles.input}
          autoComplete="email"
        />
      </View>
      <View style={styles.inputContainer}>
        <Input
          label="Password"
          leftIcon={{
            type: "font-awesome",
            name: "lock",
            color: colors.oliveGreen,
          }}
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry={true}
          placeholder="Password"
          autoCapitalize={"none"}
          inputStyle={styles.input}
        />
      </View>

      {/* <KeyboardAvoidingView behavior="padding"> */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={() => signInWithEmail()} disabled={loading} style={[globalStyles.searchButton, { display: 'flex', flexDirection: 'row' }]}>
          <View style={{ marginRight: 10 }}>
            <Icon name="sign-in" size={20} color={colors.white} />
          </View>
          <Text style={{ color: colors.white, fontSize: 18 }}>Log In</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={() => signUpWithEmail()} disabled={loading} style={[globalStyles.searchButton, { display: 'flex', flexDirection: 'row' }]}>
          <View style={{ marginRight: 10 }}>
            <Icon name="user-plus" size={20} color={colors.white} />
          </View>
          <Text style={{ color: colors.white, fontSize: 18 }}>Sign Up</Text>
        </TouchableOpacity>
      </View>

      {/* </KeyboardAvoidingView> */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingVertical: 20,
    paddingHorizontal: 12,
    backgroundColor: colors.white,
  },
  inputContainer: {
    marginBottom: 10,
  },
  buttonContainer: {
    marginBottom: 10,
  },
  input: {
    color: colors.oliveGreen,
  },
  button: {
    backgroundColor: "#4e18a6",
    borderRadius: 10,
  },
  imageContainer: {
    marginBottom: 20,
    marginLeft: 'auto',
    marginRight: 'auto',
    display: 'flex',
    alignContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 150,
    height: 150,
    alignSelf: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: colors.oliveGreen,
    fontFamily: "Poppins-Bold",
  },
  subtitle: {
    fontSize: 24,
    color: colors.oliveGreen,
    fontFamily: "Poppins-Regular",
  },

});
