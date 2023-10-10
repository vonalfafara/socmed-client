import {
  Flex,
  Box,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import http from "../lib/http";

const Home = () => {
  const api = http({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  });
  const [posts, setPosts] = useState([]);

  useState(() => {
    getPosts();
    return () => {};
  }, []);

  async function getPosts() {
    try {
      const response = await api.get("/posts");
      console.log(response);
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <Flex justifyContent="center" pt={12}>
      <Box maxW="600px" w="100%">
        <Card w="100%">
          <CardHeader>test</CardHeader>
          <CardBody>test</CardBody>
          <CardFooter>test</CardFooter>
        </Card>
      </Box>
    </Flex>
  );
};

export default Home;
