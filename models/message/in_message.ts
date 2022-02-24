import { firestore } from 'firebase-admin';

export interface InMessage {
  id: string;
  messageNo: number;
  message: string;
  reply?: string;
  createAt: string;
  updateAt?: string;
}

export interface InMessageServer {
  id: string;
  messageNo: number;
  message: string;
  reply?: string;
  createAt: firestore.Timestamp;
  updateAt?: firestore.Timestamp;
}

export interface InMessageList {
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
  content: InMessage[];
}
