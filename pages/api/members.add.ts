import { NextApiRequest, NextApiResponse } from 'next';
import MemberCtrl from '@/controllers/member.ctrl';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  const supportMethods = ['POST'];

  try {
    if (supportMethods.indexOf(method!) === -1) {
      // 에러 반환
    }
    await MemberCtrl.add(req, res);
  } catch (error) {
    console.error(error);
  }
}
