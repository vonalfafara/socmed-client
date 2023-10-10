import {
  Container,
  Box,
  Flex,
  Spacer,
  Button,
  ButtonGroup,
  Heading,
} from "@chakra-ui/react";
import "./header.css";
import http from "../lib/http";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const api = http({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  });

  async function logout() {
    await api.post("/logout");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  }
  return (
    <header>
      <Container maxW="1200px">
        <Box p={4}>
          <Flex minWidth="max-content" alignItems="center" gap="2">
            <Box p="2">
              <Heading size="md">Chakra App</Heading>
            </Box>
            <ButtonGroup>
              <Button colorScheme="teal" variant="ghost">
                Home
              </Button>
              <Button colorScheme="teal" variant="ghost">
                Find Friends
              </Button>
            </ButtonGroup>
            <Spacer />
            <ButtonGroup gap="2">
              <Button colorScheme="teal">Profile</Button>
              <Button colorScheme="red" onClick={logout}>
                Logout
              </Button>
            </ButtonGroup>
          </Flex>
        </Box>
      </Container>
    </header>
  );
};

export default Header;
