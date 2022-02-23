// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from 'next';

import handleError from '@/controllers/handle_error';
import checkSupportMethod from '@/controllers/check_support_method';
import MessageCtrl from '@/controllers/message/message.controller';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  const supportMethod = ['POST'];
  try {
    checkSupportMethod(supportMethod, method);
    await MessageCtrl.post(req, res);
  } catch (err) {
    console.error(err);
    handleError(err, res);
  }
}
