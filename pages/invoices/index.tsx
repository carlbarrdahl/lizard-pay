import type { GetServerSideProps, NextPage } from "next";
import {
  Button,
  ButtonGroup,
  ButtonProps,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useToast,
} from "@chakra-ui/react";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Layout from "components/Layout";

import { Invoice } from "features/invoice/types";
import { formatDate } from "utils/formatDate";
import { formatMoney } from "utils/formatMoney";
import Card from "components/Card";
import Link from "next/link";
import { trpc } from "utils/trpc";
import { useNetwork } from "wagmi";
import { truncate } from "utils/truncate";
import { EthAddress } from "schemas";

function CreateWebhookButton({ id = "", ...props }: ButtonProps) {
  const toast = useToast();
  const { chain } = useNetwork();
  const { data, isLoading, error, mutate } = trpc.useMutation("webhook.create");
  console.log(data);
  const address = "0xD5c94d0BfCa611E3BF61228E85FC5374c4dEB4c0";
  return (
    <Button
      {...props}
      isLoading={isLoading}
      disabled={isLoading}
      onClick={() =>
        mutate(
          { id, address, network: Number(chain?.id) },
          {
            onSuccess: () => {
              toast({
                title: "Webhook created successfully!",
                status: "success",
              });
            },
            onError: (err) => {
              toast({
                title: "Create Webhook: Error",
                status: "error",
                description: err.message,
              });
            },
          }
        )
      }
    >
      Create Webhook
    </Button>
  );
}

const TxTable = () => {
  const { chain } = useNetwork();
  const { register, watch, formState } = useForm({
    resolver: zodResolver(z.object({ address: EthAddress })),
    defaultValues: { address: "0xD5c94d0BfCa611E3BF61228E85FC5374c4dEB4c0" },
  });

  console.log(formState.errors, formState);
  const address = watch("address");
  const network = chain?.id as number;
  const { data, isLoading, error } = trpc.useQuery(
    ["tx.list", { address, network }],
    { enabled: false || Boolean(address && network) }
  );
  return (
    <>
      <Heading size="md" mb={8} color="gray.700">
        Transactions
      </Heading>
      <Card>
        <FormControl mb={8}>
          <FormLabel>Wallet address</FormLabel>
          <Input {...register("address")} />
        </FormControl>
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
                <Td>{/* <LinkInvoiceButton hash={t.hash} /> */}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Card>
    </>
  );
};

const ListInvoicesPage: NextPage<{
  invoices: { data: Invoice[]; has_more: boolean };
}> = ({ invoices }) => {
  console.log(invoices);
  const { data, isLoading, error } = trpc.useQuery(["invoices.list"]);
  return (
    <Layout>
      <Heading size="md" mb={8} color="gray.700">
        Open Invoices
      </Heading>

      <Card>
        <Table size="sm">
          <Thead>
            <Tr>
              <Th>ID</Th>
              <Th>Customer</Th>
              <Th>Status</Th>
              <Th isNumeric>Amount</Th>
              <Th isNumeric>Due</Th>
              <Th isNumeric>Created</Th>
              <Th isNumeric></Th>
            </Tr>
          </Thead>
          <Tbody>
            {data?.data.map((invoice) => (
              <Tr key={invoice.number}>
                <Td>{invoice.number}</Td>
                <Td>{invoice.customer_name}</Td>
                <Td>{invoice.status}</Td>
                <Td>{formatMoney(invoice.total / 100)}</Td>
                <Td isNumeric>
                  {invoice.due_date && formatDate(invoice.due_date * 1000)}
                </Td>
                <Td isNumeric>{formatDate(invoice.created * 1000)}</Td>
                <Td>
                  <ButtonGroup>
                    {invoice.status === "open" ? (
                      <Link href={`/invoices/${invoice.id}/pay`} passHref>
                        <Button as="a" size="sm">
                          Payment link
                        </Button>
                      </Link>
                    ) : null}
                    {/* <CreateWebhookButton id={invoice.id} size="sm">
                      Create Webhook
                    </CreateWebhookButton> */}
                  </ButtonGroup>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Card>
      <TxTable />
    </Layout>
  );
};

export default ListInvoicesPage;
