import {
  Box,
  Button,
  FormControl,
  Heading,
  List,
  ListItem
} from '@chakra-ui/core';
import { Form, Formik } from 'formik';
import React, { useState } from 'react';
import { InputField } from '../components/InputField';
import { Layout } from '../components/Layout';
import { useIsAuth } from '../utils/useIsAuth';
import { withApollo } from '../utils/withApollo';

interface FormProps {
  name: string;
}

const CreateRecipe = () => {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [procedures, setProcedures] = useState<string[]>([]);
  useIsAuth();
  const initialValues: FormProps = {
    name: ''
  };
  return (
    <Layout>
      <Heading>Create Your Stunning Recipe</Heading>
      <Formik
        initialValues={initialValues}
        onSubmit={async (values) => {
          console.log(values.name);
          console.log(ingredients);
          console.log(procedures);
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <FormControl>
              <InputField
                name='name'
                placeholder='Recipe Name'
                label='Recipe Name'
              />
              <Box mt={4}>
                <List styleType='disc'>
                  {ingredients.length &&
                    ingredients.map((ing) => {
                      return <ListItem key={ing}>{ing}</ListItem>;
                    })}
                </List>
                <Formik
                  initialValues={{ ingredients: '' }}
                  onSubmit={(values) => {
                    console.log('submitting', values);
                    setIngredients([...ingredients, values.ingredients]);
                  }}
                >
                  <Form>
                    <FormControl>
                      <InputField
                        name='ingredients'
                        placeholder='1tbps of salt'
                        label='List of ingredients'
                      />
                    </FormControl>
                    <Button type='submit'>Add Ingredients</Button>
                  </Form>
                </Formik>
              </Box>
              <Box mt={4}>
                <List styleType='disc'>
                  {procedures.length &&
                    procedures.map((prod) => {
                      return <ListItem key={prod}>{prod}</ListItem>;
                    })}
                </List>
                <Formik
                  initialValues={{ procedures: '' }}
                  onSubmit={(values) => {
                    setProcedures([...procedures, values.procedures]);
                  }}
                >
                  <Form>
                    <FormControl>
                      <InputField
                        name='procedures'
                        placeholder='Preheat 180 degree oven'
                        label='List of procedures'
                      />
                    </FormControl>
                  </Form>
                </Formik>
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
