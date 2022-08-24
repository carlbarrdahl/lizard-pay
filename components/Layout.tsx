import { Box, Container } from "@chakra-ui/react";
import { PropsWithChildren } from "react";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <Box bg="gray.100" h="100vh">
      <Container maxW="container.lg" py={8}>
        {children}
      </Container>
    </Box>
  );
}
