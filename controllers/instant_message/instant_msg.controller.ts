import { NextApiRequest, NextApiResponse } from 'next';
import validateParamWithData from '../req_validator';
import BadReqError from '../custom_error/bad_req_error';
import { CreateInstantEventReq } from './interface/CreateInstantEventReq';
import JSCCreateInstantEventReq from './JSONSchema/JSCCreateInstantEventReq';
import InstantMessageModel from '@/models/instant_message/instant_msg.model';
import JSCGetInstantEventReq from './JSONSchema/JSCGetInstantEventReq';
import { GetInstantEventReq } from './interface/GetInstantEventReq';

async function create(req: NextApiRequest, res: NextApiResponse) {
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
  const id = await InstantMessageModel.create({ uid, title, desc, startDate, endDate });
  return res.status(201).json({ instantEventId: id });
}

async function get(req: NextApiRequest, res: NextApiResponse) {
  const validateResp = validateParamWithData<GetInstantEventReq>(
    {
      query: req.query,
    },
    JSCGetInstantEventReq,
  );
  if (validateResp.result === false) {
    throw new BadReqError(validateResp.errorMessage);
  }
  const { uid, instantEventId } = validateResp.data.query;
  const instantEventInfo = await InstantMessageModel.get({ uid, instantEventId });
  return res.status(200).json(instantEventInfo);
}

const InstantMessageCtrl = {
  create,
  get,
};

export default InstantMessageCtrl;
