import { useMutation, useQuery } from "@apollo/client";
import {
  FlatList,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { GET_EVENTS } from "../graphql/queries";
import { JOIN_EVENT } from "../graphql/mutations";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
import { useState } from "react";

type EventListScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Events"
>;

// Define the shape of an Event for type safety
interface Event {
  id: string;
  name: string;
  location: string;
  startTime: string;
}

export default function EventListScreen() {
  const { data, loading } = useQuery<{ events: Event[] }>(GET_EVENTS);
  const [joinEvent] = useMutation(JOIN_EVENT);
  const navigation = useNavigation<EventListScreenNavigationProp>();
  const [loadingEventIds, setLoadingEventIds] = useState<Set<string>>(
    new Set()
  );

  // Handle joining an event
  const handleJoinEvent = async (eventId: string) => {
    setLoadingEventIds((prev) => new Set(prev).add(eventId)); // Start loading for this event
    try {
      await joinEvent({
        variables: { eventId },
        refetchQueries: [{ query: GET_EVENTS }],
      });
      Alert.alert("Success", "You have joined the event!");
    } catch (error: any) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      const dynamicErrorMessage = ` ${errorMessage}`;
      Alert.alert("Error", dynamicErrorMessage);
      console.error("Join event error:", error);
    } finally {
      setLoadingEventIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(eventId); // Stop loading for this event
        return newSet;
      });
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return data?.events?.length ? (
    <FlatList
      data={data.events}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={styles.eventContainer}>
          <TouchableOpacity
            style={styles.eventDetails}
            onPress={() =>
              navigation.navigate("EventDetail", { eventId: item.id })
            }
          >
            <Text style={styles.eventName}>{item.name}</Text>
            <Text style={styles.eventText}>{item.location}</Text>
            <Text style={styles.eventText}>{item.startTime}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.joinButton,
              loadingEventIds.has(item.id) && styles.disabledButton,
            ]}
            onPress={() => handleJoinEvent(item.id)}
            disabled={loadingEventIds.has(item.id)}
          >
            <Text style={styles.joinButtonText}>
              {loadingEventIds.has(item.id) ? "Joining..." : "Join Event"}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    />
  ) : (
    <View style={styles.emptyContainer}>
      <Text>No events available.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  eventContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  eventDetails: {
    flex: 1,
  },
  eventName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  eventText: {
    fontSize: 14,
    color: "#333",
  },
  joinButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  joinButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  disabledButton: {
    backgroundColor: "#aaa",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
