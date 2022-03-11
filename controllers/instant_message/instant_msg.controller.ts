import { NextApiRequest, NextApiResponse } from 'next';
import validateParamWithData from '../req_validator';
import BadReqError from '../custom_error/bad_req_error';
import { CreateInstantEventReq } from './interface/CreateInstantEventReq';
import JSCCreateInstantEventReq from './JSONSchema/JSCCreateInstantEventReq';
import InstantMessageModel from '@/models/instant_message/instant_msg.model';
import JSCGetInstantEventReq from './JSONSchema/JSCGetInstantEventReq';
import { GetInstantEventReq } from './interface/GetInstantEventReq';
import { PostInstantEventMessageReq } from './interface/PostInstantEventMessageReq';
import JSCPostInstantEventMessageReq from './JSONSchema/JSCPostInstantEventMessageReq';
import JSCInstantEventMessageListReq from './JSONSchema/JSCInstantEventMessageListReq';
import JSCInstantEventMessageInfoReq from './JSONSchema/JSCInstantEventMessageInfoReq';
import JSCPostInstantEventMessageReplyReq from './JSONSchema/JSCPostInstantEventMessageReplyReq';
import JSCFindAllInstantEventReq from './JSONSchema/JSCFindAllInstantEventReq';
import checkEmptyToken from '../check_empty_token';
import verifyFirebaseIdToken from '../verify_firebase_id_token';
import JSCVoteInstantEventMessageReq from './JSONSchema/JSCVoteInstantEventMessageReq';
import JSCDenyInstantEventMessageReq from './JSONSchema/JSCDenyInstantEventMessageReq';
import JSCCloseInstantEventReq from './JSONSchema/JSCCloseInstantEventReq';

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

