import type { GetServerSideProps, NextPage } from "next";
import NextError from "next/error";
import {
  Button,
  Heading,
  HStack,
  Badge,
  Alert,
  AlertDescription,
  AlertTitle,
  AlertIcon,
  Text,
} from "@chakra-ui/react";

import { getAddress } from "utils/getAddress";

import { Invoice } from "features/invoice/types";
import InvoiceDetails from "features/invoice/components/InvoiceDetails";
import PayInvoice from "features/invoice/components/PayInvoice";
import PayLayout from "features/invoice/layouts/PayLayout";
import { useAccount, useNetwork } from "wagmi";
import NoSSR from "components/NoSSR";
import SwitchNetwork from "components/SwitchNetwork";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const emptyInvoice = {} as Invoice;
const PayInvoicePage: NextPage<{ invoice: Invoice; error: Error }> = ({
  invoice = emptyInvoice,
  error,
}) => {
  const account = useAccount();

  const address = getAddress(invoice.footer);
  const { chain } = useNetwork();
  const isTest = true || chain?.id !== 1;
  const isCorrectChain =
    (invoice?.livemode && chain?.id === 1) ||
    (!invoice?.livemode && chain?.id === 5);

  if (error) {
    return (
      <NextError title={error?.message} statusCode={error?.statusCode ?? 500} />
    );
  }

  console.log("correctChain", isCorrectChain, invoice?.livemode, chain?.id);
  return (
    <PayLayout>
      <HStack mb={8}>
        <Heading size="md" color="gray.700">
          {invoice.account_name}
        </Heading>
        {!invoice.livemode ? (
          <Badge fontWeight={"bold"} colorScheme={"orange"}>
            TEST
          </Badge>
        ) : (
          <div />
        )}
      </HStack>
      <InvoiceDetails invoice={invoice} />
      <NoSSR>
        {!account.address ? (
          <Alert
            status="info"
            variant="subtle"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
            mb={4}
          >
            <AlertIcon />
            <AlertTitle mt={4} mb={1} fontSize="lg">
              Connect Wallet
            </AlertTitle>
            <AlertDescription>
              <Text mb={4}>A wallet must be connected to pay with crypto.</Text>
              <ConnectButton.Custom>
                {({ openConnectModal }) => (
                  <Button
                    w="100%"
                    colorScheme={"blue"}
                    onClick={openConnectModal}
                  >
                    Connect Wallet
                  </Button>
                )}
              </ConnectButton.Custom>
            </AlertDescription>
          </Alert>
        ) : invoice.paid ? (
          <Alert
            status="info"
            variant="subtle"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
            mb={4}
          >
            <AlertIcon />
            <AlertTitle mt={4} mb={1} fontSize="lg">
              Invoice paid
            </AlertTitle>
            <AlertDescription>
              <Text mb={4}>This invoice has already been marked as paid.</Text>
            </AlertDescription>
          </Alert>
        ) : isCorrectChain ? (
          <PayInvoice address={address} amount={invoice.total / 100} />
        ) : (
          <SwitchNetwork />
        )}
      </NoSSR>

      {!invoice.paid ? (
        <Button
          w="100%"
          as="a"
          href={invoice.hosted_invoice_url}
          target="_blank"
        >
          Pay with Stripe
        </Button>
      ) : null}
    </PayLayout>
  );
};
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { stripe } = await import("utils/stripe");
  return stripe.invoices
    .retrieve(ctx.query.id as string)
    .then((invoice) => ({ props: { invoice } }))
    .catch((err) => {
      const { message, statusCode = 500 } = err;
      return {
        props: { error: { message, statusCode } },
      };
    });
};

export default PayInvoicePage;
