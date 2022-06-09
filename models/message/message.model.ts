import { firestore } from 'firebase-admin';
import CustomServerError from '@/controllers/custom_error/custom_server_error';
import FirebaseAdmin from '../firebase_admin';
import { InMemberInfo } from '../member/in_member_info';
import { InMessage, InMessageServer } from './in_message';
import FieldValue = firestore.FieldValue;

const MEMBER_COLLECTION = 'members';
const MESSAGE_COLLECTION = 'messages';
const SCREEN_NAME_COLLECTION = 'screen_names';

const { Firestore } = FirebaseAdmin.getInstance();

async function post({
  uid,
  message,
  author,
}: {
  uid: string;
  message: string;
  author?: {
    displayName: string;
    photoURL?: string;
  };
}) {
  const memberRef = FirebaseAdmin.getInstance().Firestore.collection(MEMBER_COLLECTION).doc(uid);
  await FirebaseAdmin.getInstance().Firestore.runTransaction(async (transaction) => {
    const memberDoc = await transaction.get(memberRef);
    // 존재하지 않는 사용자
    if (memberDoc.exists === false) {
      throw new CustomServerError({ statusCode: 400, message: '존재하지 않는 사용자에게 질문을 보내고 있네요 ☠️' });
    }
    let messageCount = 1;
    const memberInfo = memberDoc.data() as InMemberInfo & { messageCount?: number };
    if (memberInfo.messageCount !== undefined) {
      messageCount = memberInfo.messageCount;
    }
    const newMessageRef = memberRef.collection(MESSAGE_COLLECTION).doc();
    const newMessageBody: {
      messageNo: number;
      message: string;
      createAt: firestore.FieldValue;
      author?: {
        displayName: string;
        photoURL?: string;
      };
    } = {
      messageNo: messageCount,
      message,
      createAt: FieldValue.serverTimestamp(),
    };
    if (author !== undefined) {
      newMessageBody.author = author;
    }
    await transaction.set(newMessageRef, newMessageBody);
    await transaction.update(memberRef, { messageCount: messageCount + 1 });
  });
}

async function updateMessage({ uid, messageId, deny }: { uid: string; messageId: string; deny: boolean }) {
  const memberRef = Firestore.collection(MEMBER_COLLECTION).doc(uid);
  const messageRef = Firestore.collection(MEMBER_COLLECTION).doc(uid).collection(MESSAGE_COLLECTION).doc(messageId);
  const result = await Firestore.runTransaction(async (transaction) => {
    const memberDoc = await transaction.get(memberRef);
    const messageDoc = await transaction.get(messageRef);
    if (memberDoc.exists === false) {
      throw new CustomServerError({ statusCode: 400, message: '존재하지않는 사용자' });
    }
    if (messageDoc.exists === false) {
      throw new CustomServerError({ statusCode: 400, message: '존재하지않는 문서' });
    }
    await transaction.update(messageRef, { deny });
    const messageData = messageDoc.data() as InMessageServer;
    return {
      ...messageData,
      id: messageId,
      deny,
      createAt: messageData.createAt.toDate().toISOString(),
      updateAt: messageData.updateAt ? messageData.updateAt.toDate().toISOString() : undefined,
    };
  });
  return result;
}

