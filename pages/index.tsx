import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
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

function AddressForm({ address = "" }) {
  const wallet = trpc.useMutation("customer.wallet");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(z.object({ address: EthAddress })),
    defaultValues: { address },
  });

  const error = errors.address;
  return (
    <form
      onSubmit={handleSubmit(({ address }) => {
        console.log(address);
        wallet.mutate({ address });
      })}
    >
      <FormControl isInvalid={!!error} mb={2}>
        <FormLabel htmlFor="address">Wallet Address</FormLabel>
        <Input required id="address" {...register("address")} />
        <FormErrorMessage>{error?.message}</FormErrorMessage>
      </FormControl>
      <Button
        type="submit"
        colorScheme={"blue"}
        isLoading={wallet.isLoading}
        disabled={wallet.isLoading}
      >
        Save
      </Button>
    </form>
  );
}
function Dashboard() {
  const { data, isLoading, error, ...rest } = trpc.useQuery(["customer.me"]);

  console.log("Dashboard", data, rest);
  return (
    <Box>
      <Heading>{data?.account?.settings?.dashboard.display_name}</Heading>
      <Card>
        {data && !isLoading ? <AddressForm address={data?.wallet} /> : null}
      </Card>
      <ConnectStripe />
    </Box>
  );
}

const Home: NextPage<{ token: string }> = ({ token, ...props }) => {
  console.log(props);
  const router = useRouter();
  useEffect(() => {
    if (token) {
      setToken(token);
      router.push("/");
    }
  }, []);
  return (
    <Layout>
      <Dashboard />
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

export default Home;
