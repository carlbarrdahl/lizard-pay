import { Box, Container, Flex } from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { PropsWithChildren } from "react";

export default function PayLayout({ children }: PropsWithChildren) {
  return (
    <Box bg="gray.100" h="100vh">
      <Flex p={4} justify={"flex-end"}>
        <ConnectButton showBalance />
      </Flex>
      <Container maxW="md" py={8}>
        {children}
      </Container>
    </Box>
  );
}
