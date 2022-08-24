import z from "zod";

export const InvoiceId = z.string().startsWith("in_").length(27);
export const StripeAccount = z.string().startsWith("acct_");
export const EthAddress = z.string().startsWith("0x").length(42);
export const EthHash = z.string().startsWith("0x").length(66);
