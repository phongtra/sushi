import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Button,
  FormControl,
  Box,
  Select
} from '@chakra-ui/core';
import { Field, Form, Formik } from 'formik';
import React from 'react';
import { MeDocument, MeQuery, useSignupMutation } from '../generated/graphql';
import { InputField } from './InputField';
import { ModalProps } from './interface/ModalInterface';

enum Gender {
  blank = '',
  male = 'male',
  female = 'female',
  other = 'other'
}

interface RegisterProps extends ModalProps {}

interface FormValues {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  name?: string;
  dateOfBirth?: string;
  gender?: Gender;
}
export const Register: React.FC<RegisterProps> = ({ isOpen, onClose }) => {
  const [signup] = useSignupMutation();
  const initialValues: FormValues = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    dateOfBirth: '',
    gender: Gender.blank
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Register</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Formik
            initialValues={initialValues}
            onSubmit={async (values) => {
              await signup({
                variables: {
                  username: values.username,
                  email: values.email,
                  password: values.password,
                  name: values.name && values.name,
                  dateOfBirth: values.dateOfBirth && values.dateOfBirth,
                  gender: values.gender && values.gender
                },
                update: (caches, { data }) => {
                  caches.writeQuery<MeQuery>({
                    query: MeDocument,
                    data: {
                      __typename: 'Query',
                      me: data.signUp.user
                    }
                  });
                }
              });
              onClose();
            }}
          >
            {({ isSubmitting }) => (
              <Form>
                <FormControl>
                  <InputField
                    name='username'
                    placeholder='Username'
                    important
                    label='Username'
                  />
                  <Box mt={4}>
                    <InputField
                      name='email'
                      placeholder='Email'
                      important
                      label='Email'
                    />
                  </Box>
                  <Box mt={4}>
                    <InputField
                      name='password'
                      important
                      placeholder='Password'
                      label='Password'
                      type='password'
                    />
                  </Box>
                  <Box mt={4}>
                    <InputField
                      name='confirmPassword'
                      important
                      placeholder='Confirm Password'
                      label='Confirm Password'
                      type='password'
                    />
                  </Box>
                  <Box mt={4}>
                    <InputField name='name' placeholder='Name' label='Name' />
                  </Box>
                  <Box mt={4}>
                    <InputField
                      name='dateOfBirth'
                      placeholder='Date Of Birth'
                      label='Date Of Birth'
                    />
                  </Box>
                  <Box mt={4}>
                    <Field as={Select} placeholder='Gender' name='gender'>
                      <option value='male'>Male</option>
                      <option value='female'>Female</option>
                      <option value='other'>Other</option>
                    </Field>
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
                    Register
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
