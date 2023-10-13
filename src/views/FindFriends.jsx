import {
  Flex,
  Box,
  Text,
  Avatar,
  Wrap,
  WrapItem,
  Divider,
  Input,
  VStack,
} from "@chakra-ui/react";
import {
  Pagination,
  PaginationPage,
  PaginationContainer,
  PaginationPageGroup,
} from "@ajna/pagination";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import http from "../lib/http";

const FindFriends = () => {
  const imageLink = import.meta.env.VITE_API;
  const api = http({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  });
  const [search, setSearch] = useState("");
  const [delaySearch, setDelaySearch] = useState("");
  const [users, setUsers] = useState([]);
  const [meta, setMeta] = useState({});

  useEffect(() => {
    getUsers();
    return () => {};
  }, [search]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearch(delaySearch);
    }, 500);
    return () => clearTimeout(timeout);
  }, [delaySearch]);

  async function getUsers() {
    const response = await api.get(`/users?q=${search}`);
    console.log(response);
    // setUsers(response.data.data);
    // setMeta(response.data.meta);
  }

  return (
    <Flex justifyContent="center" pt={12}>
      <Box maxW="1200px" w="100%">
        <Input
          placeholder="Search user"
          value={delaySearch}
          onChange={(e) => setDelaySearch(e.target.value)}
        />
        <VStack divider={<Divider />} my={4} spacing={4} align="flex-start">
          {users.map((user, index) => {
            return (
              <Wrap key={index}>
                <WrapItem>
                  <Avatar
                    name={user.name}
                    src={
                      user.profile_picture
                        ? `${imageLink}/image/${user.profile_picture}`
                        : ""
                    }
                  />
                </WrapItem>
                <WrapItem alignItems="center" fontWeight="semibold">
                  <Link to={`/profile/${user.id}`}>{user.name}</Link>
                </WrapItem>
              </Wrap>
            );
          })}
        </VStack>
        {/* <Flex justifyContent="flex-end" mb={4}>
          <Pagination
            pagesCount={meta.last_page}
            currentPage={meta.current_page}
            onPageChange={onPageChange}
          >
            <PaginationContainer>
              <PaginationPageGroup>
                {meta.links?.map((page) => (
                  <PaginationPage
                    key={`pagination_page_${page.label}`}
                    page={page.label}
                    isDisabled={!page.url}
                    padding={4}
                    colorScheme={page.active ? "teal" : "gray"}
                  />
                ))}
              </PaginationPageGroup>
            </PaginationContainer>
          </Pagination>
        </Flex> */}
      </Box>
    </Flex>
  );
};

export default FindFriends;
