// pages/api/auth.ts

import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

const Auth = async (req: NextApiRequest, res: NextApiResponse) => {
  // Handle CORS headers
  console.log("Setting CORS headers...");

  res.setHeader("Access-Control-Allow-Origin", "http://127.0.0.1:5173"); // your Vue.js app's origin
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );

  // Handle OPTIONS method (CORS preflight)
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method === "POST") {
    try {
      const MERCHANT_PRIVATE_KEY =
        process.env.NEXT_PUBLIC_CHARGIFY_SIGN_IN_TOKEN;
      if (!MERCHANT_PRIVATE_KEY) {
        throw new Error("MERCHANT_PRIVATE_KEY is not set");
      }

      // todo: set customerReference to the customer's reference - whatever that is?
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

export default Auth;
