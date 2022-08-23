import { Box, BoxProps } from "@chakra-ui/react";

export default function Card(props: BoxProps) {
  return (
    <Box
      color="gray.800"
      bg="white"
      boxShadow={"xl"}
      p={8}
      mb={8}
      border={"1px solid"}
      borderColor={"gray.100"}
      borderRadius="lg"
      {...props}
    />
  );
}
