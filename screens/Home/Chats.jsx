import { collection, onSnapshot, query, where } from "firebase/firestore";
import React, { useContext, useState, useEffect } from "react";
import { View,Text } from "react-native";
import { auth, db } from "../../firebase";
import Context from "../../context/Context";
import ContactsFloatingIcon from "../../components/ContactsFloatingIcon";

export default () => {
  const { currentUser } = auth;
  const { rooms, setRooms } = useContext(Context);
  const chatsQuery = query(
    collection(db, "rooms"),
    where("participantsArray", "array-contains", currentUser.email)
  );

  useEffect(() => {
    const unsubscribe = () =>
      onSnapshot(chatsQuery, (querySnapshot) => {
        const parsedChats = querySnapshot.docs
          .filter((doc) => doc.data().lastMessage)
          .map((doc) => ({
            ...doc.data(),
            id: doc.id,
            userB: doc
              .data()
              .participants.find((p) => p.email !== currentUser.email),
          }));
        setRooms(parsedChats);
      });
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <View style={{ flex: 1, padding: 5, paddingRight: 10 }}>
      <Text>Chats</Text>
      <ContactsFloatingIcon />
    </View>
  );
};
