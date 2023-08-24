// pages/api/auth.ts

import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import Cors from "cors";

// Initializing the cors middleware
const cors = Cors({
  methods: ["POST", "OPTIONS"],
  origin: "http://127.0.0.1:5173", // your Vue.js app's origin
  allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept"],
});

// Helper to run middleware
const runMiddleware = (req: NextApiRequest, res: NextApiResponse, fn: any) => {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
};

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: NextApiRequest, res: NextApiResponse) => {
  // Run the cors middleware
  await runMiddleware(req, res, cors);

  if (req.method === "POST") {
    try {
      const MERCHANT_PRIVATE_KEY =
        process.env.NEXT_PUBLIC_CHARGIFY_SIGN_IN_TOKEN;
      if (!MERCHANT_PRIVATE_KEY) {
        throw new Error("MERCHANT_PRIVATE_KEY is not set");
      }

      const customerReference = req.body.customerReference;
      if (!customerReference) {
        res.status(400).json({ error: "customerReference is required" });
        return;
      }

      const token = jwt.sign({}, Buffer.from(MERCHANT_PRIVATE_KEY, "base64"), {
        subject: customerReference,
        algorithm: "HS256",
      });

      res.status(200).json({ token });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
};
