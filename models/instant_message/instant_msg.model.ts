import { firestore } from 'firebase-admin';
import moment from 'moment';
import CustomServerError from '@/controllers/custom_error/custom_server_error';
import FirebaseAdmin from '../firebase_admin';
import { InInstantEvent } from './interface/in_instant_event';
import FieldValue = firestore.FieldValue;
import { InInstantEventMessage, InInstantEventMessageServer } from './interface/in_instant_event_message';

const INSTANT_EVENT = 'instants';
const INSTANT_MESSAGE = 'messages';
const MEMBER_COLLECTION = 'members';

/** instant 이벤트 생성 */
async function create({
  uid,
  title,
  desc,
  startDate,
  endDate,
}: {
  uid: string;
  title: string;
  desc?: string;
  startDate?: string;
  endDate?: string;
}) {
  const memberCollection = FirebaseAdmin.getInstance().Firestore.collection(MEMBER_COLLECTION);
  const memberRef = FirebaseAdmin.getInstance().Firestore.collection(MEMBER_COLLECTION).doc(uid);
  const memberDoc = await memberRef.get();
  // 존재하지 않는 사용자
  if (memberDoc.exists === false) {
    throw new CustomServerError({ statusCode: 400, message: '존재하지 않는 사용자에게 질문을 보내고 있네요 ☠️' });
  }
  const newInstantEventBody: {
    title: string;
    desc?: string;
    startDate?: string;
    endDate?: string;
  } = {
    title,
  };
  if (desc !== undefined) {
    newInstantEventBody.desc = desc;
  }
  if (startDate !== undefined) {
    newInstantEventBody.startDate = startDate;
  }
  if (endDate !== undefined) {
    newInstantEventBody.endDate = endDate;
  }
  const newInstantEventRef = await memberCollection.add(newInstantEventBody);
  return newInstantEventRef.id;
}

/** instant 이벤트 정보를 조회 */
async function get({ uid, instantEventId }: { uid: string; instantEventId: string }) {
  const memberRef = FirebaseAdmin.getInstance().Firestore.collection(MEMBER_COLLECTION).doc(uid);
  const eventRef = FirebaseAdmin.getInstance()
    .Firestore.collection(MEMBER_COLLECTION)
    .doc(uid)
    .collection(INSTANT_EVENT)
    .doc(instantEventId);
  const infoResp: InInstantEvent = await FirebaseAdmin.getInstance().Firestore.runTransaction(async (transaction) => {
    const memberDoc = await transaction.get(memberRef);
    const eventDoc = await transaction.get(eventRef);
    // 존재하지 않는 사용자
    if (memberDoc.exists === false) {
      throw new CustomServerError({ statusCode: 400, message: '존재하지 않는 사용자에게 질문을 보내고 있네요 ☠️' });
    }
    if (eventDoc.exists === false) {
      throw new CustomServerError({ statusCode: 400, message: '존재하지 않는 이벤트에 질문을 보내고 있네요 ☠️' });
    }
    const info = eventDoc.data() as InInstantEvent;
    return {
      ...info,
      instantEventId: eventDoc.id,
    };
  });
  return infoResp;
}
/** instant 이벤트에 질문 등록 */
async function post({ uid, instantEventId, message }: { uid: string; instantEventId: string; message: string }) {
  const memberRef = FirebaseAdmin.getInstance().Firestore.collection(MEMBER_COLLECTION).doc(uid);
  const eventRef = FirebaseAdmin.getInstance()
    .Firestore.collection(MEMBER_COLLECTION)
    .doc(uid)
    .collection(INSTANT_EVENT)
    .doc(instantEventId);
  await FirebaseAdmin.getInstance().Firestore.runTransaction(async (transaction) => {
    const memberDoc = await transaction.get(memberRef);
    const eventDoc = await transaction.get(eventRef);
    // 존재하지 않는 사용자
    if (memberDoc.exists === false) {
      throw new CustomServerError({ statusCode: 400, message: '존재하지 않는 사용자에게 질문을 보내고 있네요 ☠️' });
    }
    if (eventDoc.exists === false) {
      throw new CustomServerError({ statusCode: 400, message: '존재하지 않는 이벤트에 질문을 보내고 있네요 ☠️' });
    }
    // 이벤트 정보 확인
    const eventInfo = eventDoc.data() as InInstantEvent;
    // 이미 폐쇄된 이벤트인가?
    if (eventInfo.closed !== undefined && eventInfo.closed) {
      throw new CustomServerError({ statusCode: 400, message: '종료된 이벤트에 질문을 보내고 있네요 ☠️' });
    }
    // 종료 날짜가 있나?
    if (eventInfo.endDate !== undefined) {
      const isBefore = moment().isBefore(moment(eventInfo.endDate, moment.ISO_8601));
      if (isBefore === false) {
        await transaction.update(eventRef, { closed: true });
        throw new CustomServerError({ statusCode: 400, message: '종료된 이벤트에 질문을 보내고 있네요 ☠️' });
      }
    }
    const newPostRef = eventRef.collection(INSTANT_MESSAGE).doc();
    await transaction.create(newPostRef, { message, replyCount: 0, createAt: FieldValue.serverTimestamp() });
  });
}

async function messageList({ uid, instantEventId }: { uid: string; instantEventId: string }) {
  const memberRef = FirebaseAdmin.getInstance().Firestore.collection(MEMBER_COLLECTION).doc(uid);
  const result = await FirebaseAdmin.getInstance().Firestore.runTransaction(async (transaction) => {
    const memberDoc = await transaction.get(memberRef);
    // 해당 사용자가 존재하지 않는다.
    if (memberDoc.exists === false) {
      throw new CustomServerError({ statusCode: 404, message: '존재하지않는 사용자' });
    }
    const colRef = FirebaseAdmin.getInstance()
      .Firestore.collection(MEMBER_COLLECTION)
      .doc(uid)
      .collection(INSTANT_EVENT)
      .doc(instantEventId)
      .collection(INSTANT_MESSAGE);
    const colDocs = await transaction.get(colRef);
    const data = colDocs.docs.map((mv) => {
      const docData = mv.data() as Omit<InInstantEventMessageServer, 'id'>;
      const returnData = {
        ...docData,
        id: mv.id,
        createAt: docData.createAt.toDate().toISOString(),
        updateAt: docData.updateAt ? docData.updateAt.toDate().toISOString() : undefined,
      } as InInstantEventMessage;
      return returnData;
    });
    return data;
  });
  return result;
}

const InstantMessageModel = {
  create,
  post,
  get,
  messageList,
};

export default InstantMessageModel;
