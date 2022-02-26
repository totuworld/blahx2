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

async function postReplay(req: NextApiRequest, res: NextApiResponse) {
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
  list,
  get,
  postReplay,
};

export default MessageCtrl;
