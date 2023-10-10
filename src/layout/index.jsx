import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Flex, Box, Container } from "@chakra-ui/react";
import http from "../lib/http";
import { useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";

const Layout = () => {
  const navigate = useNavigate();
  const api = http({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  });

  useEffect(() => {
    async function check() {
      try {
        const response = await api.get("/check");
      } catch (e) {
        navigate("/login");
      }
    }
    check();
    return () => {};
  }, []);
  return (
    <Flex minH="100vh" flexDirection="column">
      <Header />
      <Container maxW="1200px">
        <Outlet />
      </Container>
      <Box mt="auto">
        <Footer />
      </Box>
    </Flex>
  );
};

export default Layout;
