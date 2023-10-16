import {
  Container,
  Box,
  Flex,
  Spacer,
  Button,
  ButtonGroup,
  Heading,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  VStack,
  Divider,
  useDisclosure,
  Wrap,
  WrapItem,
  Avatar,
  Text,
  useToast,
} from "@chakra-ui/react";
import { BellIcon, CheckIcon, CloseIcon } from "@chakra-ui/icons";
import "./header.css";
import http from "../lib/http";
import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";

const Header = () => {
  const imageLink = import.meta.env.VITE_API;
  const toast = useToast();
  const navigate = useNavigate();
  const api = http({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  });
  const [frs, setFrs] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    async function getCsrf() {
      await api.get(`${import.meta.env.VITE_ROOT}/sanctum/csrf-cookie`);
    }
    getCsrf();
    getFrs();
    return () => {};
  }, []);

  async function getFrs() {
    const response = await api.get("/friend-request");
    setFrs(response.data.data);
  }

  async function logout() {
    await api.post("/logout");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  }

  async function rejectFr(id) {
    try {
      const body = {
        id,
      };
      const response = await api.post("/reject-friend-request", body);

      toast({
        title: response.data.message,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      getFrs();
    } catch (e) {
      console.log(e);
    }
  }
  async function acceptFr(id) {
    try {
      const body = {
        id,
      };
      const response = await api.post("/accept-friend-request", body);

      toast({
        title: response.data.message,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      getFrs();
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <header className="main-header">
      <Container maxW="1200px">
        <Box p={4}>
          <Flex minWidth="max-content" alignItems="center" gap="2">
            <Box p="2">
              <Heading size="md">Chakra App</Heading>
            </Box>
            <ButtonGroup>
              <Button as={Link} to="/" colorScheme="teal" variant="ghost">
                Home
              </Button>
              <Button
                as={Link}
                to="/find-friends"
                colorScheme="teal"
                variant="ghost"
              >
                Find Friends
              </Button>
            </ButtonGroup>
            <Spacer />
            <ButtonGroup gap="2">
              <IconButton icon={<BellIcon />} onClick={onOpen} />
              <Button as={Link} to="/profile" colorScheme="teal">
                Profile
              </Button>
              <Button colorScheme="red" onClick={logout}>
                Logout
              </Button>
            </ButtonGroup>
          </Flex>
        </Box>
        <Modal isOpen={isOpen} onClose={onClose} isCentered size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              <Text fontWeight="semibold">Pending Friend Requests</Text>
            </ModalHeader>
            <ModalBody>
              <VStack divider={<Divider />} spacing={4} align="flex-start">
                {frs.map((fr, index) => {
                  return (
                    <Wrap key={index} w="100%">
                      <WrapItem>
                        <Avatar
                          name={fr.user.name}
                          src={
                            fr.user.profile_picture
                              ? `${imageLink}/image/${fr.user.profile_picture}`
                              : ""
                          }
                        />
                      </WrapItem>
                      <WrapItem alignItems="center" fontWeight="semibold">
                        <Text>{fr.user.name}</Text>
                      </WrapItem>
                      <WrapItem
                        alignItems="center"
                        ml="auto"
                        fontWeight="semibold"
                      >
                        <ButtonGroup spacing={2}>
                          <IconButton
                            colorScheme="green"
                            icon={<CheckIcon />}
                            onClick={() => acceptFr(fr.id)}
                          />
                          <IconButton
                            colorScheme="red"
                            icon={<CloseIcon />}
                            onClick={() => rejectFr(fr.id)}
                          />
                        </ButtonGroup>
                      </WrapItem>
                    </Wrap>
                  );
                })}
              </VStack>
            </ModalBody>
          </ModalContent>
        </Modal>
      </Container>
    </header>
  );
};

export default Header;
