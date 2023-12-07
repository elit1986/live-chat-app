import { UserAuthType } from '../types/userAuthType.types';
import { Message } from '../types/messagType.types';
import { Room } from '../types/roomType.types';
import { db } from '../utils/firebase.config';
import {
  collection,
  doc,
  addDoc,
  getDocs,
  getDoc,
  query,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';

export const createRoom = async (roomName: string, user: UserAuthType) => {
  await addDoc(collection(db, 'rooms'), {
    name: roomName,
    createdAt: serverTimestamp(),
    creatorId: user.uid,
    creatorName: user.displayName || user.email,
  });
};

export const getRooms = (
  setRooms: React.Dispatch<React.SetStateAction<Room[]>>
) => {
  const roomsQuery = query(
    collection(db, 'rooms'),
    orderBy('createdAt', 'desc')
  );
  onSnapshot(roomsQuery, (snapshot) => {
    const roomsData = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Room[];
    setRooms(roomsData);
  });
};

export const getRoomById = (
  roomId: string,
  setRoomName: React.Dispatch<React.SetStateAction<string>>
) => {
  const roomRef = doc(db, 'rooms', roomId);

  onSnapshot(roomRef, (doc) => {
    if (doc.exists()) {
      setRoomName(doc.data().name);
    } else {
      setRoomName('Unknown Room');
    }
  });
};

export const sendMessage = async (
  roomId: string,
  uid: string,
  photoURL: string,
  messageText: string
) => {
  if (!roomId) return;

  const userRef = doc(db, 'users', uid);
  const userSnap = await getDoc(userRef);
  let displayName = '';
  if (userSnap.exists()) {
    displayName = userSnap.data().displayName || 'Anonymous';
  }

  const roomMessagesRef = collection(db, 'rooms', roomId, 'messages');
  await addDoc(roomMessagesRef, {
    text: messageText,
    photoURL,
    uid,
    displayName,
    createdAt: serverTimestamp(),
  });
};

export const getMessages = (
  roomId: string,
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
) => {
  if (!roomId) return;

  const roomMessagesRef = collection(db, 'rooms', roomId, 'messages');
  const messagesQuery = query(roomMessagesRef, orderBy('createdAt'), limit(50));

  onSnapshot(messagesQuery, (snapshot) => {
    const messagesData = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setMessages(messagesData);
  });
};

export const getUsers = async (): Promise<UserAuthType[]> => {
  const usersCollectionRef = collection(db, 'users');
  const snapshot = await getDocs(usersCollectionRef);
  const users = snapshot.docs.map((doc) => doc.data() as UserAuthType);
  return users;
};
