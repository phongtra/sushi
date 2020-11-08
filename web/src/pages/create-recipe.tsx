import { Box, Button, FormControl, Heading } from '@chakra-ui/core';
import { Form, Formik } from 'formik';
import React from 'react';
import { InputField } from '../components/InputField';
import { Layout } from '../components/Layout';
import { MeQuery, MeDocument } from '../generated/graphql';
import { useIsAuth } from '../utils/useIsAuth';
import { withApollo } from '../utils/withApollo';

const CreateRecipe = () => {
  useIsAuth();
  return (
    <Layout>
      <Heading>Create Your Stunning Recipe</Heading>
      <Formik
        initialValues={{ abc: '' }}
        onSubmit={async () => {
          console.log('submitting');
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
    </Layout>
  );
};

export default withApollo({ ssr: true })(CreateRecipe);
