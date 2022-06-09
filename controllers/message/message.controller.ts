import { NextApiRequest, NextApiResponse } from 'next';
import MessageModel from '@/models/message/message.model';
import BadReqError from '../custom_error/bad_req_error';
import validateParamWithData from '../req_validator';
import { PostMessageReq } from './interface/PostMessageReq';
import JSCPostMessageReq from './JSONSchema/JSCPostMessageReq';
import JSCListMessageReq from './JSONSchema/JSCListMessageReq';
import { ListMessageReq } from './interface/ListMessageReq';
import JSCGetMessageReq from './JSONSchema/JSCGetMessageReq';
import { PostReplyMessageReq } from './interface/PostReplyMessageReq';
import JSCPostReplyMessageReq from './JSONSchema/JSCPostReplyMessageReq';
import CustomServerError from '../custom_error/custom_server_error';
import { DenyMessageReq } from './interface/DenyMessageReq';
import JSCDenyMessageReq from './JSONSchema/JSCDenyMessageReq';
import verifyFirebaseIdToken from '@/utils/verify_firebase_id_token';

async function post(req: NextApiRequest, res: NextApiResponse) {
  const validateResp = validateParamWithData<PostMessageReq>(
    {
      body: req.body,
    },
    JSCPostMessageReq,
  );
  if (validateResp.result === false) {
    throw new BadReqError(validateResp.errorMessage);
  }

  const { uid, message, author } = validateResp.data.body;
  await MessageModel.post({ uid, message, author });
  return res.status(201).end();
}

async function updateMessage(req: NextApiRequest, res: NextApiResponse) {
  const token = req.headers.authorization;
  if (token === undefined) {
    throw new CustomServerError({ statusCode: 401, message: '권한이 없습니다' });
  }
  const tokenUid = await verifyFirebaseIdToken(token);
  const validateResp = validateParamWithData<DenyMessageReq>(
    {
      body: req.body,
    },
    JSCDenyMessageReq,
  );
  if (validateResp.result === false) {
    throw new BadReqError(validateResp.errorMessage);
  }
  const { uid, messageId, deny } = validateResp.data.body;
  if (uid !== tokenUid) {
    throw new CustomServerError({ statusCode: 401, message: '수정 권한이 없습니다' });
  }
  const result = await MessageModel.updateMessage({ uid, messageId, deny });
  return res.status(200).json(result);
}

async function postReplay(req: NextApiRequest, res: NextApiResponse) {
  const token = req.headers.authorization;
  if (token === undefined) {
    throw new CustomServerError({ statusCode: 401, message: '권한이 없습니다' });
  }
  const tokenUid = await verifyFirebaseIdToken(token);
  const validateResp = validateParamWithData<PostReplyMessageReq>(
    {
      query: req.query,
      body: req.body,
    },
    JSCPostReplyMessageReq,
  );
  if (validateResp.result === false) {
    throw new BadReqError(validateResp.errorMessage);
  }

  const { uid, messageId } = validateResp.data.query;
  if (uid !== tokenUid) {
    throw new CustomServerError({ statusCode: 401, message: '수정 권한이 없습니다' });
  }
  const { reply } = validateResp.data.body;
  await MessageModel.postReplay({ uid, messageId, reply });
  return res.status(200).end();
}

async function get(req: NextApiRequest, res: NextApiResponse) {
  const validateResp = validateParamWithData<{
    query: {
      uid: string;
      messageId: string;
    };
  }>(
    {
      query: req.query,
    },
    JSCGetMessageReq,
  );
  if (validateResp.result === false) {
    throw new BadReqError(validateResp.errorMessage);
  }
  const info = await MessageModel.get({ ...validateResp.data.query });
  return res.status(200).json(info);
}

async function list(req: NextApiRequest, res: NextApiResponse) {
  const validateResp = validateParamWithData<ListMessageReq>(
    {
      query: req.query,
    },
    JSCListMessageReq,
  );
  if (validateResp.result === false) {
    throw new BadReqError(validateResp.errorMessage);
  }
  const { screenName, uid, page, size } = validateResp.data.query;
  if (screenName !== undefined) {
    const listResp = await MessageModel.listByScreenName({ screenName, page, size });
    return res.status(200).json(listResp);
  }
  if (uid !== undefined) {
    const listResp = await MessageModel.listByUid({ uid, page, size });
    return res.status(200).json(listResp);
  }
}

const MessageCtrl = {
  post,
  updateMessage,
  list,
  get,
  postReplay,
};

export default MessageCtrl;
