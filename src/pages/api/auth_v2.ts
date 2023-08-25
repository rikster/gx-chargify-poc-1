import type { NextApiRequest, NextApiResponse } from "next";
import Cors from "cors";
import jwt from "jsonwebtoken";

// Initializing the cors middleware
// You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
const allowedOrigins = [
  "http://localhost:5173",
  "https://gx-chargify-poc-1-fe-vue.vercel.app",
];

const cors = Cors({
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["POST", "GET", "HEAD"],
  credentials: true,
});

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
function runMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  fn: Function
) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }

      return resolve(result);
    });
  });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const MERCHANT_PRIVATE_KEY = process.env.NEXT_PUBLIC_CHARGIFY_SIGN_IN_TOKEN;
  if (!MERCHANT_PRIVATE_KEY) {
    throw new Error("MERCHANT_PRIVATE_KEY is not set");
  }

  // Run the middleware
  await runMiddleware(req, res, cors);

  // todo: set customerReference to the customer's reference - whatever that is?
  const customerReference = "od_poc1_customer_reference_1"; //req.body.customerReference;
  if (!customerReference) {
    res.status(400).json({ error: "customerReference is required" });
    return;
  }

  const token = jwt.sign({}, Buffer.from(MERCHANT_PRIVATE_KEY, "base64"), {
    subject: customerReference,
    algorithm: "HS256",
  });

  res.status(200).json({ token });
}
