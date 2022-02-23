import { NextApiRequest, NextApiResponse } from 'next';
import TwitterModel from '@/models/twitter.model';
import checkEmptyToken from '../check_empty_token';
import BadReqError from '../custom_error/bad_req_error';
import validateParamWithData from '../req_validator';
import verifyFirebaseIdToken from '../verify_firebase_id_token';
import { RegisterUserReq } from './interface/RegisterUserReq';
import JSCRegisterUserReq from './JSONSchema/JSCRegisterUserReq';
import { memberAdd, memberFindByScreenName } from '@/models/member/member.model';
import { FindUserByScreenNameReq } from './interface/FindUserByScreenNameReq';
import JSCFindUserByScreenNameReq from './JSONSchema/JSCFindUserByScreenNameReq';
import CustomServerError from '../custom_error/custom_server_error';

async function registerUser(req: NextApiRequest, res: NextApiResponse) {
  const token = checkEmptyToken(req.headers.authorization);
  const uid = await verifyFirebaseIdToken(token);
  const validateResp = validateParamWithData<RegisterUserReq>(
    {
      body: req.body,
    },
    JSCRegisterUserReq,
  );
  if (validateResp.result === false) {
    throw new BadReqError(validateResp.errorMessage);
  }
  const { displayName, email, photoURL, provider, twitterAuth } = validateResp.data.body;
  let screenName = validateResp.data.body.screenName ?? undefined;
  // 트위터에서 정보를 찾아야하나?
  if (provider === 'twitter' && twitterAuth !== undefined) {
    const twitterUserInfo = await TwitterModel.getUserInfo({ ...twitterAuth });
    if (twitterUserInfo !== null) {
      screenName = twitterUserInfo.username;
    }
  }
  const addInfo = await memberAdd({
    uid,
    displayName,
    email,
    photoURL,
    screenName,
    provider,
  });
  return res.status(200).send(`/${addInfo?.screenName}`);
}

async function findUserByScreenName(req: NextApiRequest, res: NextApiResponse) {
  const validateResp = validateParamWithData<FindUserByScreenNameReq>(
    {
      query: req.query,
    },
    JSCFindUserByScreenNameReq,
  );
  if (validateResp.result === false) {
    throw new BadReqError(validateResp.errorMessage);
  }
  const { screenName } = validateResp.data.query;
  const memberInfo = await memberFindByScreenName(screenName);
  if (memberInfo === null) {
    throw new CustomServerError({ statusCode: 404, message: `${screenName} 사용자를 찾을 수 없습니다.` });
  }
  return res.status(200).json(memberInfo);
}

const UserCtrl = {
  registerUser,
  findUserByScreenName,
};

export default UserCtrl;
