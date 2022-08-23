import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { z } from "zod";

import { stripe } from "utils/stripe";
import { InvoiceId } from "schemas";

export const appRouter = trpc
  .router()

  .query("invoices.list", {
    input: z.any(),
    async resolve({ input }) {
      return stripe.invoices.list();
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

// export API handler
export default trpcNext.createNextApiHandler({ router: appRouter });
