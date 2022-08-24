import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { z } from "zod";

import { stripe } from "utils/stripe";
import { EthAddress, InvoiceId, StripeAccount } from "schemas";
import { NextApiRequest } from "next";
import { verifyJwt } from "utils/jwt";
import { supabase } from "utils/supabase";

export const appRouter = trpc
  .router<Context>()
  .query("customer.me", {
    input: z.any(),
    async resolve({ input, ctx }) {
      const { stripe_user_id } = ctx.user || {};
      if (stripe_user_id) {
        const wallet = await supabase
          .from("stripe_wallet")
          .select()
          .eq("stripe", stripe_user_id)
          .then(({ data }) => data && data[0].wallet);

        return {
          account: await stripe.accounts.retrieve(stripe_user_id),
          wallet,
        };
      }
      return null;
    },
  })
  .mutation("customer.wallet", {
    input: z.object({ address: EthAddress }),
    async resolve({ input: { address }, ctx }) {
      const { user } = ctx;
      if (user) {
        return await supabase
          .from("stripe_wallet")
          .upsert({ stripe: user.stripe_user_id, wallet: address });
      }
      return {};
    },
  })
  .query("account.wallet", {
    input: z.object({ account: StripeAccount }),
    async resolve({ input: { account }, ctx }) {
      return await supabase
        .from("stripe_wallet")
        .select()
        .eq("stripe", account)
        .then(({ data }) => data && data[0]);
      return {};
    },
  })
  .query("invoices.list", {
    input: z.any(),
    async resolve({ input, ctx }) {
      if (ctx.user) {
        return stripe.invoices.list({ stripeAccount: ctx.user.stripe_user_id });
      }
      return null;
    },
  })
  .query("invoices.byId", {
    input: z.object({ id: InvoiceId, account: StripeAccount }),
    async resolve({ input }) {
      return stripe.invoices.retrieve(input.id, {
        stripeAccount: input.account,
      });
    },
  })
  .mutation("invoice.pay", {
    input: z.object({ id: InvoiceId }),
    async resolve({ input: { id } }) {
      return stripe.invoices.pay(id, { paid_out_of_band: true });
    },
  });

// export type definition of API
export type AppRouter = typeof appRouter;

const getAccessToken = (req: NextApiRequest) =>
  (req.headers.authorization as string)?.split("Bearer ")[1];

async function createContext(opts: trpcNext.CreateNextContextOptions) {
  const token = getAccessToken(opts.req);
  if (token) {
    const user = verifyJwt(token);

    return { user };
  }
  return {};
}
type Context = trpc.inferAsyncReturnType<typeof createContext>;

// export API handler
export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext,
});
