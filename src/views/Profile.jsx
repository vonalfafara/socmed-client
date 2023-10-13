import {
  Flex,
  Box,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Text,
  Avatar,
  Wrap,
  WrapItem,
  ButtonGroup,
  Button,
  Image,
  Input,
  Grid,
  GridItem,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  VStack,
  Divider,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import http from "../lib/http";
import { Link } from "react-router-dom";

const Profile = () => {
  const imageLink = import.meta.env.VITE_API;
  const { id } = useParams();
  const location = useLocation();
  const api = http({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  });
  const toast = useToast();
  const [user, setUser] = useState({});
  const [media, setMedia] = useState(null);
  const [userLikes, setUserLikes] = useState([]);
  const [comment, setComment] = useState("");
  const [disableFr, setDisableFr] = useState(true);
  const {
    isOpen: mediaOpen,
    onOpen: onMediaOpen,
    onClose: onMediaClose,
  } = useDisclosure();
  const {
    isOpen: likeOpen,
    onOpen: onLikeOpen,
    onClose: onLikeClose,
  } = useDisclosure();

  useEffect(() => {
    getUser();
    if (id) {
      getSenderFr();
    }
    return () => {};
  }, [location]);

  async function getUser() {
    const endpoint = id ? `/profile/${id}` : "/profile";
    const response = await api.get(endpoint);
    setUser(response.data.profile);
  }

  async function getSenderFr() {
    const response = await api.get(`/get-sender-friend-request/${id}`);
    setDisableFr(response.data.has_fr);
  }

  async function handleOpenMedia(image) {
    setMedia(image);
    onMediaOpen();
  }

  async function handleLikePost(id) {
    await api.post(`/posts/like/${id}`);
    getUser();
  }

  function handleShowLikes(likes) {
    setUserLikes(likes);
    onLikeOpen();
  }

  async function submitComment(e, id) {
    e.preventDefault();

    if (!comment) return;

    try {
      const body = {
        body: comment,
      };
      await api.post(`/comment/${id}`, body);
      setComment("");
      getUser();
    } catch (e) {
      console.log(e);
    }
  }

  function handleShowComments(id) {
    const alteredPosts = user.posts?.map((post) => {
      if (post.id === id) {
        post.show_comments = !post.show_comments;
      }
      return post;
    });
    setPosts(alteredPosts);
  }

  async function addFriend() {
    setDisableFr(true);
    try {
      const body = {
        user_to: user.id,
      };
      const response = await api.post("/friend-request", body);

      toast({
        title: response.data.message,
        description: "Please wait for the user's approval",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {}
  }

  return (
    <Flex justifyContent="center" pt={12}>
      <Grid
        templateRows="repeat(2, auto)"
        templateColumns="repeat(3, 1fr)"
        gap={4}
        maxW="1200px"
        w="100%"
      >
        <GridItem colSpan={3}>
          <Card>
            <CardBody>
              <Wrap mb={2}>
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
                  <Text>{user.name}</Text>
                </WrapItem>
                {id && !disableFr ? (
                  <WrapItem ml="auto" alignItems="center">
                    <Button colorScheme="teal" onClick={addFriend}>
                      Add Friend
                    </Button>
                  </WrapItem>
                ) : null}
              </Wrap>
              <Wrap>
                <WrapItem>
                  <Text>Gender:</Text>
                </WrapItem>
                <WrapItem>
                  <Text>{user.gender}</Text>
                </WrapItem>
              </Wrap>
              <Wrap>
                <WrapItem>
                  <Text>Birthday:</Text>
                </WrapItem>
                <WrapItem>
                  <Text>{user.birthdate}</Text>
                </WrapItem>
              </Wrap>
            </CardBody>
          </Card>
        </GridItem>
        <GridItem colSpan={{ sm: 3, md: 1 }}>
          <Card>
            <CardBody>
              <Text fontWeight="bold" mb={4}>
                Friends
              </Text>
              <VStack divider={<Divider />} spacing={4} align="flex-start">
                {user.friends?.map((friend, index) => {
                  return (
                    <Wrap key={index}>
                      <WrapItem>
                        <Avatar
                          name={friend.user.name}
                          src={
                            friend.user.profile_picture
                              ? `${imageLink}/image/${friend.user.profile_picture}`
                              : ""
                          }
                        />
                      </WrapItem>
                      <WrapItem alignItems="center" fontWeight="semibold">
                        <Link to={`/profile/${friend.user.id}`}>
                          {friend.user.name}
                        </Link>
                      </WrapItem>
                    </Wrap>
                  );
                })}
              </VStack>
            </CardBody>
          </Card>
        </GridItem>
        <GridItem colSpan={{ sm: 3, md: 2 }}>
          {user.posts?.map((post, index) => {
            return (
              <Card key={index} w="100%" mb={4}>
                <CardHeader>
                  <Wrap>
                    <WrapItem>
                      <Avatar
                        name={post.user.name}
                        src={
                          post.user.profile_picture
                            ? `${imageLink}/image/${post.user.profile_picture}`
                            : ""
                        }
                      />
                    </WrapItem>
                    <WrapItem alignItems="center" fontWeight="semibold">
                      <Text>{post.user.name}</Text>
                    </WrapItem>
                  </Wrap>
                </CardHeader>
                {post.media ? (
                  <Image
                    boxSize="300px"
                    width="100%"
                    objectFit="cover"
                    src={`${imageLink}/image/${post.media}`}
                    onClick={() => handleOpenMedia(post.media)}
                    cursor="pointer"
                  />
                ) : null}
                <CardBody>{post.body}</CardBody>
                <CardFooter flexDirection="column">
                  <Flex>
                    {post.like_count ? (
                      <Button
                        colorScheme="teal"
                        variant="link"
                        onClick={() => handleShowLikes(post.user_likes)}
                      >
                        {post.like_count} likes
                      </Button>
                    ) : null}
                    {post.comment_count ? (
                      <Button colorScheme="teal" variant="link" ml="auto">
                        {post.comment_count} comments
                      </Button>
                    ) : null}
                  </Flex>
                </CardFooter>
                <ButtonGroup size="md" isAttached variant="outline">
                  <Button flex="1" onClick={() => handleLikePost(post.id)}>
                    {post.liked ? "Unlike" : "Like"}
                  </Button>
                  <Button flex="1" onClick={() => handleShowComments(post.id)}>
                    Comment
                  </Button>
                </ButtonGroup>
                <Box p="20px">
                  <form onSubmit={(e) => submitComment(e, post.id)}>
                    <Input
                      placeholder="Type your comment here"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />
                  </form>
                </Box>
                {post.comments?.length ? (
                  <Flex p="20px" flexDirection="column" gap={4}>
                    {post.comments.map((comment, index) => {
                      return (
                        <Wrap key={index}>
                          <WrapItem>
                            <Avatar
                              size="sm"
                              name={comment.user.name}
                              src={
                                comment.user.profile_picture
                                  ? `${imageLink}/image/${comment.user.profile_picture}`
                                  : ""
                              }
                            />
                          </WrapItem>
                          <WrapItem
                            flex="1"
                            p={2}
                            borderRadius={8}
                            backgroundColor="rgb(240, 240, 240)"
                          >
                            <Box>
                              <Text fontSize="sm">
                                <Text as="span" mr={4}>
                                  {comment.user.name}
                                </Text>
                                <Text
                                  as="span"
                                  fontWeight="light"
                                  fontSize="xs"
                                >
                                  {comment.created_at}
                                </Text>
                              </Text>
                              <Text>{comment.body}</Text>
                            </Box>
                          </WrapItem>
                        </Wrap>
                      );
                    })}
                  </Flex>
                ) : null}
              </Card>
            );
          })}
        </GridItem>
      </Grid>
      <Modal isOpen={mediaOpen} onClose={onMediaClose} isCentered>
        <ModalOverlay />
        <ModalContent width="1200px" maxW="auto">
          <Image
            height="100%"
            width="100%"
            objectFit="cover"
            src={`${imageLink}/image/${media}`}
          />
        </ModalContent>
      </Modal>
      <Modal isOpen={likeOpen} onClose={onLikeClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Text fontWeight="semibold">Users that have liked this post</Text>
          </ModalHeader>
          <ModalBody>
            <VStack divider={<Divider />} spacing={4} align="flex-start">
              {userLikes.map((like, index) => {
                return (
                  <Wrap key={index}>
                    <WrapItem>
                      <Avatar
                        name={like.user.name}
                        src={
                          like.user.profile_picture
                            ? `${imageLink}/image/${like.user.profile_picture}`
                            : ""
                        }
                      />
                    </WrapItem>
                    <WrapItem alignItems="center" fontWeight="semibold">
                      <Text>{like.user.name}</Text>
                    </WrapItem>
                  </Wrap>
                );
              })}
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default Profile;
