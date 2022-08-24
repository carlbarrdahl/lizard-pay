import Link from "next/link";
import { Button, Text } from "@chakra-ui/react";

const NEXT_PUBLIC_STRIPE_CLIENT_ID = process.env.NEXT_PUBLIC_STRIPE_CLIENT_ID;
const NEXT_PUBLIC_STRIPE_REDIRECT = process.env.NEXT_PUBLIC_STRIPE_REDIRECT;
const STRIPE_CONNECT = `https://connect.stripe.com/oauth/authorize?response_type=code&client_id=${NEXT_PUBLIC_STRIPE_CLIENT_ID}&scope=read_write&redirect_uri=${NEXT_PUBLIC_STRIPE_REDIRECT}`;

const ConnectStripe = () => (
  <Link href={STRIPE_CONNECT} passHref>
    <Button
      size="lg"
      color="white"
      bg="#635bff"
      fontWeight={"normal"}
      _hover={{ bg: "#7a73ff" }}
      _active={{ bg: "#7a73ff" }}
    >
      Connect with{" "}
      <Text as="span" pl={1} fontWeight="bold">
        Stripe
      </Text>
    </Button>
  </Link>
);

export default ConnectStripe;
