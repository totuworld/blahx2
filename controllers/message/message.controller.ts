import { NextApiRequest, NextApiResponse } from 'next';
import MessageModel from '@/models/message/message.model';
import BadReqError from '../custom_error/bad_req_error';
import validateParamWithData from '../req_validator';
import { PostMessageReq } from './interface/PostMessageReq';
import JSCPostMessageReq from './JSONSchema/JSCPostMessageReq';

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

  const { uid, message } = validateResp.data.body;
  await MessageModel.post({ uid, message });
  return res.status(201).end();
}

const MessageCtrl = {
  post,
};

export default MessageCtrl;
