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
}): Promise<Resp<unknown>> {
  const url = '/api/instant-event.create';
  try {
    const postData = {
      uid,
      title,
      desc,
      startDate,
      endDate,
    };
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

const InstantMessageClientService = {
  create,
};

export default InstantMessageClientService;
