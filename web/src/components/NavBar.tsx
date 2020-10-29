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

export const NavBar: React.FC = () => {
  const router = useRouter();
  let body = null;
  const { isOpen, onOpen, onClose } = useDisclosure();
  body = (
    <>
      <Button onClick={onOpen}>Login</Button>
      <NextLink href='/register'>
        <Link>Register</Link>
      </NextLink>
    </>
  );
  return (
    <Flex position='sticky' top={0} zIndex={1} p={4} bg='tan'>
      <Flex maxW={800} align='center' flex={1} m='auto'>
        <NextLink href='/'>
          <Link>
            <Heading>Sushi</Heading>
          </Link>
        </NextLink>
        <Box ml='auto'>{body}</Box>
        <Login isOpen={isOpen} onClose={onClose} />
      </Flex>
    </Flex>
  );
};
