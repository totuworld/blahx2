import { firestore } from 'firebase-admin';

export interface InMessage {
  id: string;
  messageNo: number;
  message: string;
  /** 메시지를 작성한 사람의 정보 */
  author?: {
    displayName: string;
    photoURL?: string;
  };
  reply?: string;
  createAt: string;
  updateAt?: string;
  /** 비공개 처리 여부 */
  deny?: boolean;
}

export interface InMessageServer {
  id: string;
  messageNo: number;
  message: string;
  /** 메시지를 작성한 사람의 정보 */
  author?: {
    displayName: string;
    photoURL?: string;
  };
  /** 비공개 처리 여부 */
  deny?: boolean;
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
