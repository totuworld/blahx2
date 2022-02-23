import FirebaseAdmin from '@/models/firebase_admin';
import BadReqError from './custom_error/bad_req_error';

/** firebase authorization token이 유효한지 확인하고 고유id(uid) 반환 */
export default async function verifyFirebaseIdToken(token: string) {
  try {
    const id = await FirebaseAdmin.getInstance().Auth.verifyIdToken(token);
    return id.uid;
  } catch (err) {
    console.error(err);
    throw new BadReqError('authorization token에 문제가 있습니다');
  }
}
