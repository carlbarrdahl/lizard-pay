import {
  Button,
  Heading,
  Text,
  Alert,
  AlertTitle,
  AlertDescription,
  Table,
  Tbody,
  Tr,
  Td,
  Textarea,
} from "@chakra-ui/react";

import { formatMoney } from "utils/formatMoney";
import { useTransferUSDC } from "../hooks/useTransferUSDC";
import Card from "components/Card";
import { truncate } from "utils/truncate";
import { useAccount, useNetwork } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";

function PayButton({ amount = 0, disabled = false, isLoading = false }) {
  const { address } = useAccount();

  if (!address) {
    return (
      <ConnectButton.Custom>
        {({ openConnectModal }) => (
          <Button w="100%" colorScheme={"blue"} onClick={openConnectModal}>
            Connect Wallet
          </Button>
        )}
      </ConnectButton.Custom>
    );
  }
  return (
    <Button
      w="100%"
      colorScheme={"blue"}
      type="submit"
      disabled={disabled}
      isLoading={isLoading}
    >
      Pay {formatMoney(amount)}
    </Button>
  );
}

export default function PayInvoice({ address = "", amount = 0 }) {
  const usdc = useTransferUSDC(address, String(amount));
  const { chain } = useNetwork();
  console.log(usdc, chain);
  const canPay = Boolean(address && usdc.write && !usdc.error);

  return (
    <Card
      as="form"
      onSubmit={(e) => {
        e.preventDefault();
        if (usdc.write) usdc?.write();
      }}
    >
      <Heading size="md" mb={8}>
        Pay with crypto
      </Heading>

      <Table size="sm" variant={"unstyled"} mb={4}>
        <Tbody>
          <Tr>
            <Td>Amount</Td>
            <Td>
              {amount} {usdc.data?.symbol}
            </Td>
          </Tr>
          <Tr>
            <Td>Address</Td>
            <Td>
              <Text size="xs" as="code" title={address}>
                {truncate(address) || "NO_ADDRESS_FOUND"}
              </Text>
            </Td>
          </Tr>
        </Tbody>
      </Table>

      <PayButton
        amount={amount}
        disabled={!canPay}
        isLoading={usdc.isLoading}
      />

      {usdc.error ? (
        <Alert
          status="error"
          variant="subtle"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
          mt={4}
        >
          <AlertTitle mt={4} mb={1} fontSize="lg">
            {usdc.error.code}
          </AlertTitle>
          <AlertDescription>
            <Textarea>
              {usdc.error?.error?.message || usdc.error.message}
            </Textarea>
          </AlertDescription>
        </Alert>
      ) : null}
    </Card>
  );
}
