import { config } from "config";
import { ethers } from "ethers";
import {
  useToken,
  useNetwork,
  useContractWrite,
  erc20ABI,
  usePrepareContractWrite,
} from "wagmi";

export function useTransferUSDC(to: string, amount: string) {
  const { chain } = useNetwork();
  const address = config[chain?.id as 1 | 5]?.tokens.usdc;

  const { data } = useToken({
    address,
    enabled: Boolean(chain?.id && address),
  });

  const tx = usePrepareContractWrite({
    addressOrName: address,
    contractInterface: erc20ABI,
    functionName: "transfer",
    enabled: Boolean(to && data),
    args: [to, ethers.utils.parseUnits("10", data?.decimals)],
  });
  const transfer = useContractWrite(tx.config);
  console.log("tranfeer", transfer.data);
  return { ...transfer, data, error: tx.error || transfer.error };
}
