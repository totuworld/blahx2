import { InMessage } from '@/models/message/in_message';
import { requester, Resp } from '@/utils/requester';

async function post({ uid, message }: { uid: string; message: string }): Promise<Resp<unknown>> {
  const url = '/api/messages.add';
  try {
    const resp = await requester({
      option: {
        url,
        method: 'POST',
        data: { uid, message },
      },
    });
    return resp;
  } catch (err) {
    return {
      status: 500,
    };
  }
}

async function postReplay({
  uid,
  messageId,
  reply,
}: {
  uid: string;
  messageId: string;
  reply: string;
}): Promise<Resp<unknown>> {
  const url = `/api/messages.add.reply/${uid}/${messageId}`;
  try {
    const resp = await requester({
      option: {
        url,
        method: 'POST',
        data: { reply },
      },
    });
    return resp;
  } catch (err) {
    return {
      status: 500,
    };
  }
}

async function get({ uid, messageId }: { uid: string; messageId: string }): Promise<Resp<InMessage>> {
  const url = `/api/messages.info/${uid}/${messageId}`;
  try {
    const resp = await requester<InMessage>({
      option: {
        url,
        method: 'GET',
      },
    });
    return resp;
  } catch (err) {
    return {
      status: 500,
    };
  }
}

const MessageClientService = {
  get,
  post,
  postReplay,
};

export default MessageClientService;
