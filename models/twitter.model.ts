import OAuth from 'oauth';
import { promisify } from 'util';

const TWITTER_CONSUMER_KEY = process.env.TWITTER_CONSUMER_KEY ?? '';
const TWITTER_CONSUMER_SECRET = process.env.TWITTER_CONSUMER_SECRET ?? '';

async function getUserInfo({ accessToken, secret, uid }: { accessToken: string; secret: string; uid: string }) {
  const oauth = new OAuth.OAuth(
    'https://api.twitter.com/oauth/request_token',
    'https://api.twitter.com/oauth/access_token',
    TWITTER_CONSUMER_KEY,
    TWITTER_CONSUMER_SECRET,
    '1.0A',
    null,
    'HMAC-SHA1',
  );
  const get = promisify(oauth.get.bind(oauth));
  try {
    const url = `https://api.twitter.com/2/users/${uid}`;
    const result = await get(url, accessToken, secret);
    if (typeof result === 'string') {
      const convertData = JSON.parse(result) as { data: { id: string; name: string; username: string } };
      return convertData.data;
    }
    return null;
  } catch (err) {
    console.error(err);
    return null;
  }
}

const TwitterModel = {
  getUserInfo,
};

export default TwitterModel;
