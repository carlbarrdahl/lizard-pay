import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Heading,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  Skeleton,
  SkeletonText,
  Text,
} from "@chakra-ui/react";
import Layout, { useStripe } from "components/Layout";
import ConnectStripe from "features/dashboard/components/ConnectStripe";
import type { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { EthAddress } from "schemas";
import { signJwt } from "utils/jwt";
import { setToken } from "utils/localStorage";
import { trpc } from "utils/trpc";
import Card from "components/Card";
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
          <Heading size="sm">Invoices</Heading>
          <InvoicesTable account={data?.account.id} />
        </Box>
        <Box mb={12}>
          <HStack>
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
