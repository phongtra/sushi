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
import { useMeQuery } from '../generated/graphql';

export const NavBar: React.FC = () => {
  const router = useRouter();
  const { data, loading, error } = useMeQuery({
    skip: typeof window === 'undefined'
  });
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
  body = (
    <>
      <Button onClick={onLoginOpen} mr={4}>
        Login
      </Button>
      <Button onClick={onRegisterOpen}>Register</Button>
    </>
  );
  return (
    <Flex position='sticky' top={0} zIndex={1} p={4} bg='tan'>
      <Flex maxW={800} align='center' flex={1} m='auto'>
        <NextLink href='/'>
          <Link>
            <Heading>Sushi</Heading>
            {data?.me?.username && <div>{data.me.username}</div>}
          </Link>
        </NextLink>
        <Box ml='auto'>{body}</Box>
        <Login isOpen={isLoginOpen} onClose={onLoginClose} />
        <Register isOpen={isRegisterOpen} onClose={onRegisterClose} />
      </Flex>
    </Flex>
  );
};
