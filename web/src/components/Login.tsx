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
import { InputField } from './InputField';
import { ModalProps } from './interface/ModalInterface';

interface LoginProps extends ModalProps {}

interface FormValues {
  usernameOrEmail: string;
  password: string;
}
export const Login: React.FC<LoginProps> = ({ isOpen, onClose }) => {
  const initialValues: FormValues = { usernameOrEmail: '', password: '' };
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Login</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Formik
            initialValues={initialValues}
            onSubmit={(values) => {
              console.log(values);
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
