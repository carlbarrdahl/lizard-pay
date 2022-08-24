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
import { trpc } from "utils/trpc";
import { useRouter } from "next/router";

const emptyInvoice = {} as Invoice;
const PayInvoicePage: NextPage = () => {
  const router = useRouter();
  const { address } = useAccount();
  const { id, account } = router.query as { id: string; account: string };
  const {
    data: invoice = {},
    error,
    isLoading,
  } = trpc.useQuery(["invoices.byId", { id, account }]);
  const walletAddress = trpc.useQuery(["account.wallet", { account }]);
  console.log(invoice);
  console.log(walletAddress.data);
  const wallet = getAddress(invoice?.footer) || walletAddress.data?.wallet;
  const { chain } = useNetwork();
  const isTest = true || chain?.id !== 1;
  const isCorrectChain =
    (invoice?.livemode && chain?.id === 1) ||
    (!invoice?.livemode && chain?.id === 5);

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
        {!address ? (
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
          <PayInvoice address={wallet} amount={invoice.total / 100} />
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

export default PayInvoicePage;
