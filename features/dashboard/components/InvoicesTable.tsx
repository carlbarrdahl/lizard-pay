import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  ButtonGroup,
  Skeleton,
  SkeletonText,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import Link from "next/link";
import { formatDate } from "utils/formatDate";
import { formatMoney } from "utils/formatMoney";
import { trpc } from "utils/trpc";

function ErrorMessage({ title = "", error }) {
  return error ? (
    <Alert
      status="error"
      variant="subtle"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      textAlign="center"
      height="200px"
    >
      <AlertIcon boxSize="40px" mr={0} />
      <AlertTitle mt={4} mb={1} fontSize="lg">
        {title}
      </AlertTitle>
      <AlertDescription maxWidth="sm">{error.message}</AlertDescription>
    </Alert>
  ) : null;
}

export default function InvoicesTable({ account = "" }) {
  const { data, isLoading, error, ...rest } = trpc.useQuery(["invoices.list"]);
  console.log("error", error, rest);
  return (
    <Box>
      <ErrorMessage title="Error fetching invoices" error={error} />
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
          {isLoading ? (
            <Tr>
              <Td colSpan={7}>
                <Skeleton height={"49px"} noOfLines={1} />
              </Td>
            </Tr>
          ) : null}
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
              <Td isNumeric>
                <ButtonGroup>
                  {invoice.status === "open" ? (
                    <Link href={`/i/${account}/${invoice.id}/pay`} passHref>
                      <Button as="a" size="sm" target="_blank">
                        Payment link
                      </Button>
                    </Link>
                  ) : null}
                </ButtonGroup>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
}
