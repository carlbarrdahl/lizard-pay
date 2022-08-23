import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { z } from "zod";

import { createWebhook, deleteWebhook, getTransactions } from "utils/alchemy";
import { stripe } from "utils/stripe";

const serverURL = `https://9276-2a00-801-235-4f1a-5213-6e2f-a945-c644.ngrok.io`;
// const serverURL = `http://localhost:3000`;
// https://59dd-78-77-199-130.ngrok.io/api/trpc/webhook.addressActivity?invoice=asd

// https://ae59-2a00-801-235-4f1a-54a0-c9c-5abf-1187.ngrok.io
const InvoiceId = z.string().startsWith("in_").length(27);
const EthAddress = z.string().startsWith("0x").length(42);
const EthHash = z.string().startsWith("0x").length(66);
export const appRouter = trpc
  .router<Context>()
  .query("tx.list", {
    input: z.object({
      address: EthAddress,
      network: z.number(),
    }),
    async resolve({ input: { address, network } }) {
      return getTransactions(
        {
          fromBlock: "0x0",
          toBlock: "latest",
          category: ["erc20"],
          withMetadata: true,
          excludeZeroValue: false,
          order: "desc",
          maxCount: "0x3e8",
          toAddress: address,
        },
        { network }
      ).then((r) => r.result.transfers || []);
    },
  })
  .query("invoices.list", {
    input: z.any(),
    async resolve({ input }) {
      return stripe.invoices.list();
    },
  })
  .mutation("invoice.pay", {
    input: z.object({ id: InvoiceId, hash: EthHash }),
    async resolve({ input: { id, hash } }) {
      return stripe.invoices.pay(id, {
        paid_out_of_band: true,
        payment_method: hash,
      });
    },
  })
  .mutation("webhook.create", {
    input: z.object({
      id: InvoiceId,
      address: EthAddress,
      network: z.number(),
    }),
    resolve({ input: { id, address, network } }) {
      const networks = { 1: "ETH", 5: "ETH_GOERLI" };
      return createWebhook({
        addresses: [address],
        network: networks[network as 1 | 5],
        webhook_type: "ADDRESS_ACTIVITY",
        webhook_url: `${serverURL}/api/trpc/webhook.addressActivity?invoice=${id}`,
      }).catch((err) => {
        console.log(err);
        return err;
      });
    },
  })
  .mutation("webhook.delete", {
    input: z.object({ id: z.string() }),
    async resolve({ input }) {
      deleteWebhook(input.id);
    },
  })
  .mutation("webhook.addressActivity", {
    input: z.object({
      webhookId: z.string(),
      id: z.string(),
      createdAt: z.string(),
      type: z.string(),
      event: z.any(),
    }),
    async resolve({ input, ctx }) {
      console.log(input);
      const { webhookId } = input;
      const invoiceId = ctx.url?.split("?invoice=")[1];

      console.log(z.string().startsWith("in_").length(27).safeParse(invoiceId));
      // "in_1LYpKYCdAxqeKAjis9rxWzur"
      deleteWebhook(webhookId);
      try {
        // const source = input.event.
        // stripe.invoices.pay(invoiceId,  { paid_out_of_band: true, source: })
      } catch (error) {}
      console.log({ invoiceId });
    },
  });

// export type definition of API
export type AppRouter = typeof appRouter;
const createContext = (opts: trpcNext.CreateNextContextOptions) => {
  return { url: opts.req.url };
};
type Context = trpc.inferAsyncReturnType<typeof createContext>;

// export API handler
export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext,
});
