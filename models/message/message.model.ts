import CustomServerError from '@/controllers/custom_error/custom_server_error';
import FirebaseAdmin from '../firebase_admin';
import { InMemberInfo } from '../member/in_member_info';

const MEMBER_COLLECTION = 'members';
const MESSAGE_COLLECTION = 'messages';

async function post({ uid, message }: { uid: string; message: string }) {
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
    await transaction.set(newMessageRef, {
      messageNo: messageCount,
      message,
    });
    await transaction.update(memberRef, { messageCount: messageCount + 1 });
  });
}

const MessageModel = {
  post,
};

export default MessageModel;
