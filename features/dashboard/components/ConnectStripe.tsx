import Link from "next/link";
import { Button } from "@chakra-ui/react";

const NEXT_PUBLIC_STRIPE_CLIENT_ID = process.env.NEXT_PUBLIC_STRIPE_CLIENT_ID;
const NEXT_PUBLIC_STRIPE_REDIRECT = process.env.NEXT_PUBLIC_STRIPE_REDIRECT;
const STRIPE_CONNECT = `https://connect.stripe.com/oauth/authorize?response_type=code&client_id=${NEXT_PUBLIC_STRIPE_CLIENT_ID}&scope=read_write&redirect_uri=${NEXT_PUBLIC_STRIPE_REDIRECT}`;

const ConnectStripe = () => (
  <Link href={STRIPE_CONNECT} passHref>
    <Button>Connect Stripe</Button>
  </Link>
);

export default ConnectStripe;
