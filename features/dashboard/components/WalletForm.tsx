import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";

import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { EthAddress } from "schemas";
import { trpc } from "utils/trpc";
import { useEffect } from "react";

export default function WalletForm({ address = "", isLoading }) {
  const utils = trpc.useContext();
  const wallet = trpc.useMutation("customer.wallet");
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    // resolver: zodResolver(z.object({ address: EthAddress })),
    defaultValues: { address },
  });

  useEffect(() => {
    reset({ address });
  }, [address]);
  const error = errors.address;
  return (
    <form
      onSubmit={handleSubmit(({ address }) => {
        console.log(address);
        wallet.mutate(
          {
            address,
          },
          {
            onSettled: () => {
              console.log("Saved address");
              utils.invalidateQueries(["customer.me"]);
              // utils.invalidateQueries(["tx.list", { address, network: 1 }]);
            },
          }
        );
      })}
    >
      <Box
        as="fieldset"
        disabled={isLoading}
        sx={{
          _disabled: { opacity: 0.5 },
        }}
      >
        <FormControl isInvalid={!!error} mb={2}>
          <FormLabel htmlFor="address">Wallet Address</FormLabel>
          <FormHelperText mb={2}>
            Configure your wallet address to where you want the payments for the
            invoices to be sent.
          </FormHelperText>
          <InputGroup>
            <Input id="address" {...register("address")} />
            <InputRightElement
              as={Button}
              type="submit"
              w={16}
              colorScheme={"blue"}
              isLoading={wallet.isLoading}
              disabled={wallet.isLoading}
            >
              Save
            </InputRightElement>
          </InputGroup>
          <FormErrorMessage>{error?.message}</FormErrorMessage>
        </FormControl>
      </Box>
    </form>
  );
}
