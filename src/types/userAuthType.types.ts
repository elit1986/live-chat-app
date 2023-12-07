import { Timestamp } from 'firebase/firestore';

export type UserAuthType = {
  uid: string;
  displayName?: string | null;
  email?: string | null;
  photoURL?: string;
  createdAt?: Timestamp;
};
