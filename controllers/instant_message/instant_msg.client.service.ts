import { InInstantEvent } from '@/models/instant_message/interface/in_instant_event';
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

const InstantMessageClientService = {
  create,
  get,
};

export default InstantMessageClientService;
