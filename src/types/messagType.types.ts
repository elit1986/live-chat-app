import { Timestamp } from 'firebase/firestore';

export interface Message {
  id?: string;
  text?: string;
  photoURL?: string;
  uid?: string;
  createdAt?: Timestamp;
  displayName?: string;
}
