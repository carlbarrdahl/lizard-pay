import { Heading, Table, Tbody, Td, Text, Tr } from "@chakra-ui/react";

import { formatMoney } from "utils/formatMoney";
import { formatDate } from "utils/formatDate";

import Card from "components/Card";

import { Invoice } from "features/invoice/types";

export default function InvoiceDetails({ invoice }: { invoice: Invoice }) {
  return (
    <Card>
      <Heading>{formatMoney(invoice.total / 100)}</Heading>
      <Text fontWeight={500} fontSize="sm" color="gray.700" mb={8}>
        Due {formatDate(invoice.due_date * 1000)}
      </Text>
      <Table size="sm" variant={"unstyled"}>
        <Tbody>
          <Tr>
            <Td>To</Td>
            <Td>{invoice.customer_name}</Td>
          </Tr>
          <Tr>
            <Td>From</Td>
            <Td>{invoice.account_name}</Td>
          </Tr>
          <Tr>
            <Td>Invoice</Td>
            <Td>{invoice.number}</Td>
          </Tr>
        </Tbody>
      </Table>
    </Card>
  );
}
