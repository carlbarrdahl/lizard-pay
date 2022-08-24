import {
  chakra,
  Box,
  Image,
  Input,
  Stack,
  Text,
  HStack,
  Flex,
} from "@chakra-ui/react";
import USDC from "components/USDC";
import ConnectStripe from "features/dashboard/components/ConnectStripe";
import type { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { signJwt } from "utils/jwt";
import { setToken } from "utils/localStorage";

const Home: NextPage<{ token: string }> = ({ token, ...props }) => {
  console.log(props);
  const router = useRouter();
  useEffect(() => {
    if (token) {
      setToken(token);
      router.push("/dashboard");
    }
  }, []);
  return (
    <Box px={8} py={24} mx="auto">
      <Box
        w={{
          base: "full",
          md: 11 / 12,
          xl: 9 / 12,
        }}
        mx="auto"
        textAlign={{
          base: "left",
          md: "center",
        }}
      >
        <chakra.h1
          mb={6}
          fontSize="5xl"
          fontWeight="bold"
          lineHeight="none"
          color="gray.900"
        >
          Receive payments for your
          <Text
            w="full"
            bgClip="text"
            bgGradient="linear(to-l, #635bff, #7a73ff)"
            fontWeight="extrabold"
          >
            Stripe Invoices
          </Text>{" "}
          <Text display={"inline-flex"}>
            with{" "}
            <HStack pl={3} display="inline-flex">
              <USDC size={44} />
              <Text>USDC.</Text>
            </HStack>
          </Text>
        </chakra.h1>

        <Text mb={4} fontSize="lg">
          Lizard Pay is built on top of Stripe to enable crypto payments on your
          invoices.
        </Text>

        <Stack
          direction={{
            base: "column",
            sm: "row",
          }}
          spacing={2}
          justifyContent={{
            sm: "left",
            md: "center",
          }}
        >
          <ConnectStripe />
        </Stack>
      </Box>
      <Box
        w={{
          base: "full",
          md: 10 / 12,
        }}
        mx="auto"
        mt={8}
        textAlign="center"
      >
        <Image
          w="full"
          rounded="lg"
          shadow="2xl"
          src="./invoice.png"
          alt="Hellonext feedback boards software screenshot"
        />
      </Box>
    </Box>
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
