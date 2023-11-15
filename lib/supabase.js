import "react-native-url-polyfill/auto";
import * as SecureStore from "expo-secure-store";
import { createClient } from "@supabase/supabase-js";

const ExpoSecureStoreAdapter = {
  getItem: function (key) {
    return SecureStore.getItemAsync(key);
  },
  setItem: function (key, value) {
    return SecureStore.setItemAsync(key, value);
  },
  removeItem: function (key) {
    return SecureStore.deleteItemAsync(key);
  },
};

const supabaseUrl = "https://kwyezimolkwsbblpvdgz.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt3eWV6aW1vbGt3c2JibHB2ZGd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODk1Njc1MjQsImV4cCI6MjAwNTE0MzUyNH0.8ca5kXW4qrDkjC_8mLFy36eRgyZcqozI-pVx3W4GUpE";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: ExpoSecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