async function listByUid({ uid, page = 1, size = 10 }: { uid: string; page?: number; size?: number }) {
  const memberRef = FirebaseAdmin.getInstance().Firestore.collection(MEMBER_COLLECTION).doc(uid);
  const result = await FirebaseAdmin.getInstance().Firestore.runTransaction(async (transaction) => {
    const memberDoc = await transaction.get(memberRef);
    // 해당 사용자가 존재하지 않는다.
    if (memberDoc.exists === false) {
      throw new CustomServerError({ statusCode: 404, message: '존재하지않는 사용자' });
    }
    // 전체 갯수를 조회
    const { messageCount = 0 } = memberDoc.data() as { messageCount?: number };
    const totalElements = messageCount !== 0 ? messageCount - 1 : 0;
    const remains = totalElements % size;
    const totalPages = (totalElements - remains) / size + (remains > 0 ? 1 : 0);
    // 전체 갯수에서 page 숫자만큼 숫자를 미뤄서 검색한다.
    const startAt = totalElements - (page - 1) * size;
    if (startAt < 0) {
      return {
        totalElements,
        totalPages: 0,
        page,
        size,
        content: [],
      };
    }
    const colRef = FirebaseAdmin.getInstance()
      .Firestore.collection(MEMBER_COLLECTION)
      .doc(uid)
      .collection(MESSAGE_COLLECTION)
      .orderBy('messageNo', 'desc')
      .startAt(startAt)
      .limit(size);
    const colDocs = await transaction.get(colRef);
    const data = colDocs.docs.map((mv) => {
      const docData = mv.data() as Omit<InMessageServer, 'id'>;
      const isDeny = docData.deny !== undefined && docData.deny === true;
      const returnData = {
        ...docData,
        id: mv.id,
        message: isDeny ? '비공개 처리된 메시지 입니다.' : docData.message,
        createAt: docData.createAt.toDate().toISOString(),
        updateAt: docData.updateAt ? docData.updateAt.toDate().toISOString() : undefined,
      } as InMessage;
      return returnData;
    });
    return {
      totalElements,
      totalPages,
      page,
      size,
      content: data,
    };
  });
  return result;
}

async function listByScreenName({
  screenName,
  page = 1,
  size = 10,
}: {
  screenName: string;
  page?: number;
  size?: number;
}) {
  const memberRef = FirebaseAdmin.getInstance().Firestore.collection(SCREEN_NAME_COLLECTION).doc(screenName);

  const doc = await memberRef.get();

  if (doc.exists === false) {
    return {
      totalElements: 0,
      totalPages: 0,
      page,
      size,
      content: [],
    };
  }
  const mappingData = doc.data() as { id: string };
  const list = listByUid({ uid: mappingData.id, page, size });
  return list;
}

async function get({ uid, messageId }: { uid: string; messageId: string }) {
  const messageRef = FirebaseAdmin.getInstance()
    .Firestore.collection(MEMBER_COLLECTION)
    .doc(uid)
    .collection(MESSAGE_COLLECTION)
    .doc(messageId);
  const messageDoc = await messageRef.get();
  if (messageDoc.exists === false) {
    throw new CustomServerError({ statusCode: 404, message: '메시지를 찾을 수 없습니다' });
  }
  const data = messageDoc.data() as InMessageServer;
  const isDeny = data.deny !== undefined && data.deny === true;
  return {
    ...data,
    id: messageId,
    message: isDeny ? '비공개 처리된 메시지 입니다.' : data.message,
    createAt: data.createAt.toDate().toISOString(),
    updateAt: data.updateAt ? data.updateAt.toDate().toISOString() : undefined,
  };
}

async function postReplay({ uid, messageId, reply }: { uid: string; messageId: string; reply: string }) {
  const memberRef = FirebaseAdmin.getInstance().Firestore.collection(MEMBER_COLLECTION).doc(uid);
  const messageRef = FirebaseAdmin.getInstance()
    .Firestore.collection(MEMBER_COLLECTION)
    .doc(uid)
    .collection(MESSAGE_COLLECTION)
    .doc(messageId);
  await FirebaseAdmin.getInstance().Firestore.runTransaction(async (transaction) => {
    const memberDoc = await transaction.get(memberRef);
    const messageDoc = await transaction.get(messageRef);
    // 존재하지 않는 사용자
    if (memberDoc.exists === false) {
      throw new CustomServerError({ statusCode: 400, message: '존재하지 않는 사용자에게 답변을 보내고 있네요 ☠️' });
    }
    if (messageDoc.exists === false) {
      throw new CustomServerError({ statusCode: 400, message: '존재하지 않는 메시지에 답변을 보내고 있네요 ☠️' });
    }
    const messageData = messageDoc.data() as InMessageServer;
    // 이미 댓글을 작성한 경우
    if (messageData.reply !== undefined) {
      throw new CustomServerError({ statusCode: 400, message: '이미 답변을 등록했습니다 ☠️' });
    }
    await transaction.update(messageRef, { reply, updateAt: FieldValue.serverTimestamp() });
  });
}

const MessageModel = {
  post,
  updateMessage,
  get,
  postReplay,
  listByUid,
  listByScreenName,
};

export default MessageModel;
