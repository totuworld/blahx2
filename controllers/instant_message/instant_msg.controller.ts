import { NextApiRequest, NextApiResponse } from 'next';
import validateParamWithData from '../req_validator';
import BadReqError from '../custom_error/bad_req_error';
import { CreateInstantEventReq } from './interface/CreateInstantEventReq';
import JSCCreateInstantEventReq from './JSONSchema/JSCCreateInstantEventReq';
import InstantMessageModel from '@/models/instant_message/instant_msg.model';

async function post(req: NextApiRequest, res: NextApiResponse) {
  const validateResp = validateParamWithData<CreateInstantEventReq>(
    {
      body: req.body,
    },
    JSCCreateInstantEventReq,
  );
  if (validateResp.result === false) {
    throw new BadReqError(validateResp.errorMessage);
  }

  const { uid, title, desc, startDate, endDate } = validateResp.data.body;
  await InstantMessageModel.create({ uid, title, desc, startDate, endDate });
  return res.status(201).end();
}

const InstantMessageCtrl = {
  post,
};

export default InstantMessageCtrl;
