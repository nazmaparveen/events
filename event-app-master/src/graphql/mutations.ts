import { gql } from "@apollo/client";

export const JOIN_EVENT = gql`
  mutation JoinEvent($eventId: ID!) {
    joinEvent(eventId: $eventId) {
      id
      name
    }
  }
`;

export const LOGIN = gql`
  mutation Login($email: String!) {
    login(email: $email)
  }
`;
