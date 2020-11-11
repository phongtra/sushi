import { Heading } from '@chakra-ui/core';
import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { ListDocument, useCreateRecipeMutation } from '../generated/graphql';
import { useIsAuth } from '../utils/useIsAuth';
import { withApollo } from '../utils/withApollo';
import { FormControl, Box, List, ListItem, Button } from '@chakra-ui/core';
import { Form, Formik } from 'formik';
import { InputField } from '../components/InputField';
import Dropzone from 'react-dropzone';
import { useRouter } from 'next/router';
interface FormProps {
  name: string;
}

const CreateRecipe = () => {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [procedures, setProcedures] = useState<string[]>([]);
  const [image, setImage] = useState<File>(null);
  const router = useRouter();
  useIsAuth();
  const [createRecipe] = useCreateRecipeMutation();
  const initialValues: FormProps = {
    name: ''
  };
  return (
    <Layout>
      <Heading>Create Your Stunning Recipe</Heading>
      <Formik
        initialValues={initialValues}
        onSubmit={async (values) => {
          console.log(image);
          await createRecipe({
            variables: {
              image: image && image,
              name: values.name,
              ingredients,
              procedures
            },
            refetchQueries: [{ query: ListDocument }]
            // update: (cache) => {
            //   cache.gc();
            //   // cache.evict({ fieldName: 'recipes:{}' });
            // }
          });
          router.push('/');
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
                  onSubmit={(values, { resetForm }) => {
                    console.log('submitting', values);
                    setIngredients([...ingredients, values.ingredients]);
                    resetForm({ values: { ingredients: '' } });
                  }}
                >
                  <Form>
                    <FormControl>
                      <InputField
                        name='ingredients'
                        placeholder='1tbps of salt'
                        label='List of ingredients'
                      />
                      <Button type='submit'>Add Ingredients</Button>
                    </FormControl>
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
                  onSubmit={(values, { resetForm }) => {
                    setProcedures([...procedures, values.procedures]);
                    resetForm({ values: { procedures: '' } });
                  }}
                >
                  <Form>
                    <FormControl>
                      <InputField
                        name='procedures'
                        placeholder='Preheat 180 degree oven'
                        label='List of procedures'
                      />
                      <Button type='submit'>Add Procedures</Button>
                    </FormControl>
                  </Form>
                </Formik>
              </Box>
              <Box mt={4}>
                <Dropzone
                  accept='image/jpeg, image/png'
                  multiple={false}
                  onDrop={([file]) => setImage(file)}
                >
                  {({ getRootProps, getInputProps }) => (
                    <section>
                      <div {...getRootProps()}>
                        <input {...getInputProps()} />
                        <p>
                          {image === null
                            ? "Drag 'n' drop some files here, or click to select files "
                            : image.name}
                        </p>
                      </div>
                    </section>
                  )}
                </Dropzone>
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
                Create Recipe
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
