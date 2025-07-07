import React, { useState } from "react";
import { TextInput, Button, Text, View, ActivityIndicator } from "react-native";
import { useMutation } from "@apollo/client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../store/useAuth";
import { useNavigation } from "@react-navigation/native";
import { LOGIN } from "../graphql/mutations";

import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";

type LoginScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Login"
>;

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const { login } = useAuth();
  const navigation = useNavigation<LoginScreenNavigationProp>();

  const [doLogin, { loading, error }] = useMutation(LOGIN, {
    onCompleted: async (data) => {
      const token = data.login; // Extract token from response
      if (token) {
        await AsyncStorage.setItem("token", token); // Store token
        login(email); // Update auth with email
        navigation.navigate("Events"); // Navigate on success
      }
    },
    onError: (error) => {
      console.log("Login error:", error.message); // Log error for debugging
    },
  });

  const handleLogin = () => {
    doLogin({ variables: { email } }); // Trigger mutation with email
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 10 }}>Login</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Enter your email"
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 10,
          marginBottom: 10,
          borderRadius: 6,
        }}
        autoCapitalize="none"
      />
      {error && <Text style={{ color: "red" }}>{error.message}</Text>}
      <Button title="Login" onPress={handleLogin} disabled={loading} />
      {loading && <ActivityIndicator style={{ marginTop: 10 }} />}
    </View>
  );
}
