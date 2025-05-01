// pages/api/check-cookie.ts
import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    console.log('hello')
  const accessToken = req.cookies.accessToken;
  res.status(200).json({ accessToken: !!accessToken });
}