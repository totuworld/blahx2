import { getBaseUrl } from '@/utils/get_base_url';
import { requester, Resp } from '@/utils/requester';
import { InMemberInfo } from './in_member_info';

async function memberAddForClient(args: {
  data: InMemberInfo & { twitterAuth?: { accessToken: string; secret: string; uid: string } };
  token: string;
  accessToken?: { token: string; secret: string };
}): Promise<Resp<string | null>> {
  const url = '/api/users.add';
  try {
    const resp = await requester<string | null>({
      option: {
        url,
        method: 'post',
        data: args.accessToken ? { ...args.data, ...args.accessToken } : args.data,
        headers: { authorization: args.token },
      },
    });
    return resp;
  } catch (err) {
    return {
      status: 500,
    };
  }
}

async function memberFindByScreenNameForClient(args: {
  screenName: string;
  isServer: boolean;
}): Promise<Resp<InMemberInfo | null>> {
  const { isServer } = args;
  const hostAndPort: string = getBaseUrl(isServer);
  const url = `${hostAndPort}/api/users.info/${args.screenName}`;
  console.log(url);
  try {
    const resp = await requester<InMemberInfo | null>({
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

export { memberAddForClient, memberFindByScreenNameForClient };
