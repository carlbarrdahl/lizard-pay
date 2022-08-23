import type { NextPage } from "next";
import {
  Button,
  Heading,
  Link,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Select,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import Layout from "components/Layout";

import { formatDate } from "utils/formatDate";
import Card from "components/Card";
import { truncate } from "utils/truncate";
import { trpc } from "utils/trpc";
import { useRouter } from "next/router";
import { useNetwork } from "wagmi";
import { formatMoney } from "utils/formatMoney";

function LinkInvoiceButton({ hash }: { hash: string }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { register, watch, handleSubmit } = useForm();
  const { data, isLoading, error } = trpc.useQuery(["invoices.list"]);
  const pay = trpc.useMutation("invoice.pay");
  function handleLink(id: string) {
    // pay.mutate({ id, hash });
  }
  // console.log(watch());
  // console.log(data, error);
  return (
    <>
      <Button size="sm" onClick={onOpen}>
        Link to invoice
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent
          as="form"
          onSubmit={handleSubmit(({ id }) => {
            pay.mutate(
              { id, hash },
              {
                onSuccess: () => {
                  onClose();
                },
              }
            );
          })}
        >
          <ModalHeader>Connect to Stripe invoice</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Select {...register("id")}>
              {data?.data.map((invoice) => (
                <option value={invoice.id}>
                  {formatMoney(invoice.total / 100)} - {invoice.customer_name} -{" "}
                  {invoice.number}
                </option>
              ))}
            </Select>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} type="submit">
              Link
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

type Tx = {
  hash: string;
  asset: string;
  from: string;
  value: number;
  metadata: { blockTimestamp: string };
};
const TransactionsPage: NextPage = () => {
  // console.log(tx);
  const router = useRouter();
  const { chain } = useNetwork();
  const address = router.query.address as string;
  const network = chain?.id as number;
  const { data, isLoading, error } = trpc.useQuery(
    ["tx.list", { address, network }],
    { enabled: Boolean(address && network) }
  );
  console.log(data, error);
  return (
    <Layout>
      <Heading size="md" mb={8} color="gray.700">
        Transactions to: <pre>{address}</pre>
      </Heading>

      <Card>
        <Table>
          <Thead>
            <Tr>
              <Th>Hash</Th>
              <Th>Token</Th>
              <Th isNumeric>Amount</Th>
              <Th>From</Th>
              <Th isNumeric>Received</Th>
              <Th isNumeric>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data?.map((t, i) => (
              <Tr key={`${t.hash}_${i}`}>
                <Td title={t.hash}>
                  <Link
                    color={"blue.600"}
                    href={`https://etherscan.io/tx/${t.hash}`}
                    target="_blank"
                  >
                    {truncate(t.hash, 10)}
                  </Link>
                </Td>
                <Td>{t.asset}</Td>
                <Td isNumeric>{t.value}</Td>
                <Td>{truncate(t.from, 15)}</Td>
                <Td isNumeric>
                  {formatDate(t.metadata.blockTimestamp, "YYYY-MM-DD HH:mm")}
                </Td>
                <Td>
                  <LinkInvoiceButton hash={t.hash} />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Card>
    </Layout>
  );
};

// export const getServerSideProps: GetServerSideProps = async (ctx) => {
//   const { address } = ctx.query;

//   return getTransactions({
//     fromBlock: "0x0",
//     toBlock: "latest",
//     category: ["erc20"],
//     withMetadata: true,
//     excludeZeroValue: false,
//     order: "desc",
//     maxCount: "0x3e8",
//     toAddress: address,
//   })
//     .then((r) => {
//       return {
//         props: { tx: r.result.transfers },
//       };
//     })
//     .catch((err) => {
//       console.log(err);
//       const { message, statusCode = 500 } = err;
//       return {
//         props: { error: { message, statusCode } },
//       };
//     });
// };

export default TransactionsPage;
