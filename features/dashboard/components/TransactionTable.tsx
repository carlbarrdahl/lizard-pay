import { Link, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";

import { formatDate } from "utils/formatDate";
import { truncate } from "utils/truncate";
import { trpc } from "utils/trpc";

export default function TransactionsTable({ address = "" }) {
  const { data, isLoading, error } = trpc.useQuery(
    ["tx.list", { address, network: 1 }],
    { enabled: Boolean(address) }
  );
  return (
    <Table size="sm">
      <Thead>
        <Tr>
          <Th>Hash</Th>
          <Th w={8} isNumeric>
            Amount
          </Th>
          <Th w={8}>Token</Th>
          <Th>From</Th>
          <Th isNumeric>Received</Th>
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
                {truncate(t.hash, 20)}
              </Link>
            </Td>
            <Td isNumeric>{t.value}</Td>
            <Td>{t.asset}</Td>
            <Td>{truncate(t.from, 15)}</Td>
            <Td isNumeric>
              {formatDate(t.metadata.blockTimestamp, "YYYY-MM-DD HH:mm")}
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
}
