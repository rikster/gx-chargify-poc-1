// pages/api/hello.ts

import { NextApiRequest, NextApiResponse } from "next";

const Hello = (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    res.status(200).json({ message: "Hello from Next.js with TypeScript!" });
  } else {
    res.status(405).end(); // Method Not Allowed
  }
};

export default Hello;
