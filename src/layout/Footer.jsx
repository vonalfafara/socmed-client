import { Container, Box, Flex, Text } from "@chakra-ui/react";
import "./footer.css";

const Footer = () => {
  return (
    <footer className="main-footer">
      <Container maxW="1200px">
        <Box p={4}>
          <Flex minWidth="max-content" justifyContent="center" gap="2">
            <Box p="2">
              <Text fontSize="xs" size="md">
                &copy; Copyright 2023
              </Text>
            </Box>
          </Flex>
        </Box>
      </Container>
    </footer>
  );
};

export default Footer;
