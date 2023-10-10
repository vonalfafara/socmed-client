import {
  Flex,
  Box,
  Button,
  Input,
  Heading,
  Stack,
  FormControl,
  FormLabel,
  Radio,
  RadioGroup,
  FormErrorMessage,
  useToast,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import http from "../lib/http";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Register = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const api = http();

  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [profile_picture, setProfilePicture] = useState(null);
  const [gender, setGender] = useState(null);
  const [birthdate, setBirthdate] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password_confirmation, setPasswordConfirmation] = useState("");
  const [errors, setErrors] = useState({
    first_name: [],
    last_name: [],
    gender: [],
    birthdate: [],
    email: [],
    password: [],
    password_confirmation: [],
  });

  async function register() {
    try {
      let image_name = null;
      if (profile_picture) {
        const form = new FormData();
        form.append("image", profile_picture);

        const response = await api.post("/upload", form);
        image_name = response.data.image;
      }

      const body = {
        first_name,
        last_name,
        profile_picture: image_name,
        gender,
        birthdate,
        email,
        password,
        password_confirmation,
      };

      const response = await api.post("/register", body);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      navigate("/");
    } catch (e) {
      setErrors({
        first_name: e.response.data.errors.first_name ?? [],
        last_name: e.response.data.errors.last_name ?? [],
        gender: e.response.data.errors.gender ?? [],
        birthdate: e.response.data.errors.birthdate ?? [],
        email: e.response.data.errors.email ?? [],
        password: e.response.data.errors.password ?? [],
      });
    }
  }

  return (
    <Flex minH="100vh" alignItems="center" justifyContent="center">
      <Box p={4} maxW="500px" w="100%" borderWidth="2px" borderRadius="lg">
        <Heading as="h3" size="lg" mb={8}>
          Register
        </Heading>
        <Stack spacing={4}>
          <FormControl isInvalid={errors.first_name.length}>
            <FormLabel htmlFor="first-name">First Name</FormLabel>
            <Input
              id="first-name"
              value={first_name}
              onChange={(e) => setFirstName(e.target.value)}
            />
            {errors.first_name?.map((error, index) => {
              return <FormErrorMessage key={index}>{error}</FormErrorMessage>;
            })}
          </FormControl>
          <FormControl isInvalid={errors.last_name.length}>
            <FormLabel htmlFor="last-name">Last Name</FormLabel>
            <Input
              id="last-name"
              value={last_name}
              onChange={(e) => setLastName(e.target.value)}
            />
            {errors.last_name?.map((error, index) => {
              return <FormErrorMessage key={index}>{error}</FormErrorMessage>;
            })}
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="profile-picture">Profile Picture</FormLabel>
            <Input
              id="profile-picture"
              type="file"
              onChange={(e) => setProfilePicture(e.target.files[0])}
            />
          </FormControl>
          <FormControl isInvalid={errors.gender.length}>
            <FormLabel htmlFor="gender">Gender</FormLabel>
            <RadioGroup id="gender" value={gender} onChange={setGender}>
              <Stack direction="row">
                <Radio value="Boy">Boy</Radio>
                <Radio value="Girl">Girl</Radio>
                <Radio value="Other">Other</Radio>
                <Radio value="Prefer not to say">Prefer not to say</Radio>
              </Stack>
            </RadioGroup>
            {errors.gender?.map((error, index) => {
              return <FormErrorMessage key={index}>{error}</FormErrorMessage>;
            })}
          </FormControl>
          <FormControl isInvalid={errors.birthdate.length}>
            <FormLabel htmlFor="birthdate">Birth Date</FormLabel>
            <Input
              id="birthdate"
              type="date"
              onChange={(e) => setBirthdate(e.target.value)}
            />
            {errors.birthdate?.map((error, index) => {
              return <FormErrorMessage key={index}>{error}</FormErrorMessage>;
            })}
          </FormControl>
          <FormControl isInvalid={errors.email.length}>
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
          <FormControl isInvalid={errors.password.length}>
            <FormLabel htmlFor="password">Password</FormLabel>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password?.map((error, index) => {
              return <FormErrorMessage key={index}>{error}</FormErrorMessage>;
            })}
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="password-confirmation">
              Password Confirmation
            </FormLabel>
            <Input
              id="password-confirmation"
              type="password"
              value={password_confirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
            />
          </FormControl>
          <Button colorScheme="teal" onClick={register}>
            Register
          </Button>
          <Button as={Link} to="/login">
            Already have an account? Go to Login
          </Button>
        </Stack>
      </Box>
    </Flex>
  );
};

export default Register;
