import { NextApiRequest, NextApiResponse } from 'next';

import OAuth from 'oauth';
import { promisify } from 'util';
import FirebaseAdmin from '@/models/firebase_admin';

const TWITTER_CONSUMER_KEY = process.env.TWITTER_CONSUMER_KEY ?? '';
const TWITTER_CONSUMER_SECRET = process.env.TWITTER_CONSUMER_SECRET ?? '';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
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
    const { token, secret, uid } = req.body;
    console.info({ token, secret, uid });
    const url = `https://api.twitter.com/2/users/${req.body.uid}`;
    console.info(url);
    const result = await get(url, req.body.token, req.body.secret);
    console.info(result);
    console.log(typeof result === 'string');
    if (typeof result === 'string') {
      await FirebaseAdmin.getInstance().Firestore.collection('test').add(JSON.parse(result));
    }
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).end();
  }
}
