import { InMessage } from '@/models/message/in_message';
import { getBaseUrl } from '@/utils/get_base_url';
import { requester, Resp } from '@/utils/requester';

async function post({
  uid,
  message,
  author,
}: {
  uid: string;
  message: string;
  author?: {
    displayName: string;
    photoURL?: string;
  };
}): Promise<Resp<unknown>> {
  const url = '/api/messages.add';
  try {
    const postData: {
      uid: string;
      message: string;
      author?: {
        displayName: string;
        photoURL?: string;
      };
    } = { uid, message };
    if (author !== undefined) {
      postData.author = author;
    }
    const resp = await requester({
      option: {
        url,
        method: 'POST',
        data: postData,
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
  replayAuthor,
  token,
}: {
  uid: string;
  messageId: string;
  reply: string;
  replayAuthor?: {
    displayName: string;
    photoURL?: string;
  };
  token: string;
}): Promise<Resp<unknown>> {
  const url = `/api/messages.add.reply/${uid}/${messageId}`;
  try {
    const sendData: {
      reply: string;
      author?: {
        displayName: string;
        photoURL?: string;
      };
    } = { reply };
    if (replayAuthor !== undefined) {
      sendData.author = replayAuthor;
    }
    const resp = await requester({
      option: {
        url,
        method: 'POST',
        headers: {
          authorization: token,
        },
        data: sendData,
      },
    });
    return resp;
  } catch (err) {
    return {
      status: 500,
    };
  }
}

async function get({
  uid,
  messageId,
  isServer = false,
}: {
  isServer?: boolean;
  uid: string;
  messageId: string;
}): Promise<Resp<InMessage>> {
  const hostAndPort: string = getBaseUrl(isServer);
  const url = `${hostAndPort}/api/messages.info/${uid}/${messageId}`;
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
