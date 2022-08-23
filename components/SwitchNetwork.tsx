import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Button,
  Text,
} from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function SwitchNetwork() {
  return (
    <Alert
      status="warning"
      variant="subtle"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      textAlign="center"
      mb={4}
    >
      <AlertIcon />
      <AlertTitle mt={4} mb={1} fontSize="lg">
        Wrong Network
      </AlertTitle>
      <AlertDescription>
        <Text mb={4}>Change Network to pay invoice with crypto.</Text>
        <ConnectButton.Custom>
          {({ openChainModal }) => (
            <Button onClick={openChainModal} colorScheme="orange">
              Switch Network
            </Button>
          )}
        </ConnectButton.Custom>
      </AlertDescription>
    </Alert>
  );
}
