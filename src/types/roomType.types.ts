import { Timestamp } from 'firebase/firestore';

export interface Room {
  id: string;
  name: string;
  createdAt: Timestamp | null;
  creatorName: string;
}
