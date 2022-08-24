import { Box, Container } from "@chakra-ui/react";
import { PropsWithChildren } from "react";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <Box minH="100vh">
      <Container maxW="container.xl" py={8}>
        {children}
      </Container>
    </Box>
  );
}
