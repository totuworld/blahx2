import FirebaseAuthClient from '@/models/auth/firebase_auth_client';
import { InInstantEvent } from '@/models/instant_message/interface/in_instant_event';
import { InInstantEventMessage } from '@/models/instant_message/interface/in_instant_event_message';
import { getBaseUrl } from '@/utils/get_base_url';
import { requester, Resp } from '@/utils/requester';

async function create({
  uid,
  title,
  desc,
  startDate,
  endDate,
}: {
  uid: string;
  title: string;
  desc?: string;
  startDate?: string;
  endDate?: string;
}): Promise<Resp<{ instantEventId: string }>> {
  const url = '/api/instant-event.create';
  try {
    const postData = {
      uid,
      title,
      desc,
      startDate,
      endDate,
    };
    const resp = await requester<{ instantEventId: string }>({
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

async function get({
  uid,
  instantEventId,
  isServer = false,
}: {
  uid: string;
  instantEventId: string;
  isServer?: boolean;
}): Promise<Resp<InInstantEvent>> {
  const hostAndPort: string = getBaseUrl(isServer);
  const url = `${hostAndPort}/api/instant-event.info/${uid}/${instantEventId}`;
  try {
    const resp = await requester<InInstantEvent>({
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

async function lock({ uid, instantEventId }: { uid: string; instantEventId: string }): Promise<Resp<unknown>> {
  const url = '/api/instant-event.lock';
  try {
    const resp = await requester({
      option: {
        url,
        method: 'PUT',
        data: {
          uid,
          instantEventId,
        },
      },
    });
    return resp;
  } catch (err) {
    return {
      status: 500,
    };
  }
}

async function close({ uid, instantEventId }: { uid: string; instantEventId: string }): Promise<Resp<unknown>> {
  const url = '/api/instant-event.close';
  try {
    const resp = await requester({
      option: {
        url,
        method: 'PUT',
        data: {
          uid,
          instantEventId,
        },
      },
    });
    return resp;
  } catch (err) {
    return {
      status: 500,
    };
  }
}

async function immediateClosSendMessagePeriod({
  uid,
  instantEventId,
}: {
  uid: string;
  instantEventId: string;
}): Promise<Resp<unknown>> {
  const url = '/api/instant-event.close-send-message';
  try {
    const resp = await requester({
      option: {
        url,
        method: 'PUT',
        data: {
          uid,
          instantEventId,
        },
      },
    });
    return resp;
  } catch (err) {
    return {
      status: 500,
    };
  }
}

async function post({
  uid,
  instantEventId,
  message,
}: {
  uid: string;
  instantEventId: string;
  message: string;
}): Promise<Resp<unknown>> {
  const url = '/api/instant-event.messages.add';
  try {
    const resp = await requester({
      option: {
        url,
        method: 'POST',
        data: {
          uid,
          instantEventId,
          message,
        },
      },
    });
    return resp;
  } catch (err) {
    return {
      status: 500,
    };
  }
}

async function postReply({
  uid,
  instantEventId,
  messageId,
  reply,
  author,
}: {
  uid: string;
  instantEventId: string;
  messageId: string;
  reply: string;
  author?: {
    displayName: string;
    photoURL?: string;
  };
}) {
  const url = `/api/instant-event.messages.add.reply/${uid}/${instantEventId}/${messageId}`;
  try {
    const sendData: {
      reply: string;
      author?: {
        displayName: string;
        photoURL?: string;
      };
    } = { reply };
    if (author !== undefined) {
      sendData.author = author;
    }
    const resp = await requester({
      option: {
        url,
        method: 'POST',
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

async function getMessageInfo({
  uid,
  instantEventId,
  messageId,
}: {
  uid: string;
  instantEventId: string;
  messageId: string;
}): Promise<Resp<InInstantEventMessage>> {
  const url = `/api/instant-event.messages.info/${uid}/${instantEventId}/${messageId}`;
  const token = await FirebaseAuthClient.getInstance().Auth.currentUser?.getIdToken();
  try {
    const resp = await requester<InInstantEventMessage>({
      option: {
        url,
        method: 'GET',
        headers: token
          ? {
              authorization: token,
            }
          : {},
      },
    });
    return resp;
  } catch (err) {
    return {
      status: 500,
    };
  }
}

async function denyMessage({
  uid,
  instantEventId,
  messageId,
}: {
  uid: string;
  instantEventId: string;
  messageId: string;
}): Promise<Resp<void>> {
  const url = '/api/instant-event.messages.deny';
  const token = await FirebaseAuthClient.getInstance().Auth.currentUser?.getIdToken();
  try {
    await requester<InInstantEventMessage>({
      option: {
        url,
        method: 'PUT',
        headers: {
          authorization: token ?? '',
        },
        data: { uid, instantEventId, messageId },
      },
    });
    return { status: 200 };
  } catch (err) {
    return {
      status: 500,
    };
  }
}

async function voteMessageInfo({
  uid,
  instantEventId,
  messageId,
  isUpvote = true,
}: {
  uid: string;
  instantEventId: string;
  messageId: string;
  isUpvote?: boolean;
}): Promise<Resp<InInstantEventMessage>> {
  const url = '/api/instant-event.messages.vote';
  const token = await FirebaseAuthClient.getInstance().Auth.currentUser?.getIdToken();
  try {
    const resp = await requester<InInstantEventMessage>({
      option: {
        url,
        method: 'PUT',
        headers: {
          authorization: token ?? '',
        },
        data: { uid, instantEventId, messageId, isUpvote },
      },
    });
    return resp;
  } catch (err) {
    return {
      status: 500,
    };
  }
}

const InstantMessageClientService = {
  create,
  get,
  immediateClosSendMessagePeriod,
  denyMessage,
  lock,
  voteMessageInfo,
  close,
  post,
  postReply,
  getMessageInfo,
};

export default InstantMessageClientService;
