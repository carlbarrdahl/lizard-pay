import {
  Link,
  Select,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";

import { formatDate } from "utils/formatDate";
import { truncate } from "utils/truncate";
import { trpc } from "utils/trpc";
import USDC from "components/USDC";

export default function TransactionsTable({ address = "" }) {
  const { data, isLoading, error } = trpc.useQuery(
    ["tx.list", { address, network: 1 }],
    { enabled: Boolean(address) }
  );
  return (
    <Table size="sm">
      <Thead>
        <Tr>
          <Th w={64}>Hash</Th>
          <Th>From</Th>
          <Th w={24}>Token</Th>
          <Th w={24} isNumeric>
            Amount
          </Th>
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
                {truncate(t.hash, 30)}
              </Link>
            </Td>
            <Td title={t.from}>{truncate(t.from, 24)}</Td>
            <Td>
              <Text as="span" display="inline-flex">
                <USDC size={12} />{" "}
                <Text as="span" pl={2}>
                  {t.asset}
                </Text>
              </Text>
            </Td>
            <Td isNumeric>{t.value}</Td>
            <Td isNumeric>
              {formatDate(t.metadata.blockTimestamp, "YYYY-MM-DD HH:mm")}
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
}
