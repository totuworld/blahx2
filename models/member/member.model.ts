import OKError from '@/controllers/custom_error/ok_error';
import { get8RandomText } from '@/utils/random_text';
import FirebaseAdmin from '../firebase_admin';
import { InMemberInfo } from './in_member_info';

const MEMBER_COLLECTION = 'members';
const SCREEN_NAME_COLLECTION = 'screen_names';

async function memberAdd(args: InMemberInfo): Promise<InMemberInfo | null> {
  const altScreenName = `${args.screenName}${get8RandomText()}`;
  const screenNameDocRef = FirebaseAdmin.getInstance()
    .Firestore.collection(SCREEN_NAME_COLLECTION)
    .doc(args.screenName);
  const altScreenNameDocRef = FirebaseAdmin.getInstance()
    .Firestore.collection(SCREEN_NAME_COLLECTION)
    .doc(altScreenName);
  const memberRef = FirebaseAdmin.getInstance().Firestore.collection(MEMBER_COLLECTION).doc(args.uid);

  const addMemberInfo = await FirebaseAdmin.getInstance().Firestore.runTransaction(async (transaction) => {
    const memberDoc = await transaction.get(memberRef);
    const screenNameDoc = await transaction.get(screenNameDocRef);
    const altScreenNameDoc = await transaction.get(altScreenNameDocRef);
    const usedScreenName = screenNameDoc.exists === true;
    // 이미 등록된 사용자 id
    if (memberDoc.exists === true) {
      throw new OKError(`/${args.screenName}`);
    }
    // 사용중이지 않은 screenName
    if (usedScreenName === false) {
      transaction.create(screenNameDocRef, { id: args.uid });
    }
    // 임의로 만든 screenName으로 저장
    if (usedScreenName && altScreenNameDoc.exists === false) {
      transaction.create(altScreenNameDocRef, { id: args.uid });
    }

    const createData: InMemberInfo & { id: string } = {
      ...args,
      screenName: usedScreenName ? altScreenName : args.screenName,
      email: args.email ?? '',
      id: args.uid,
    };

    transaction.create(memberRef, createData);
    return createData;
  });

  return addMemberInfo;
}

async function memberFind(id: string): Promise<InMemberInfo | null> {
  const memberRef = FirebaseAdmin.getInstance().Firestore.collection(MEMBER_COLLECTION).doc(id);

  const doc = await memberRef.get();

  if (doc.exists === false) {
    return null;
  }
  return doc.data() as InMemberInfo;
}

async function memberFindByScreenName(screenName: string): Promise<InMemberInfo | null> {
  const memberRef = FirebaseAdmin.getInstance().Firestore.collection(SCREEN_NAME_COLLECTION).doc(screenName);

  const doc = await memberRef.get();

  if (doc.exists === false) {
    return null;
  }
  const mappingData = doc.data() as { id: string };
  const memberInfo = await memberFind(mappingData.id);
  return memberInfo;
}

export { memberAdd, memberFind, memberFindByScreenName };