async function findAllEvent(req: NextApiRequest, res: NextApiResponse) {
  const validateResp = validateParamWithData<{ query: { uid: string } }>(
    {
      query: req.query,
    },
    JSCFindAllInstantEventReq,
  );
  if (validateResp.result === false) {
    throw new BadReqError(validateResp.errorMessage);
  }
  const { uid } = validateResp.data.query;
  const instantEventInfo = await InstantMessageModel.findAllEvent({ uid });
  return res.status(200).json(instantEventInfo);
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

async function lock(req: NextApiRequest, res: NextApiResponse) {
  const validateResp = validateParamWithData<{ body: { uid: string; instantEventId: string } }>(
    {
      body: req.body,
    },
    JSCCloseInstantEventReq,
  );
  if (validateResp.result === false) {
    throw new BadReqError(validateResp.errorMessage);
  }
  const { uid, instantEventId } = validateResp.data.body;
  await InstantMessageModel.lock({ uid, instantEventId });
  return res.status(200).end();
}

async function close(req: NextApiRequest, res: NextApiResponse) {
  const validateResp = validateParamWithData<{ body: { uid: string; instantEventId: string } }>(
    {
      body: req.body,
    },
    JSCCloseInstantEventReq,
  );
  if (validateResp.result === false) {
    throw new BadReqError(validateResp.errorMessage);
  }
  const { uid, instantEventId } = validateResp.data.body;
  await InstantMessageModel.close({ uid, instantEventId });
  return res.status(200).end();
}

async function closeSendMessage(req: NextApiRequest, res: NextApiResponse) {
  const validateResp = validateParamWithData<{ body: { uid: string; instantEventId: string } }>(
    {
      body: req.body,
    },
    JSCCloseInstantEventReq,
  );
  if (validateResp.result === false) {
    throw new BadReqError(validateResp.errorMessage);
  }
  const { uid, instantEventId } = validateResp.data.body;
  await InstantMessageModel.closeSendMessage({ uid, instantEventId });
  return res.status(200).end();
}

async function post(req: NextApiRequest, res: NextApiResponse) {
  const validateResp = validateParamWithData<PostInstantEventMessageReq>(
    {
      body: req.body,
    },
    JSCPostInstantEventMessageReq,
  );
  if (validateResp.result === false) {
    throw new BadReqError(validateResp.errorMessage);
  }
  await InstantMessageModel.post({ ...validateResp.data.body });
  return res.status(201).end();
}

async function messageList(req: NextApiRequest, res: NextApiResponse) {
  const token = req.headers.authorization;
  let senderUid: string | undefined;
  if (token !== undefined) {
    senderUid = await verifyFirebaseIdToken(token);
  }
  const validateResp = validateParamWithData<{
    query: {
      uid: string;
      instantEventId: string;
    };
  }>(
    {
      query: req.query,
    },
    JSCInstantEventMessageListReq,
  );
  if (validateResp.result === false) {
    throw new BadReqError(validateResp.errorMessage);
  }
  const result = await InstantMessageModel.messageList({ ...validateResp.data.query, currentUserUid: senderUid });
  return res.status(200).json(result);
}

async function getMessageInfo(req: NextApiRequest, res: NextApiResponse) {
  const token = req.headers.authorization;
  let senderUid: string | undefined;
  if (token !== undefined) {
    senderUid = await verifyFirebaseIdToken(token);
  }
  const validateResp = validateParamWithData<{
    query: {
      uid: string;
      instantEventId: string;
      messageId: string;
    };
  }>(
    {
      query: req.query,
    },
    JSCInstantEventMessageInfoReq,
  );
  if (validateResp.result === false) {
    throw new BadReqError(validateResp.errorMessage);
  }
  const result = await InstantMessageModel.messageInfo({ ...validateResp.data.query, currentUserUid: senderUid });
  return res.status(200).json(result);
}

async function denyMessage(req: NextApiRequest, res: NextApiResponse) {
  const token = checkEmptyToken(req.headers.authorization);
  const uid = await verifyFirebaseIdToken(token);
  const validateResp = validateParamWithData<{
    body: {
      uid: string;
      instantEventId: string;
      messageId: string;
    };
  }>(
    {
      body: req.body,
    },
    JSCDenyInstantEventMessageReq,
  );
  if (validateResp.result === false) {
    throw new BadReqError(validateResp.errorMessage);
  }
  // 즉석 이벤트를 만든 사람이 아니면 deny 못하게 한다.
  if (uid !== validateResp.data.body.uid) {
    throw new BadReqError('deny할 권한이 없습니다.');
  }
  const result = await InstantMessageModel.denyMessage({ ...validateResp.data.body });
  return res.status(200).json(result);
}

async function voteMessage(req: NextApiRequest, res: NextApiResponse) {
  const token = checkEmptyToken(req.headers.authorization);
  const senderUid = await verifyFirebaseIdToken(token);
  const validateResp = validateParamWithData<{
    body: {
      uid: string;
      instantEventId: string;
      messageId: string;
      isUpvote: boolean;
    };
  }>(
    {
      body: req.body,
    },
    JSCVoteInstantEventMessageReq,
  );
  if (validateResp.result === false) {
    throw new BadReqError(validateResp.errorMessage);
  }
  await InstantMessageModel.voteMessage({ ...validateResp.data.body, voter: senderUid });
  return res.status(200).end();
}

async function postReply(req: NextApiRequest, res: NextApiResponse) {
  const validateResp = validateParamWithData<{
    query: {
      uid: string;
      instantEventId: string;
      messageId: string;
    };
    body: {
      reply: string;
      author?: {
        displayName: string;
        photoURL?: string;
      };
    };
  }>(
    {
      query: req.query,
      body: req.body,
    },
    JSCPostInstantEventMessageReplyReq,
  );
  if (validateResp.result === false) {
    throw new BadReqError(validateResp.errorMessage);
  }
  await InstantMessageModel.postReply({ ...validateResp.data.query, ...validateResp.data.body });
  return res.status(200).end();
}

const InstantMessageCtrl = {
  findAllEvent,
  create,
  get,
  lock,
  close,
  post,
  closeSendMessage,
  messageList,
  getMessageInfo,
  denyMessage,
  voteMessage,
  postReply,
};

export default InstantMessageCtrl;
