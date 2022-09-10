import { Box, Heading, HStack, Text } from "@chakra-ui/react";
import Layout from "components/Layout";
import type { GetServerSideProps, NextPage } from "next";
import { signJwt } from "utils/jwt";
import { trpc } from "utils/trpc";
import InvoicesTable from "features/dashboard/components/InvoicesTable";
import TransactionsTable from "features/dashboard/components/TransactionTable";
import WalletForm from "features/dashboard/components/WalletForm";

const Dashboard: NextPage = () => {
  const { data, isLoading, error } = trpc.useQuery(["customer.me"]);

  return (
    <Layout>
      <Box>
        <Box mb={12} maxW="container.sm">
          <Heading size="lg" mb={4}>
            {data?.account?.settings?.dashboard.display_name || "-"}
          </Heading>
          <WalletForm isLoading={isLoading} address={data?.wallet} />
        </Box>

        <Box mb={12}>
          <Heading size="sm" mb={4}>
            Invoices
          </Heading>
          <InvoicesTable account={data?.account.id} address={data?.wallet} />
        </Box>
        <Box mb={12}>
          <HStack mb={4}>
            <Heading size="sm">Transactions to:</Heading>
            <Text as="pre" fontSize={"xs"}>
              {data?.wallet}
            </Text>
          </HStack>
          <TransactionsTable address={data?.wallet} />
        </Box>
      </Box>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { stripe } = await import("utils/stripe");

  const code = ctx.query.code as string;
  if (code)
    return stripe.oauth
      .token({ grant_type: "authorization_code", code })
      .then(async (props) => {
        console.log({ ...props });
        const token = signJwt(props);

        return { props: { token } };
      })
      .catch((err) => ({ props: { error: err.message } }));

  return {
    props: {},
  };
};

export default Dashboard;
