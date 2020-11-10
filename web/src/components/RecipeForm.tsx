import React, { useState } from 'react';
import { FormControl, Box, List, ListItem, Button } from '@chakra-ui/core';
import { Form, Formik } from 'formik';
import { useRouter } from 'next/router';

import {
  useCreateRecipeMutation,
  useUpdateRecipeMutation
} from '../generated/graphql';
import { InputField } from './InputField';
import Dropzone from 'react-dropzone';

interface RecipeFormProps {
  initialValues: {
    name: string;
  };
  formType: 'create-recipe' | 'edit-recipe';
  ingredients: string[];
  setIngredients: (option: string[]) => void;
  procedures: string[];
  setProcedures: (option: string[]) => void;
  id?: number;
}

export const RecipeForm: React.FC<RecipeFormProps> = ({
  initialValues,
  formType,
  ingredients,
  procedures,
  setIngredients,
  setProcedures,
  id
}) => {
  const router = useRouter();
  const [image, setImage] = useState<File>();

  let recipeMutation;
  if (formType === 'create-recipe') {
    recipeMutation = useCreateRecipeMutation;
  } else {
    recipeMutation = useUpdateRecipeMutation;
  }
  const [recipeFunction] = recipeMutation();
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={async (values) => {
        console.log(image);
        await recipeFunction({
          variables: {
            [formType === 'edit-recipe' && 'id']: id,
            image: image && image,
            name: values.name,
            ingredients,
            procedures
          },
          update: (cache) => {
            cache.evict({ fieldName: 'recipes:{}' });
          }
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
                        Drag 'n' drop some files here, or click to select files
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
              {formType === 'create-recipe' ? 'Create Recipe' : 'Edit Recipe'}
            </Button>
            {/* <FormErrorMessage>{form.errors.name}</FormErrorMessage> */}
          </FormControl>
        </Form>
      )}
    </Formik>
  );
};
