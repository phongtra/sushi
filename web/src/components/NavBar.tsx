import React from 'react';
import {
  Box,
  Link,
  Flex,
  Button,
  Heading,
  useDisclosure
} from '@chakra-ui/core';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { Login } from './Login';
import { Register } from './Register';
import { useLogoutMutation, useMeQuery } from '../generated/graphql';
import { useApolloClient } from '@apollo/client';

export const NavBar: React.FC = () => {
  const router = useRouter();
  const { data, loading, error } = useMeQuery({
    skip: typeof window === 'undefined'
  });
  const [logout] = useLogoutMutation();
  const apolloClient = useApolloClient();
  let body = null;
  const {
    isOpen: isLoginOpen,
    onOpen: onLoginOpen,
    onClose: onLoginClose
  } = useDisclosure();
  const {
    isOpen: isRegisterOpen,
    onOpen: onRegisterOpen,
    onClose: onRegisterClose
  } = useDisclosure();
  if (loading) {
  }
  if (!data?.me && !loading) {
    body = (
      <>
        <Button onClick={onLoginOpen} mr={4}>
          Login
        </Button>
        <Button onClick={onRegisterOpen}>Register</Button>
      </>
    );
  } else {
    body = (
      <Flex align='center'>
        <Box mr={4}> {data?.me?.username && <div>{data.me.username}</div>}</Box>
        <Box mr={4}>
          <NextLink href='/create-recipe'>
            <Link>Create Recipe</Link>
          </NextLink>
        </Box>
        <Button
          onClick={async () => {
            await logout();
            await apolloClient.resetStore();
          }}
          mr={4}
        >
          Logout
        </Button>
      </Flex>
    );
  }

  return (
    <Flex position='sticky' top={0} zIndex={1} p={4} bg='tan'>
      <Flex maxW={800} align='center' flex={1} m='auto'>
        <NextLink href='/'>
          <Link>
            <Heading>Sushi</Heading>
          </Link>
        </NextLink>
        <Box ml='auto'>{body}</Box>
        <Login isOpen={isLoginOpen} onClose={onLoginClose} />
        <Register isOpen={isRegisterOpen} onClose={onRegisterClose} />
      </Flex>
    </Flex>
  );
};
