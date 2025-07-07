import { useEffect, useState } from "react";
import {
  Text,
  Button,
  FlatList,
  View,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useMutation, useQuery } from "@apollo/client";
import { GET_EVENT } from "../graphql/queries";
import { JOIN_EVENT } from "../graphql/mutations";
import { socket } from "../socket";

// Define the shape of an Event for type safety
interface Attendee {
  id: string;
  user: {
    id: string;
    name: string;
  };
}

interface Event {
  id: string;
  name: string;
  location: string;
  startTime: string;
  attendees: Attendee[];
}

export default function EventDetailScreen({ route }) {
  const { eventId } = route.params;
  const [attendees, setAttendees] = useState<Attendee[]>([]);

  const { data, loading, error, refetch } = useQuery<{ event: Event }>(
    GET_EVENT,
    {
      variables: { eventId },
    }
  );
  const [joinEvent] = useMutation(JOIN_EVENT, {
    variables: { eventId },
    onCompleted: () => refetch(),
  });

  const event = data?.event;

  useEffect(() => {
    if (event?.attendees) {
      setAttendees(event.attendees);
    }

    socket.emit("joinEventRoom", eventId);

    const handleEventUpdate = (updatedEvent: { attendees: Attendee[] }) => {
      setAttendees(updatedEvent.attendees);
    };

    socket.on("eventUpdate", handleEventUpdate);

    return () => {
      socket.off("eventUpdate", handleEventUpdate);
    };
  }, [eventId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return <Text>Error: {error.message}</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.eventName}>{event?.name}</Text>
      <Text style={styles.eventText}>{event?.location}</Text>
      <Text style={styles.eventText}>{event?.startTime}</Text>
      <Button title="Join Event" onPress={() => joinEvent()} />

      <Text style={styles.attendeesHeader}>Attendees:</Text>
      <FlatList
        data={attendees}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Text style={styles.attendeeText}>{item.user.name}</Text>
        )}
        ListEmptyComponent={<Text>No attendees yet.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  eventName: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  eventText: {
    fontSize: 14,
    color: "#333",
    marginBottom: 8,
  },
  attendeesHeader: {
    marginTop: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  attendeeText: {
    fontSize: 16,
    paddingVertical: 4,
  },
});
