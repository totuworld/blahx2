import BadReqError from './custom_error/bad_req_error';

/** token이 undefined인지 확인. http status 400 */
export default function checkEmptyToken(token?: string) {
  if (token === undefined) {
    throw new BadReqError('authorization 토큰 누락');
  }
  return token;
}
