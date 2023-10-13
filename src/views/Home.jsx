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
  Button,
  Image,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
  Divider,
  ButtonGroup,
  Input,
  Textarea,
  useToast,
  VStack,
} from "@chakra-ui/react";
import {
  Pagination,
  PaginationPage,
  PaginationContainer,
  PaginationPageGroup,
} from "@ajna/pagination";
import { useState, useEffect, useRef } from "react";
import http from "../lib/http";

const Home = () => {
  const imageLink = import.meta.env.VITE_API;
  const api = http({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  });
  const toast = useToast();
  const [posts, setPosts] = useState([]);
  const ref = useRef(null);
  const [meta, setMeta] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [media, setMedia] = useState(null);
  const [userLikes, setUserLikes] = useState([]);
  const [comment, setComment] = useState("");
  const [postBody, setPostBody] = useState("");
  const [postMedia, setPostMedia] = useState(null);
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
    getPosts();
    return () => {};
  }, []);

  async function getPosts(page = 1) {
    try {
      setCurrentPage(page);
      const response = await api.get(`/posts?page=${page}`);
      setPosts(response.data.data);
      setMeta(response.data.meta);
    } catch (e) {
      console.log(e);
    }
  }

  function onPageChange(page) {
    if (page.includes("Previous")) {
      getPosts(meta.current_page - 1);
    } else if (page.includes("Next")) {
      getPosts(meta.current_page + 1);
    } else {
      getPosts(page);
    }
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }

  async function handleOpenMedia(image) {
    setMedia(image);
    onMediaOpen();
  }

  async function handleLikePost(id) {
    await api.post(`/posts/like/${id}`);
    getPosts();
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
      getPosts(currentPage);
    } catch (e) {
      console.log(e);
    }
  }

  function handleShowComments(id) {
    const alteredPosts = posts.map((post) => {
      if (post.id === id) {
        post.show_comments = !post.show_comments;
      }
      return post;
    });
    setPosts(alteredPosts);
  }

  async function createPost() {
    if (!postBody) return;

    try {
      let newPostMedia = null;

      if (postMedia) {
        const form = new FormData();
        form.append("image", postMedia);

        const response = await api.post("/upload", form);
        newPostMedia = response.data.image;
      }

      const body = {
        body: postBody,
        media: newPostMedia,
      };

      const response = await api.post("/posts", body);
      toast({
        title: response.data.message,
        description: "Check out the feed page to view your post",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      getPosts(1);
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <>
      <Flex justifyContent="center" pt={12}>
        <Box maxW="600px" w="100%">
          <Card mb={4} variant="filled" ref={ref}>
            <CardHeader>What's on your mind</CardHeader>
            <CardBody>
              <Textarea
                placeholder="Type your post here..."
                bg="white"
                value={postBody}
                onChange={(e) => setPostBody(e.target.value)}
                mb={4}
              />
              <Input
                type="file"
                onChange={(e) => setPostMedia(e.target.files[0])}
              />
              <Flex justifyContent="flex-end">
                <Button colorScheme="teal" onClick={createPost}>
                  Create Post
                </Button>
              </Flex>
            </CardBody>
          </Card>
          {posts.map((post, index) => {
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
                {post.show_comments ? (
                  <>
                    <Box p="20px">
                      <form onSubmit={(e) => submitComment(e, post.id)}>
                        <Input
                          placeholder="Type your comment here"
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                        />
                      </form>
                    </Box>
                    {post.comments.length ? (
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
                  </>
                ) : null}
              </Card>
            );
          })}
          <Box mb={4}>
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
          </Box>
        </Box>
      </Flex>
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
    </>
  );
};

export default Home;
