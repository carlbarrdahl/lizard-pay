import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  name: string;
};

const serverURL = `http://localhost:3000`;

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { address, invoice } = req.body;

  const sdk = require("api")("@alchemy-docs/v1.0#1q84j11l6middf5");
  return sdk
    .createWebhook({
      addresses: [address],
      network: "ETH_GOERLI",
      webhook_type: "ADDRESS_ACTIVITY",
      webhook_url: `${serverURL}/webhooks/alchemy?invoice=${invoice}`,
    })
    .then((r) => res.status(201).json(r));
}
