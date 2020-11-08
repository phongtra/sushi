import { useApolloClient } from '@apollo/client';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Button,
  FormControl,
  Box
} from '@chakra-ui/core';
import { Form, Formik } from 'formik';
import React from 'react';
import { MeDocument, MeQuery, useLoginMutation } from '../generated/graphql';
import { InputField } from './InputField';
import { ModalProps } from './interface/ModalInterface';

interface LoginProps extends ModalProps {}

interface FormValues {
  usernameOrEmail: string;
  password: string;
}
export const Login: React.FC<LoginProps> = ({ isOpen, onClose }) => {
  const apolloClient = useApolloClient();
  const initialValues: FormValues = { usernameOrEmail: '', password: '' };
  const [login, { loading }] = useLoginMutation();
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Login</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Formik
            initialValues={initialValues}
            onSubmit={async ({ usernameOrEmail, password }) => {
              console.log('submitting');
              await login({
                variables: { usernameOrEmail, password },
                update: (caches, { data }) => {
                  caches.writeQuery<MeQuery>({
                    query: MeDocument,
                    data: {
                      __typename: 'Query',
                      me: data.signin.user
                    }
                  });
                }
              });
              // await apolloClient.resetStore();
              onClose();
            }}
          >
            {({ isSubmitting }) => (
              <Form>
                <FormControl>
                  <InputField
                    name='usernameOrEmail'
                    placeholder='Username or Email'
                    label='Username or Email'
                  />
                  <Box mt={4}>
                    <InputField
                      name='password'
                      placeholder='Password'
                      label='Password'
                      type='password'
                    />
                  </Box>
                  {/* <Flex mt={2}>
                     <NextLink href='/forget-password'>
                       <Link ml='auto'>forgot password</Link>
                     </NextLink>
                   </Flex>
      */}
                  <Button
                    type='submit'
                    variantColor='teal'
                    mt={4}
                    isLoading={isSubmitting}
                  >
                    Login
                  </Button>
                  {/* <FormErrorMessage>{form.errors.name}</FormErrorMessage> */}
                </FormControl>
              </Form>
            )}
          </Formik>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
