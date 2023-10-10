import {
  Flex,
  Box,
  Button,
  Input,
  Heading,
  Stack,
  InputGroup,
  InputRightElement,
  FormControl,
  FormLabel,
  FormErrorMessage,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import http from "../lib/http";

const Login = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const api = http();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({
    email: [],
    password: [],
  });

  async function login() {
    try {
      const body = {
        email,
        password,
      };
      const response = await api.post("/login", body);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      navigate("/");
    } catch (e) {
      if (e.response.status === 401) {
        toast({
          title: e.response.data.message,
          description: "Please check your credentials again",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } else {
        setErrors({
          email: e.response.data.errors.email ?? [],
          password: e.response.data.errors.password ?? [],
        });
      }
    }
  }
  return (
    <Flex minH="100vh" alignItems="center" justifyContent="center">
      <Box p={4} maxW="500px" w="100%" borderWidth="2px" borderRadius="lg">
        <Heading as="h3" size="lg" mb={8}>
          Login
        </Heading>
        <Stack spacing={4}>
          <FormControl isInvalid={errors?.email?.length}>
            <FormLabel htmlFor="email">Email Address</FormLabel>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email?.map((error, index) => {
              return <FormErrorMessage key={index}>{error}</FormErrorMessage>;
            })}
          </FormControl>
          <FormControl isInvalid={errors?.password?.length}>
            <FormLabel htmlFor="password">Password</FormLabel>
            <InputGroup pr="5rem">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <InputRightElement width="5rem">
                <Button
                  size="sm"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </Button>
              </InputRightElement>
            </InputGroup>
            {errors.password?.map((error, index) => {
              return <FormErrorMessage key={index}>{error}</FormErrorMessage>;
            })}
          </FormControl>
          <Button colorScheme="teal" onClick={login}>
            Login
          </Button>
          <Button as={Link} to="/register">
            Don't have an account? Go to Register
          </Button>
        </Stack>
      </Box>
    </Flex>
  );
};

export default Login;
