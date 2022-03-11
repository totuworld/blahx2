import { firestore } from 'firebase-admin';

export interface InInstantEventMessageBase {
  id: string;
  message: string;
  vote: number;
  voter?: string[];
  deny?: boolean;
  reply: InInstantEventMessageReply[];
}

export interface InInstantEventMessage extends InInstantEventMessageBase {
  voted: boolean;
  createAt: string;
  updateAt?: string;
}

export interface InInstantEventMessageServer extends InInstantEventMessageBase {
  createAt: firestore.Timestamp;
  updateAt?: firestore.Timestamp;
}

export interface InInstantEventMessageReply {
  reply: string;
  createAt: string;
  author?: {
    displayName: string;
    photoURL?: string;
  };
}
